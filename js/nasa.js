// Cliente da API da NASA.
// Em produção as rotas autenticadas passam por /api/nasa (chave só no servidor).
// No servidor estático local, o proxy não existe e usamos a DEMO_KEY pública da NASA.

const NASA_HOST = 'https://api.nasa.gov';
const FETCH_TIMEOUT_MS = 15000;
const NEO_CACHE_MS = 10 * 60 * 1000;

async function fetchJson(url, mensagemErro) {
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

  if (!response.ok) {
    throw new Error(`${mensagemErro}: ${response.status}`);
  }

  return response.json();
}

async function fetchNasa(tipo, params, mensagemErro) {
  const query = new URLSearchParams({ tipo, ...params });
  const proxyUrl = `/api/nasa?${query.toString()}`;

  try {
    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (response.ok) return response.json();
    if (response.status !== 404) {
      throw new Error(`${mensagemErro}: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(`${mensagemErro}:`)) {
      throw error;
    }
  }

  const direto = new URL(tipo === 'apod' ? '/planetary/apod' : '/neo/rest/v1/feed', NASA_HOST);
  direto.searchParams.set('api_key', 'DEMO_KEY');
  for (const [chave, valor] of Object.entries(params)) {
    if (valor) direto.searchParams.set(chave, valor);
  }

  return fetchJson(direto.toString(), mensagemErro);
}

function isoOffset(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
}

export function normalizarAsteroides(data) {
  const lista = [];
  const agrupados = data?.near_earth_objects || {};

  for (const dataDoDia in agrupados) {
    for (const asteroide of agrupados[dataDoDia]) {
      const aproximacao = asteroide.close_approach_data?.[0];
      if (!aproximacao) continue;

      const diametroMin = asteroide.estimated_diameter.meters.estimated_diameter_min;
      const diametroMax = asteroide.estimated_diameter.meters.estimated_diameter_max;

      lista.push({
        id: asteroide.id,
        nome: String(asteroide.name || '').replace(/[()]/g, '').trim(),
        data: dataDoDia,
        diametro: Math.round((diametroMin + diametroMax) / 2),
        velocidade: parseFloat(aproximacao.relative_velocity.kilometers_per_second),
        distancia_lunar: parseFloat(aproximacao.miss_distance.lunar),
        perigoso: asteroide.is_potentially_hazardous_asteroid
      });
    }
  }

  lista.sort((a, b) => a.distancia_lunar - b.distancia_lunar);
  return lista;
}

export function normalizarImagens(data) {
  const itens = (data?.collection?.items ?? []).map((item) => {
    const info = item.data?.[0];
    const link = item.links?.[0];
    if (!info) return null;

    return {
      id: info.nasa_id,
      titulo: info.title,
      descricao: info.description || '',
      data: info.date_created ? info.date_created.split('T')[0] : '',
      imagem: link ? link.href : ''
    };
  }).filter(Boolean);

  return itens.filter((item) => item.imagem !== '');
}

export async function fetchApod() {
  let ultimoErro = new Error('Erro ao buscar foto da NASA');

  for (let diasAtras = 0; diasAtras <= 2; diasAtras++) {
    try {
      const params = diasAtras === 0 ? {} : { date: isoOffset(-diasAtras) };
      return await fetchNasa('apod', params, 'Erro ao buscar foto da NASA');
    } catch (error) {
      ultimoErro = error;
    }
  }

  throw ultimoErro;
}

export async function fetchNeoFeed(dataInicio, dataFim) {
  const cacheKey = `neo:${dataInicio}:${dataFim}`;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { at, lista } = JSON.parse(cached);
      if (Date.now() - at < NEO_CACHE_MS && Array.isArray(lista)) return lista;
    }
  } catch {
    // sessionStorage pode estar indisponível (Safari privado / testes).
  }

  const data = await fetchNasa(
    'neo',
    { start_date: dataInicio, end_date: dataFim },
    'Erro ao buscar asteroides'
  );
  const lista = normalizarAsteroides(data);

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), lista }));
  } catch {
    // ignore quota / private mode
  }

  return lista;
}

export async function buscarImagensNasa(termo) {
  const data = await fetchJson(
    `https://images-api.nasa.gov/search?q=${encodeURIComponent(termo)}&media_type=image`,
    'Erro ao buscar imagens'
  );
  return normalizarImagens(data);
}
