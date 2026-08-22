import { describe, expect, it } from 'vitest';
import { emailValido, mensagemErroAuth } from '../js/authMessages.js';

describe('emailValido', () => {
  it('aceita e-mails simples', () => {
    expect(emailValido('vanessa@example.com')).toBe(true);
  });

  it('rejeita vazio e formato inválido', () => {
    expect(emailValido('')).toBe(false);
    expect(emailValido('sem-arroba')).toBe(false);
    expect(emailValido('a@b')).toBe(false);
  });
});

describe('mensagemErroAuth', () => {
  it('traduz códigos do Parse', () => {
    expect(mensagemErroAuth({ code: 101 })).toBe('E-mail ou senha incorretos.');
    expect(mensagemErroAuth({ code: 202 })).toBe('Já existe uma conta com esse e-mail.');
  });

  it('usa fallback quando não há código conhecido', () => {
    expect(mensagemErroAuth({ message: 'timeout' })).toBe('timeout');
    expect(mensagemErroAuth({})).toBe('Não foi possível autenticar. Tente de novo.');
  });
});
