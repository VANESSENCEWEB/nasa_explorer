// Mensagens de erro do Parse User — sem depender do SDK (fácil de testar).

export function mensagemErroAuth(error) {
  const codigo = error?.code;
  const mapa = {
    101: 'E-mail ou senha incorretos.',
    125: 'E-mail inválido.',
    200: 'Informe um e-mail.',
    201: 'Informe uma senha.',
    202: 'Já existe uma conta com esse e-mail.',
    203: 'Esse e-mail já está em uso.',
    205: 'Não encontramos uma conta com esse e-mail.'
  };

  if (codigo && mapa[codigo]) return mapa[codigo];
  if (error?.message) return String(error.message);
  return 'Não foi possível autenticar. Tente de novo.';
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}
