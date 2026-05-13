// Cliente da API da NASA.
// Por enquanto só pega a foto do dia (APOD).
// Depois eu adiciono os outros endpoints aqui.

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