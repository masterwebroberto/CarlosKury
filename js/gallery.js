/* Mejora progresiva exclusiva de la galería. Sin JS se conservan las fotos. */
(() => {
  const photos = [...document.querySelectorAll('.gallery__item > img')];
  const viewer = document.querySelector('.lightbox');
  if (!photos.length || !viewer) return;

  const image = viewer.querySelector('.lightbox__image');
  const stage = viewer.querySelector('.lightbox__stage');
  const counter = viewer.querySelector('.lightbox__counter');
  const close = viewer.querySelector('[data-lightbox-close]');
  const controls = [...viewer.querySelectorAll('button')];
  let current = 0;
  let opener;
  let request = 0;
  let touchStart = null;
  let swiped = false;
  let startedOutside = false;

  async function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    const version = ++request;
    const label = `${current + 1} / ${photos.length}`;
    stage.setAttribute('aria-busy', 'true');
    image.hidden = true;
    // Se reutiliza el recurso original y la caché; decode evita parpadeos.
    const loaded = new Image();
    loaded.src = photo.currentSrc || photo.src;
    try { await loaded.decode(); } catch { /* El alt sigue disponible si falla la carga. */ }
    if (version !== request || !viewer.open) return;
    image.src = loaded.src;
    image.alt = photo.alt;
    image.hidden = false;
    counter.textContent = label;
    stage.setAttribute('aria-busy', 'false');
  }

  photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.className = 'gallery__open';
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar fotografía ${index + 1} de ${photos.length}: ${photo.alt}`);
    button.setAttribute('aria-haspopup', 'dialog');
    photo.replaceWith(button);
    button.append(photo);
    button.addEventListener('click', () => {
      opener = button;
      swiped = false;
      viewer.showModal();
      close.focus({ preventScroll: true });
      showPhoto(index);
    });
  });

  close.addEventListener('click', () => viewer.close());
  for (const button of viewer.querySelectorAll('[data-lightbox-step]')) {
    button.addEventListener('click', () => showPhoto(current + Number(button.dataset.lightboxStep)));
  }
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Tab') {
      // Mantener el foco en los tres controles, también con Shift+Tab.
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    // Escape utiliza el comportamiento cancel del dialog nativo.
  });

  const isOutside = target => target !== image && !target.closest('button');
  viewer.addEventListener('pointerdown', event => {
    swiped = false;
    startedOutside = isOutside(event.target);
  });
  viewer.addEventListener('click', event => {
    if (startedOutside && isOutside(event.target) && !swiped) viewer.close();
  });

  stage.addEventListener('touchstart', event => {
    swiped = false;
    touchStart = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchmove', event => {
    if (event.touches.length !== 1) touchStart = null; // Conservar pinch zoom.
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart || event.touches.length) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped = true;
      showPhoto(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  viewer.addEventListener('close', () => {
    request++; // Descartar cualquier decodificación de imagen todavía pendiente.
    image.hidden = true;
    stage.setAttribute('aria-busy', 'false');
    touchStart = null;
    opener?.focus({ preventScroll: true });
  });
})();
