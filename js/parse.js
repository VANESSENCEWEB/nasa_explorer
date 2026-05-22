// Cliente do Back4app via Parse SDK.
// Aqui faço o CRUD completo da classe Favorite.

// As keys vêm de back4app.com → App Settings → Security & Keys.
const APP_ID = 'TaNXXG1REQ03jg9PgO8Q3NC82UOLOkEBugKliCkl';
const JS_KEY = 'IwZTRZzl0VJuN6Z2EIv2xaeuBkUKHTjgoXagH1Zp';
const SERVER_URL = 'https://parseapi.back4app.com/';

Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

const Favorite = Parse.Object.extend('Favorite');

// CREATE — cria um favorito novo no Back4app.
// Recebe um objeto com tipo, nasaId, titulo, imageUrl e (opcional) userNote.
export async function criarFavorito(dados) {
  const fav = new Favorite();
  fav.set('tipo', dados.tipo);
  fav.set('nasaId', dados.nasaId);
  fav.set('titulo', dados.titulo);
  fav.set('imageUrl', dados.imageUrl || '');
  fav.set('userNote', dados.userNote || '');

  const salvo = await fav.save();
  return salvo;
}

// READ — lista todos os favoritos, do mais recente pro mais antigo.
export async function listarFavoritos() {
  const query = new Parse.Query(Favorite);
  query.descending('createdAt');
  query.limit(100);

  const resultados = await query.find();

  // Transformo em objetos simples (sem precisar do Parse pra acessar).
  return resultados.map(f => ({
    id: f.id,
    tipo: f.get('tipo'),
    nasaId: f.get('nasaId'),
    titulo: f.get('titulo'),
    imageUrl: f.get('imageUrl'),
    userNote: f.get('userNote'),
    createdAt: f.get('createdAt')
  }));
}

// UPDATE — atualiza a nota pessoal de um favorito.
export async function atualizarNota(id, novaNota) {
  const query = new Parse.Query(Favorite);
  const fav = await query.get(id);
  fav.set('userNote', novaNota);

  const atualizado = await fav.save();
  return atualizado;
}

// DELETE — remove um favorito.
export async function deletarFavorito(id) {
  const query = new Parse.Query(Favorite);
  const fav = await query.get(id);
  await fav.destroy();
  return true;
}

// HELPER — verifica se um item já tá favoritado (pelo nasaId).
// Útil pros botões de "favoritar" saberem se já foi salvo.
export async function estaSalvo(nasaId) {
  const query = new Parse.Query(Favorite);
  query.equalTo('nasaId', nasaId);

  const encontrado = await query.first();
  return encontrado ? encontrado.id : null;
}