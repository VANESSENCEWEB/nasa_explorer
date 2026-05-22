// Cliente do Back4app via Parse SDK.
// Aqui inicializo a conexão e exporto funções pra fazer o CRUD
// na classe Favorite que criei no painel do Back4app.

// As keys vêm de back4app.com → App Settings → Security & Keys.
const APP_ID = 'TaNXXG1REQ03jg9PgO8Q3NC82UOLOkEBugKliCkl';
const JS_KEY = 'IwZTRZzl0VJuN6Z2EIv2xaeuBkUKHTjgoXagH1Zp';
const SERVER_URL = 'https://parseapi.back4app.com/';

// Inicializa o SDK. Tem que rodar antes de qualquer operação.
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

// Pega referência da classe Favorite que criei lá.
const Favorite = Parse.Object.extend('Favorite');

// Função de teste pra ver se a conexão tá funcionando.
// Tenta buscar a lista de favoritos. Se conectar, retorna [].
// Se a configuração tiver errada, lança erro.
export async function testarConexao() {
  const query = new Parse.Query(Favorite);
  const resultados = await query.find();
  return resultados;
}