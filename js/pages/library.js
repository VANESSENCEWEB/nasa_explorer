import { buscarImagensNasa } from '../nasa.js';
import { criarFavorito, estaSalvo, deletarFavorito } from '../parse.js';
import { $, escapeHtml, isSafeHttpUrl } from '../dom.js';
import { mostrarToast, abrirLightbox } from '../ui.js';

export function iniciarLibrary() {
  const form = $('form-busca');
  const campo = $('campo-busca');
  const info = $('info');
  const galeria = $('galeria');
  const sugestoes = document.querySelectorAll('.sugestao');

  if (!form || !campo || !info || !galeria) return;

  const favoritados = new Map();

  async function buscar(termo) {
    info.textContent = `BUSCANDO POR "${termo}"...`;
    galeria.replaceChildren();

    try {
      const itens = await buscarImagensNasa(termo);

      if (itens.length === 0) {
        info.textContent = `Nenhuma imagem encontrada para "${termo}". Tente outra busca.`;
        return;
      }

      const itensMostrados = itens.slice(0, 24);
      info.textContent = `${itensMostrados.length} DE ${itens.length} IMAGENS · BUSCA: "${termo}"`;

      favoritados.clear();
      await Promise.all(itensMostrados.map(async (item) => {
        const id = await estaSalvo(item.id);
        if (id) favoritados.set(item.id, id);
      }));

      galeria.innerHTML = itensMostrados.map((item) => {
        const salvo = favoritados.has(item.id);
        const titulo = escapeHtml(item.titulo);
        const src = isSafeHttpUrl(item.imagem) ? escapeHtml(item.imagem) : '';
        if (!src) return '';

        return `
          <div class="group relative bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors">
            <button type="button" class="gallery-card w-full text-left" data-src="${src}" data-caption="${titulo}" aria-label="Ampliar ${titulo}">
              <img src="${src}" alt="${titulo}" loading="lazy" class="w-full aspect-square object-cover pointer-events-none" />
            </button>
            <button
              type="button"
              class="btn-fav absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-sm hover:bg-black/80 transition ${salvo ? 'text-glow' : 'text-white'}"
              data-nasa-id="${escapeHtml(item.id)}"
              data-titulo="${titulo}"
              data-imagem="${src}"
              aria-pressed="${salvo}"
              aria-label="${salvo ? `Remover ${titulo} dos favoritos` : `Salvar ${titulo} nos favoritos`}"
            >${salvo ? '★' : '☆'}</button>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div class="text-[10px] font-mono text-glow tracking-widest mb-1">${escapeHtml(item.data)}</div>
              <div class="text-xs text-white line-clamp-2">${titulo}</div>
            </div>
          </div>
        `;
      }).join('');

      galeria.querySelectorAll('.gallery-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          abrirLightbox({
            src: btn.dataset.src,
            alt: btn.dataset.caption,
            caption: btn.dataset.caption
          });
        });
      });

      galeria.querySelectorAll('.btn-fav').forEach((btn) => {
        btn.addEventListener('click', async (evento) => {
          evento.stopPropagation();
          const nasaId = btn.dataset.nasaId;
          const titulo = btn.dataset.titulo;
          const imagem = btn.dataset.imagem;

          btn.disabled = true;
          try {
            if (favoritados.has(nasaId)) {
              await deletarFavorito(favoritados.get(nasaId));
              favoritados.delete(nasaId);
              btn.textContent = '☆';
              btn.classList.remove('text-glow');
              btn.classList.add('text-white');
              btn.setAttribute('aria-pressed', 'false');
              mostrarToast('Imagem removida dos favoritos.', 'ok');
            } else {
              const salvo = await criarFavorito({
                tipo: 'image',
                nasaId,
                titulo,
                imageUrl: imagem
              });
              favoritados.set(nasaId, salvo.id);
              btn.textContent = '★';
              btn.classList.add('text-glow');
              btn.classList.remove('text-white');
              btn.setAttribute('aria-pressed', 'true');
              mostrarToast('Imagem salva nos favoritos.', 'ok');
            }
          } catch (erro) {
            console.error(erro);
            mostrarToast('Não foi possível atualizar o favorito.', 'erro');
          } finally {
            btn.disabled = false;
          }
        });
      });
    } catch (erro) {
      console.error(erro);
      info.innerHTML = `<span class="text-nasa">ERRO · ${escapeHtml(erro.message)}</span>`;
    }
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const termo = campo.value.trim();
    if (termo) buscar(termo);
  });

  sugestoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      const termo = btn.dataset.termo;
      campo.value = termo;
      buscar(termo);
    });
  });

  buscar('mars rover');
}
