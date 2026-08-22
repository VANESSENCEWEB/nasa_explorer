import { fetchApod, fetchNeoFeed } from '../nasa.js';
import { criarFavorito, estaSalvo, deletarFavorito, listarFavoritos } from '../parse.js';
import { $, isSafeHttpUrl, prefersReducedMotion } from '../dom.js';
import { mostrarToast, abrirLightbox } from '../ui.js';

export function iniciarHome() {
  const container = $('apod-container');
  const loading = $('apod-loading');
  const dateLabel = $('apod-date-label');
  const titleEl = $('apod-title');
  const explanationEl = $('apod-explanation');
  const copyrightEl = $('apod-copyright');
  const btnFavoritar = $('btn-favoritar');
  const btnTexto = $('btn-favoritar-texto');

  if (!container || !btnFavoritar) return;

  let apodAtual = null;
  let idFavoritoSalvo = null;

  function atualizarBotao() {
    if (idFavoritoSalvo) {
      btnTexto.textContent = '★ Salvo';
      btnFavoritar.classList.add('text-glow', 'border-glow/40');
      btnFavoritar.setAttribute('aria-pressed', 'true');
      btnFavoritar.setAttribute('aria-label', 'Remover foto dos favoritos');
    } else {
      btnTexto.textContent = '☆ Salvar';
      btnFavoritar.classList.remove('text-glow', 'border-glow/40');
      btnFavoritar.setAttribute('aria-pressed', 'false');
      btnFavoritar.setAttribute('aria-label', 'Salvar foto nos favoritos');
    }
  }

  function renderizarMidia(data) {
    container.replaceChildren();

    if (data.media_type === 'video') {
      if (data.url?.endsWith('.mp4') && isSafeHttpUrl(data.url)) {
        const video = document.createElement('video');
        video.src = data.url;
        video.className = 'w-full h-full object-cover';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = true;
        container.appendChild(video);
        return;
      }

      if (isSafeHttpUrl(data.url)) {
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.className = 'w-full h-full';
        iframe.title = data.title || 'Vídeo astronômico do dia';
        iframe.allowFullscreen = true;
        iframe.setAttribute('loading', 'lazy');
        container.appendChild(iframe);
        return;
      }

      container.textContent = 'Mídia indisponível para este dia.';
      return;
    }

    const src = isSafeHttpUrl(data.url) ? data.url : (isSafeHttpUrl(data.hdurl) ? data.hdurl : '');
    if (!src) {
      container.textContent = 'Imagem indisponível para este dia.';
      return;
    }

    const img = document.createElement('img');
    img.src = src;
    img.alt = data.title || 'Foto astronômica do dia';
    img.className = 'w-full h-full object-cover cursor-zoom-in';
    img.fetchPriority = 'high';
    img.addEventListener('click', () => {
      abrirLightbox({
        src: isSafeHttpUrl(data.hdurl) ? data.hdurl : src,
        alt: data.title || '',
        caption: data.title || ''
      });
    });
    container.appendChild(img);
  }

  async function carregarFotoDoDia() {
    try {
      const data = await fetchApod();
      apodAtual = data;
      const dataFormatada = new Date(`${data.date}T00:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      dateLabel.textContent = `FOTO · ${dataFormatada.toUpperCase()}`;

      renderizarMidia(data);
      titleEl.textContent = data.title;
      explanationEl.textContent = data.explanation;
      copyrightEl.textContent = data.copyright ? `© ${data.copyright.trim()}` : '';

      btnFavoritar.classList.remove('hidden');
      idFavoritoSalvo = await estaSalvo(data.date);
      atualizarBotao();
    } catch (erro) {
      console.error(erro);
      if (loading) {
        loading.innerHTML = '<div class="text-xs font-mono text-nasa">Erro ao carregar a foto do dia. Tente recarregar a página.</div>';
      }
    }
  }

  btnFavoritar.addEventListener('click', async () => {
    if (!apodAtual) return;
    btnFavoritar.disabled = true;
    try {
      if (idFavoritoSalvo) {
        await deletarFavorito(idFavoritoSalvo);
        idFavoritoSalvo = null;
        mostrarToast('Removido dos favoritos.', 'ok');
      } else {
        const salvo = await criarFavorito({
          tipo: 'apod',
          nasaId: apodAtual.date,
          titulo: apodAtual.title,
          imageUrl: apodAtual.media_type === 'image' ? (apodAtual.url || apodAtual.hdurl || '') : ''
        });
        idFavoritoSalvo = salvo.id;
        mostrarToast('Foto salva nos favoritos.', 'ok');
      }
      atualizarBotao();
      carregarStatFavs();
    } catch (erro) {
      console.error(erro);
      mostrarToast('Não foi possível atualizar o favorito.', 'erro');
    } finally {
      btnFavoritar.disabled = false;
    }
  });

  async function carregarStatNeo() {
    const el = $('stat-neo');
    if (!el) return;
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const asteroides = await fetchNeoFeed(hoje, hoje);
      el.textContent = String(asteroides.length);
    } catch {
      el.textContent = '—';
    }
  }

  async function carregarStatFavs() {
    const el = $('stat-favs');
    if (!el) return;
    try {
      const favs = await listarFavoritos();
      el.textContent = String(favs.length);
    } catch {
      el.textContent = '—';
    }
  }

  function iniciarTypewriter() {
    const twEl = $('hero-tw-text');
    if (!twEl) return;

    const phrases = [
      'Fotos astronômicas diárias da NASA',
      'Asteroides próximos da Terra em 3D',
      '+150.000 imagens do acervo espacial',
      'Sua coleção pessoal de favoritos'
    ];

    if (prefersReducedMotion()) {
      twEl.textContent = phrases[0];
      const cursor = document.querySelector('.hero-tw-cursor');
      if (cursor) cursor.hidden = true;
      return;
    }

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const SPEED_TYPE = 52;
    const SPEED_DEL = 26;
    const PAUSE = 2200;

    function typeLoop() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        twEl.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          setTimeout(typeLoop, PAUSE);
          return;
        }
      } else {
        twEl.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? SPEED_DEL : SPEED_TYPE);
    }

    setTimeout(typeLoop, 1200);
  }

  carregarFotoDoDia();
  carregarStatNeo();
  carregarStatFavs();
  iniciarTypewriter();
}
