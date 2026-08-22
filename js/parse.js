// Cliente do Back4app via Parse SDK.
// Aqui faço o CRUD completo da classe Favorite.

const APP_ID = 'TaNXXG1REQ03jg9PgO8Q3NC82UOLOkEBugKliCkl';
const JS_KEY = 'IwZTRZzl0VJuN6Z2EIv2xaeuBkUKHTjgoXagH1Zp';
const SERVER_URL = 'https://parseapi.back4app.com/';

let Favorite = null;

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

export async function criarFavorito(dados) {
  getParse();
  const fav = new Favorite();
  fav.set('tipo', dados.tipo);
  fav.set('nasaId', dados.nasaId);
  fav.set('titulo', dados.titulo);
  fav.set('imageUrl', dados.imageUrl || '');
  fav.set('userNote', dados.userNote || '');

  const salvo = await fav.save();
  return paraFavoritoSimples(salvo);
}

export async function listarFavoritos() {
  const query = criarQuery();
  query.descending('createdAt');
  query.limit(100);

  const resultados = await query.find();
  return resultados.map(paraFavoritoSimples);
}

export async function atualizarNota(id, novaNota) {
  const query = criarQuery();
  const fav = await query.get(id);
  fav.set('userNote', novaNota);

  const atualizado = await fav.save();
  return paraFavoritoSimples(atualizado);
}

export async function deletarFavorito(id) {
  const query = criarQuery();
  const fav = await query.get(id);
  await fav.destroy();
  return true;
}

export async function estaSalvo(nasaId) {
  const query = criarQuery();
  query.equalTo('nasaId', nasaId);

  const encontrado = await query.first();
  return encontrado ? encontrado.id : null;
}
