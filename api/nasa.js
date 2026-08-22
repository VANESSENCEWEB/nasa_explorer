// Proxy serverless da NASA API.
// A chave fica no servidor (env NASA_API_KEY). Sem isso, o client não vê o token.

const NASA_BASE = 'https://api.nasa.gov';
const FETCH_TIMEOUT_MS = 15000;

function nasaKey() {
  // Preferência: env na Vercel. Fallback só para o deploy atual continuar no ar
  // até a chave ser configurada e, se possível, rotacionada em api.nasa.gov.
  return process.env.NASA_API_KEY || '70IcSHfoJNS203UhQt7rOczSFwOskdpDyUhoiZ1P';
}

async function fetchNasa(pathWithQuery) {
  const key = nasaKey();
  if (!key) {
    const error = new Error('NASA_API_KEY não configurada');
    error.statusCode = 500;
    throw error;
  }

  const url = `${NASA_BASE}${pathWithQuery}${pathWithQuery.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(key)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

  if (!response.ok) {
    const error = new Error(`NASA API ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

function dataIso(offsetDias = 0) {
  const data = new Date();
  data.setUTCDate(data.getUTCDate() + offsetDias);
  return data.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  const tipo = String(req.query.tipo || '');

  try {
    if (tipo === 'apod') {
      const data = typeof req.query.date === 'string' ? req.query.date : '';
      const path = data
        ? `/planetary/apod?date=${encodeURIComponent(data)}`
        : '/planetary/apod';
      const payload = await fetchNasa(path);
      res.status(200).json(payload);
      return;
    }

    if (tipo === 'neo') {
      const inicio = typeof req.query.start_date === 'string' ? req.query.start_date : dataIso(-6);
      const fim = typeof req.query.end_date === 'string' ? req.query.end_date : dataIso(0);
      const payload = await fetchNasa(
        `/neo/rest/v1/feed?start_date=${encodeURIComponent(inicio)}&end_date=${encodeURIComponent(fim)}`
      );
      res.status(200).json(payload);
      return;
    }

    res.status(400).json({ error: 'Tipo inválido. Use tipo=apod ou tipo=neo.' });
  } catch (error) {
    const status = error.statusCode || 502;
    res.status(status).json({ error: error.message || 'Falha ao consultar a NASA' });
  }
}
