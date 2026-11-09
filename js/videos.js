/* Videos: scroll nativo, controles compartidos y reproductor solo bajo demanda. */
(() => {
  const carousel = document.querySelector('.video-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.media-track--videos');
  const cards = [...track.children];
  const controls = carousel.querySelector('[data-video-controls]');
  const arrows = [...controls.querySelectorAll('[data-video-step]')];
  const pagination = controls.querySelector('[data-video-pagination]');
  const status = carousel.querySelector('[data-video-position]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = 0;
  let starts = [];
  let scrollTimer;
  const offset = index => cards[index].offsetLeft - cards[0].offsetLeft;
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const current = () => Math.max(0, Math.min(cards.length - visible,
    Math.round(track.scrollLeft / (offset(1) || 1))));

  function update() {
    const index = current();
    const page = starts.reduce((best, start, i) =>
      Math.abs(start - index) < Math.abs(starts[best] - index) ? i : best, 0);
    [...pagination.children].forEach((button, i) => button.setAttribute('aria-current', String(i === page)));
    arrows[0].disabled = track.scrollLeft <= 1;
    arrows[1].disabled = track.scrollLeft >= maxScroll() - 1;
    status.textContent = `${index + 1}–${index + visible} de ${cards.length}`;
  }
  function go(index) {
    track.scrollTo({ left: Math.min(offset(index), maxScroll()), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    if (reducedMotion.matches) update();
  }
  function resize() {
    const next = Number(getComputedStyle(carousel).getPropertyValue('--video-visible'));
    if (next !== visible) {
      visible = next;
      starts = [];
      for (let i = 0; i < cards.length; i += visible) starts.push(Math.min(i, cards.length - visible));
      pagination.replaceChildren(...starts.map(index => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'music-page';
        button.setAttribute('aria-controls', track.id);
        button.setAttribute('aria-label', `Mostrar videos ${index + 1} a ${index + visible}`);
        button.addEventListener('click', () => go(index));
        return button;
      }));
    }
    track.scrollTo({ left: Math.min(offset(current()), maxScroll()), behavior: 'instant' });
    update();
  }
  arrows.forEach(button => button.addEventListener('click', () => {
    const index = current();
    const start = Number(button.dataset.videoStep) > 0
      ? starts.find(value => value > index)
      : [...starts].reverse().find(value => value < index);
    if (start !== undefined) go(start);
  }));
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(update, 100);
  }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(Math.max(0, Math.min(cards.length - visible, current() + (event.key === 'ArrowRight' ? 1 : -1))));
    } else if ((event.key === 'Home' || event.key === 'End') && event.target === track) {
      event.preventDefault();
      go(event.key === 'Home' ? 0 : cards.length - visible);
    }
  });
  reducedMotion.addEventListener('change', () => {
    track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
    update();
  });
  window.addEventListener('resize', resize);
  controls.hidden = false;
  resize();

  const modal = document.querySelector('.video-modal');
  const player = modal.querySelector('.video-modal__player');
  const pending = modal.querySelector('.video-modal__pending');
  const title = modal.querySelector('#video-modal-title');
  const close = modal.querySelector('[data-video-close]');
  const youtubeLink = document.createElement('a');
  youtubeLink.className = 'youtube-link';
  youtubeLink.textContent = 'Abrir en YouTube ↗';
  youtubeLink.target = '_blank';
  youtubeLink.rel = 'noopener noreferrer';
  player.after(youtubeLink);
  let opener;
  let outside = false;

  // Solo se aceptan hosts y formatos conocidos. La URL nunca se usa como HTML.
  function youtubeId(value) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
      const host = url.hostname;
      let id;
      if (host === 'youtu.be') id = url.pathname.slice(1);
      else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(host)) {
        id = url.pathname === '/watch' ? url.searchParams.get('v')
          : url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/)?.[1];
      }
      return /^[\w-]{11}$/.test(id || '') ? id : null;
    } catch { return null; }
  }
  function clearPlayer() {
    player.replaceChildren(); // Destruye el contexto del iframe y detiene el audio.
  }
  function closeVideo() {
    clearPlayer();
    modal.close();
  }
  document.querySelectorAll('.video-preview, .music-play, .song-row').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    opener = button;
    outside = false;
    clearPlayer();
    title.textContent = button.closest('.media-card')?.querySelector('h3').textContent
      || button.querySelector('.song-row__name span')?.textContent.replace(/^\d+\s+/, '') || 'Video';
    youtubeLink.href = button.dataset.videoUrl || button.href;
    const id = youtubeId(button.dataset.videoUrl || button.getAttribute('href'));
    pending.hidden = Boolean(id);
    modal.showModal();
    close.focus({ preventScroll: true });
    if (id) {
      const iframe = document.createElement('iframe');
      iframe.title = `Reproducir ${title.textContent} en YouTube`;
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
      player.append(iframe);
    }
  }));
  close.addEventListener('click', closeVideo);
  modal.addEventListener('cancel', event => { event.preventDefault(); closeVideo(); });
  modal.addEventListener('pointerdown', event => { outside = event.target === modal; });
  modal.addEventListener('click', event => {
    if (outside && event.target === modal) closeVideo();
  });
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeVideo();
      return;
    }
    const iframe = player.querySelector('iframe');
    if (event.key === 'Tab' && document.activeElement === close && (!iframe || event.shiftKey)) {
      event.preventDefault();
      (iframe || close).focus();
    }
  });
  modal.addEventListener('close', () => {
    clearPlayer();
    opener?.focus({ preventScroll: true });
  });
})();
