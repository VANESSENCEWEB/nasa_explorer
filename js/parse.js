// Cliente do Back4app via Parse SDK.
// CRUD da classe Favorite + autenticação com Parse Users.

import { mensagemErroAuth } from './authMessages.js';

const APP_ID = 'TaNXXG1REQ03jg9PgO8Q3NC82UOLOkEBugKliCkl';
const JS_KEY = 'IwZTRZzl0VJuN6Z2EIv2xaeuBkUKHTjgoXagH1Zp';
const SERVER_URL = 'https://parseapi.back4app.com/';

let Favorite = null;

export class AuthNecessariaError extends Error {
  constructor() {
    super('Entre na sua conta para usar os favoritos.');
    this.name = 'AuthNecessariaError';
    this.code = 'AUTH_REQUIRED';
  }
}

function getParse() {
  const ParseSDK = window.Parse;
  if (!ParseSDK) {
    throw new Error('Parse SDK não carregou. Verifique a conexão e recarregue a página.');
  }

  if (!Favorite) {
    ParseSDK.initialize(APP_ID, JS_KEY);
    ParseSDK.serverURL = SERVER_URL;
    Favorite = ParseSDK.Object.extend('Favorite');
  }

  return ParseSDK;
}

function criarQuery() {
  const ParseSDK = getParse();
  return new ParseSDK.Query(Favorite);
}

function paraFavoritoSimples(objeto) {
  return {
    id: objeto.id,
    tipo: objeto.get('tipo'),
    nasaId: objeto.get('nasaId'),
    titulo: objeto.get('titulo'),
    imageUrl: objeto.get('imageUrl'),
    userNote: objeto.get('userNote'),
    createdAt: objeto.get('createdAt')
  };
}

export function usuarioAtual() {
  try {
    return getParse().User.current() || null;
  } catch {
    return null;
  }
}

function exigirUsuario() {
  const user = usuarioAtual();
  if (!user) throw new AuthNecessariaError();
  return user;
}

export async function cadastrar(email, senha) {
  const ParseSDK = getParse();
  const user = new ParseSDK.User();
  const emailLimpo = String(email || '').trim().toLowerCase();
  user.set('username', emailLimpo);
  user.set('email', emailLimpo);
  user.set('password', senha);

  try {
    await user.signUp();
    return user;
  } catch (error) {
    throw new Error(mensagemErroAuth(error));
  }
}

export async function entrar(email, senha) {
  const ParseSDK = getParse();
  try {
    return await ParseSDK.User.logIn(String(email || '').trim().toLowerCase(), senha);
  } catch (error) {
    throw new Error(mensagemErroAuth(error));
  }
}

export async function sair() {
  const ParseSDK = getParse();
  await ParseSDK.User.logOut();
}

export async function criarFavorito(dados) {
  const ParseSDK = getParse();
  const user = exigirUsuario();
  const fav = new Favorite();
  fav.set('tipo', dados.tipo);
  fav.set('nasaId', dados.nasaId);
  fav.set('titulo', dados.titulo);
  fav.set('imageUrl', dados.imageUrl || '');
  fav.set('userNote', dados.userNote || '');
  fav.set('user', user);
  fav.setACL(new ParseSDK.ACL(user));

  const salvo = await fav.save();
  return paraFavoritoSimples(salvo);
}

export async function listarFavoritos() {
  const user = usuarioAtual();
  if (!user) return [];

  try {
    const query = criarQuery();
    query.equalTo('user', user);
    query.descending('createdAt');
    query.limit(100);

    const resultados = await query.find();
    return resultados.map(paraFavoritoSimples);
  } catch (error) {
    if (error?.code === 119) {
      throw new Error('Sem permissão para ler favoritos. No Back4app, em Favorite → Security, marque Find e Get em Authenticated.');
    }
    throw error;
  }
}

export async function atualizarNota(id, novaNota) {
  exigirUsuario();
  const query = criarQuery();
  const fav = await query.get(id);
  fav.set('userNote', novaNota);

  const atualizado = await fav.save();
  return paraFavoritoSimples(atualizado);
}

export async function deletarFavorito(id) {
  exigirUsuario();
  const query = criarQuery();
  const fav = await query.get(id);
  await fav.destroy();
  return true;
}

export async function estaSalvo(nasaId) {
  const user = usuarioAtual();
  if (!user) return null;

  try {
    const query = criarQuery();
    query.equalTo('user', user);
    query.equalTo('nasaId', nasaId);

    const encontrado = await query.first();
    return encontrado ? encontrado.id : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
