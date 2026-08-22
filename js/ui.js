// Interface compartilhada: menu, spotlight, vídeo de fundo, toasts e lightbox.

import { prefersReducedMotion } from './dom.js';

export function iniciarInterface() {
  iniciarVideoDeFundo();
  iniciarSpotlight();
  iniciarMenuMobile();
  iniciarCardGlow();
}

function iniciarVideoDeFundo() {
  const video = document.querySelector('.bg-video');
  if (!video) return;

  if (prefersReducedMotion()) {
    video.remove();
    return;
  }

  const sincronizar = () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  document.addEventListener('visibilitychange', sincronizar);
}

function iniciarSpotlight() {
  const spotlight = document.getElementById('spotlight');
  if (!spotlight || prefersReducedMotion()) return;
  if (window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('mousemove', (evento) => {
    spotlight.style.setProperty('--mouse-x', `${evento.clientX}px`);
    spotlight.style.setProperty('--mouse-y', `${evento.clientY}px`);
  });
}

function iniciarMenuMobile() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburgerBtn || !mobileMenu) return;

  const fechar = () => {
    mobileMenu.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Abrir menu');
  };

  const abrir = () => {
    mobileMenu.classList.add('is-open');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Fechar menu');
  };

  hamburgerBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) fechar();
    else abrir();
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fechar);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      fechar();
      hamburgerBtn.focus();
    }
  });
}

function iniciarCardGlow() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll('.card-glow').forEach((card) => {
    card.addEventListener('mousemove', (evento) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${evento.clientX - rect.left}px`);
      card.style.setProperty('--card-y', `${evento.clientY - rect.top}px`);
    });
  });
}

export function mostrarToast(mensagem, tipo = 'info') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    stack.setAttribute('aria-atomic', 'true');
    document.body.appendChild(stack);
  }

  const toast = document.createElement('div');
  toast.className = `toast${tipo === 'erro' ? ' is-erro' : tipo === 'ok' ? ' is-ok' : ''}`;
  toast.role = 'status';
  toast.textContent = mensagem;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
    if (stack && !stack.children.length) stack.remove();
  }, 3200);
}

export function abrirLightbox({ src, alt = '', caption = '' }) {
  fecharLightbox();

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', caption || alt || 'Imagem ampliada');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Fechar imagem');
  closeBtn.textContent = '×';

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;

  overlay.append(closeBtn, img);

  if (caption) {
    const cap = document.createElement('p');
    cap.className = 'lightbox-caption';
    cap.textContent = caption;
    overlay.append(cap);
  }

  const onKey = (evento) => {
    if (evento.key === 'Escape') fecharLightbox();
  };

  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) fecharLightbox();
  });
  closeBtn.addEventListener('click', fecharLightbox);
  document.addEventListener('keydown', onKey);
  overlay._onKey = onKey;

  document.body.appendChild(overlay);
  closeBtn.focus();
}

export function fecharLightbox() {
  const overlay = document.querySelector('.lightbox');
  if (!overlay) return;
  if (overlay._onKey) document.removeEventListener('keydown', overlay._onKey);
  overlay.remove();
}
