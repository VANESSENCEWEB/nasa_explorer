// Cliente da API da NASA.
// Aqui ficam todas as funções que conversam com a NASA.

const API_KEY = '70IcSHfoJNS203UhQt7rOczSFwOskdpDyUhoiZ1P';
const BASE_URL = 'https://api.nasa.gov';
const FETCH_TIMEOUT_MS = 15000;

async function fetchJson(url, mensagemErro) {
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

  if (!response.ok) {
    throw new Error(`${mensagemErro}: ${response.status}`);
  }

  return response.json();
}

// Busca a foto astronômica do dia.
// A API retorna um objeto com: title, url, hdurl, explanation, date, media_type, copyright.
// O media_type pode ser "image" ou "video" (em alguns dias é vídeo do YouTube).
export async function fetchApod() {
  return fetchJson(
    `${BASE_URL}/planetary/apod?api_key=${API_KEY}`,
    'Erro ao buscar foto da NASA'
  );
}

// Busca asteroides próximos da Terra num intervalo de datas.
// Importante: a NASA só aceita no máximo 7 dias de diferença entre as datas.
// As datas devem estar no formato YYYY-MM-DD (ex: "2026-05-13").
export async function fetchNeoFeed(dataInicio, dataFim) {
  const data = await fetchJson(
    `${BASE_URL}/neo/rest/v1/feed?start_date=${dataInicio}&end_date=${dataFim}&api_key=${API_KEY}`,
    'Erro ao buscar asteroides'
  );

  // A API retorna os asteroides agrupados por dia, num objeto tipo:
  // { "2026-05-13": [...], "2026-05-14": [...] }
  // Eu prefiro uma lista única com só os campos que vou usar,
  // então transformo aqui antes de retornar.
  const lista = [];

  for (const data_do_dia in data.near_earth_objects) {
    const asteroides_do_dia = data.near_earth_objects[data_do_dia];

    for (const asteroide of asteroides_do_dia) {
      const aproximacao = asteroide.close_approach_data[0];
      if (!aproximacao) continue;

      const diametro_min = asteroide.estimated_diameter.meters.estimated_diameter_min;
      const diametro_max = asteroide.estimated_diameter.meters.estimated_diameter_max;
      const diametro_medio = Math.round((diametro_min + diametro_max) / 2);

      lista.push({
        id: asteroide.id,
        nome: asteroide.name.replace(/[()]/g, '').trim(),
        data: data_do_dia,
        diametro: diametro_medio,
        velocidade: parseFloat(aproximacao.relative_velocity.kilometers_per_second),
        distancia_lunar: parseFloat(aproximacao.miss_distance.lunar),
        perigoso: asteroide.is_potentially_hazardous_asteroid
      });
    }
  }

  lista.sort((a, b) => a.distancia_lunar - b.distancia_lunar);
  return lista;
}

// Busca imagens da NASA Image Library com base num termo de busca.
// Essa API não precisa de chave de API e tem mais de 150 mil imagens.
export async function buscarImagensNasa(termo) {
  const data = await fetchJson(
    `https://images-api.nasa.gov/search?q=${encodeURIComponent(termo)}&media_type=image`,
    'Erro ao buscar imagens'
  );

  const itens = (data.collection?.items ?? []).map((item) => {
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
