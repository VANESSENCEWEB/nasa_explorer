
// Cliente da API da NASA.
// Aqui ficam todas as funções que conversam com a NASA.

// Minha chave da NASA (gerei em api.nasa.gov).
// TODO: usar DEMO_KEY enquanto não termino o projeto, depois troco pela minha.
const API_KEY = '70IcSHfoJNS203UhQt7rOczSFwOskdpDyUhoiZ1P';


const BASE_URL = 'https://api.nasa.gov';

// Busca a foto astronômica do dia.
// A API retorna um objeto com: title, url, hdurl, explanation, date, media_type, copyright.
// O media_type pode ser "image" ou "video" (em alguns dias é vídeo do YouTube).
export async function fetchApod() {
  const url = `${BASE_URL}/planetary/apod?api_key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao buscar foto da NASA: ' + response.status);
  }

  const data = await response.json();
  return data;
}

// Busca asteroides próximos da Terra num intervalo de datas.
// Importante: a NASA só aceita no máximo 7 dias de diferença entre as datas.
// As datas devem estar no formato YYYY-MM-DD (ex: "2026-05-13").
export async function fetchNeoFeed(dataInicio, dataFim) {
  const url = `${BASE_URL}/neo/rest/v1/feed?start_date=${dataInicio}&end_date=${dataFim}&api_key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao buscar asteroides: ' + response.status);
  }

  const data = await response.json();

  // A API retorna os asteroides agrupados por dia, num objeto tipo:
  // { "2026-05-13": [...], "2026-05-14": [...] }
  // Eu prefiro uma lista única com só os campos que vou usar,
  // então transformo aqui antes de retornar.
  const lista = [];

  for (const data_do_dia in data.near_earth_objects) {
    const asteroides_do_dia = data.near_earth_objects[data_do_dia];

    for (const a of asteroides_do_dia) {
      // O primeiro item de close_approach_data é o que tem
      // os dados da aproximação que importa pra gente.
      const aproximacao = a.close_approach_data[0];

      // Diâmetro vem em metros, com um valor mínimo e máximo.
      // Calculo a média pra ter um número só.
      const diametro_min = a.estimated_diameter.meters.estimated_diameter_min;
      const diametro_max = a.estimated_diameter.meters.estimated_diameter_max;
      const diametro_medio = Math.round((diametro_min + diametro_max) / 2);

      lista.push({
        id: a.id,
        nome: a.name.replace(/[()]/g, '').trim(),
        data: data_do_dia,
        diametro: diametro_medio,
        velocidade: parseFloat(aproximacao.relative_velocity.kilometers_per_second),
        distancia_lunar: parseFloat(aproximacao.miss_distance.lunar),
        perigoso: a.is_potentially_hazardous_asteroid
      });
    }
  }

  // Ordeno do mais próximo da Terra pro mais distante.
  lista.sort((a, b) => a.distancia_lunar - b.distancia_lunar);

  return lista;
}