import { cadastrar, entrar, listarFavoritos, atualizarNota, deletarFavorito, usuarioAtual } from '../parse.js';
import { emailValido } from '../authMessages.js';
import { $, escapeHtml, isSafeHttpUrl } from '../dom.js';
import { mostrarToast, abrirLightbox } from '../ui.js';

function obterTipoLabel(tipo) {
  const labels = {
    apod: 'FOTO ASTRONÔMICA',
    neo: 'ASTEROIDE',
    image: 'IMAGEM'
  };
  return labels[tipo] || String(tipo || '').toUpperCase();
}

function obterIconeTipo(tipo) {
  return tipo === 'neo' ? '☄️' : '✨';
}

export function iniciarFavoritos() {
  const info = $('info');
  const lista = $('lista');
  const vazio = $('vazio');
  const painelAuth = $('painel-auth');
  const painelColecao = $('painel-colecao');
  if (!info || !lista || !vazio || !painelAuth || !painelColecao) return;

  const formAuth = $('form-auth');
  const tabEntrar = $('tab-entrar');
  const tabCadastrar = $('tab-cadastrar');
  const campoEmail = $('auth-email');
  const campoSenha = $('auth-senha');
  const wrapConfirma = $('auth-confirma-wrap');
  const campoConfirma = $('auth-confirma');
  const authErro = $('auth-erro');
  const btnAuth = $('btn-auth');

  let modoCadastro = false;

  function mostrarErroAuth(texto) {
    authErro.textContent = texto;
    authErro.classList.remove('hidden');
  }

  function limparErroAuth() {
    authErro.textContent = '';
    authErro.classList.add('hidden');
  }

  function atualizarAbas() {
    tabEntrar.classList.toggle('is-active', !modoCadastro);
    tabCadastrar.classList.toggle('is-active', modoCadastro);
    tabEntrar.setAttribute('aria-selected', String(!modoCadastro));
    tabCadastrar.setAttribute('aria-selected', String(modoCadastro));
    wrapConfirma.classList.toggle('hidden', !modoCadastro);
    campoConfirma.required = modoCadastro;
    btnAuth.textContent = modoCadastro ? 'Criar conta' : 'Entrar';
    campoSenha.autocomplete = modoCadastro ? 'new-password' : 'current-password';
    limparErroAuth();
  }

  tabEntrar.addEventListener('click', () => {
    modoCadastro = false;
    atualizarAbas();
  });

  tabCadastrar.addEventListener('click', () => {
    modoCadastro = true;
    atualizarAbas();
  });

  formAuth.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limparErroAuth();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    if (!emailValido(email)) {
      mostrarErroAuth('Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      mostrarErroAuth('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (modoCadastro && senha !== campoConfirma.value) {
      mostrarErroAuth('As senhas não coincidem.');
      return;
    }

    btnAuth.disabled = true;
    try {
      if (modoCadastro) await cadastrar(email, senha);
      else await entrar(email, senha);
      window.location.reload();
    } catch (error) {
      mostrarErroAuth(error.message);
    } finally {
      btnAuth.disabled = false;
    }
  });

  async function carregar() {
    const user = usuarioAtual();

    if (!user) {
      painelAuth.classList.remove('hidden');
      painelColecao.classList.add('hidden');
      return;
    }

    painelAuth.classList.add('hidden');
    painelColecao.classList.remove('hidden');

    try {
      const favoritos = await listarFavoritos();

      if (favoritos.length === 0) {
        info.classList.add('hidden');
        vazio.classList.remove('hidden');
        lista.replaceChildren();
        return;
      }

      info.classList.remove('hidden');
      vazio.classList.add('hidden');
      info.textContent = `${favoritos.length} ${favoritos.length === 1 ? 'FAVORITO' : 'FAVORITOS'} NA SUA CONTA`;

      lista.innerHTML = favoritos.map((fav) => {
        const dataFormatada = escapeHtml(new Date(fav.createdAt).toLocaleDateString('pt-BR'));
        const tipoLabel = escapeHtml(obterTipoLabel(fav.tipo));
        const titulo = escapeHtml(fav.titulo);
        const nota = escapeHtml(fav.userNote || '');
        const src = isSafeHttpUrl(fav.imageUrl) ? escapeHtml(fav.imageUrl) : '';

        const imagemHtml = src
          ? `<button type="button" class="gallery-card w-full" data-src="${src}" data-caption="${titulo}" aria-label="Ampliar ${titulo}">
               <img src="${src}" alt="${titulo}" class="w-full aspect-video object-cover pointer-events-none" loading="lazy" />
             </button>`
          : `<div class="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
               <div class="text-3xl" aria-hidden="true">${obterIconeTipo(fav.tipo)}</div>
             </div>`;

        return `
          <article class="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors" data-id="${escapeHtml(fav.id)}">
            ${imagemHtml}
            <div class="p-4">
              <div class="text-[10px] font-mono text-glow tracking-widest mb-2">${tipoLabel} · ${dataFormatada}</div>
              <h2 class="text-sm text-white font-medium mb-3 line-clamp-2">${titulo}</h2>
              <label class="sr-only" for="nota-${escapeHtml(fav.id)}">Nota pessoal de ${titulo}</label>
              <textarea
                id="nota-${escapeHtml(fav.id)}"
                data-id="${escapeHtml(fav.id)}"
                class="nota w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-glow transition-colors resize-none"
                placeholder="Sua nota pessoal..."
                rows="2"
              >${nota}</textarea>
              <div class="flex gap-2 mt-3">
                <button type="button" data-id="${escapeHtml(fav.id)}" class="btn-salvar text-[11px] bg-glow/10 border border-glow/30 text-glow rounded px-3 py-1.5 hover:bg-glow/20 transition flex-1">
                  Salvar nota
                </button>
                <button type="button" data-id="${escapeHtml(fav.id)}" class="btn-deletar text-[11px] bg-nasa/10 border border-nasa/30 text-red-300 rounded px-3 py-1.5 hover:bg-nasa/20 transition">
                  Remover
                </button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      lista.querySelectorAll('.gallery-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          abrirLightbox({
            src: btn.dataset.src,
            alt: btn.dataset.caption,
            caption: btn.dataset.caption
          });
        });
      });

      lista.querySelectorAll('.btn-salvar').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const textarea = document.querySelector(`textarea.nota[data-id="${id}"]`);
          const novaNota = textarea?.value ?? '';

          btn.textContent = 'Salvando...';
          btn.disabled = true;

          try {
            await atualizarNota(id, novaNota);
            btn.textContent = 'Salvo!';
            mostrarToast('Nota atualizada.', 'ok');
            setTimeout(() => {
              btn.textContent = 'Salvar nota';
              btn.disabled = false;
            }, 1500);
          } catch (error_) {
            btn.textContent = 'Erro';
            btn.disabled = false;
            console.error(error_);
            mostrarToast('Não foi possível salvar a nota.', 'erro');
          }
        });
      });

      lista.querySelectorAll('.btn-deletar').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!window.confirm('Remover esse favorito?')) return;

          const id = btn.dataset.id;
          const card = btn.closest('[data-id]');
          btn.textContent = 'Removendo...';
          btn.disabled = true;

          try {
            await deletarFavorito(id);
            mostrarToast('Favorito removido.', 'ok');
            if (card) {
              card.style.opacity = '0';
              card.style.transition = 'opacity 0.3s';
              setTimeout(() => {
                card.remove();
                if (lista.children.length === 0) {
                  info.classList.add('hidden');
                  vazio.classList.remove('hidden');
                } else {
                  info.textContent = `${lista.children.length} ${lista.children.length === 1 ? 'FAVORITO' : 'FAVORITOS'} NA SUA CONTA`;
                }
              }, 300);
            }
          } catch (error_) {
            btn.textContent = 'Erro';
            btn.disabled = false;
            console.error(error_);
            mostrarToast('Não foi possível remover o favorito.', 'erro');
          }
        });
      });
    } catch (error_) {
      console.error(error_);
      info.innerHTML = `<span class="text-nasa">ERRO · ${escapeHtml(error_.message)}</span>`;
    }
  }

  atualizarAbas();
  carregar();
}
