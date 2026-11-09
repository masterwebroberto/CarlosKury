/* Navegación progresiva: sin JS los destinos permanecen visibles. */
const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacion');
const mobile = window.matchMedia('(max-width: 767px)');

function closeMenu(returnFocus = false) {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('is-open');
  if (returnFocus) toggle.focus();
}

if (header && toggle && navigation) {
  header.classList.add('header--enhanced');
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  header.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!header.contains(document.activeElement)) closeMenu();
    });
  });
  mobile.addEventListener('change', () => {
    const restoreFocus = mobile.matches && navigation.contains(document.activeElement);
    closeMenu(restoreFocus);
  });
}

/* Carrusel: autoavance pausado durante la interacción y scroll táctil nativo. */
const track = document.querySelector('#fotos');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (track) {
  const carousel = track.closest('.artist-carousel');
  const arrows = [...carousel.querySelectorAll('[data-scroll]')];
  const pauseButton = carousel.querySelector('[data-carousel-pause]');
  let manuallyPaused = false;
  const delay = 5000;
  let timer;
  let direction = 1;
  let hovered = false;
  let pressed = false;
  let touching = false;

  function updateArrows() {
    for (const arrow of arrows) {
      arrow.disabled = Number(arrow.dataset.scroll) < 0
        ? track.scrollLeft <= 1
        : track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    }
  }

  function move(amount) {
    const step = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    const end = Math.max(0, track.scrollWidth - track.clientWidth);
    track.scrollTo({
      left: Math.max(0, Math.min(end, track.scrollLeft + step * amount)),
      behavior: reduceMotion.matches ? 'instant' : 'smooth'
    });
  }

  // Un único temporizador; cada interacción concede otros cinco segundos.
  function restartTimer() {
    clearTimeout(timer);
    if (manuallyPaused || reduceMotion.matches || document.hidden || hovered || pressed || touching
      || carousel.contains(document.activeElement)
      || track.scrollWidth <= track.clientWidth + 1) return;

    timer = setTimeout(() => {
      const end = track.scrollWidth - track.clientWidth;
      // Alternar dirección evita un salto del último extremo al primero.
      if (track.scrollLeft >= end - 1) direction = -1;
      else if (track.scrollLeft <= 1) direction = 1;
      move(direction);
      restartTimer();
    }, delay);
  }

  function updatePauseButton() {
    if (!pauseButton) return;
    const paused = manuallyPaused || reduceMotion.matches;
    const label = reduceMotion.matches
      ? 'Autoavance desactivado por movimiento reducido'
      : paused ? 'Reanudar carrusel' : 'Pausar carrusel';
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
    pauseButton.setAttribute('aria-label', label);
    pauseButton.title = label;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.disabled = reduceMotion.matches;
  }

  if (pauseButton) {
    pauseButton.hidden = false;
    pauseButton.addEventListener('click', () => {
      if (reduceMotion.matches) return;
      manuallyPaused = !manuallyPaused;
      if (manuallyPaused) track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
      updatePauseButton();
      restartTimer();
    });
    updatePauseButton();
  }

  for (const arrow of arrows) {
    arrow.hidden = false;
    arrow.addEventListener('click', () => {
      direction = Number(arrow.dataset.scroll);
      move(direction);
      restartTimer();
    });
  }

  carousel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      hovered = true;
      restartTimer();
    }
  });
  carousel.addEventListener('pointerleave', () => {
    hovered = false;
    restartTimer();
  });
  carousel.addEventListener('pointerdown', () => {
    pressed = true;
    restartTimer();
  }, { passive: true });
  function releasePointer() {
    if (!pressed) return;
    pressed = false;
    restartTimer();
  }
  window.addEventListener('pointerup', releasePointer, { passive: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true });
  // El navegador cancela pointer durante el pan nativo; mantener la pausa
  // hasta que se retiren los dedos, incluso si el gesto queda inmóvil.
  carousel.addEventListener('touchstart', event => {
    touching = event.touches.length > 0;
    restartTimer();
  }, { passive: true });
  function releaseTouch(event) {
    if (!touching) return;
    touching = event.touches.length > 0;
    restartTimer();
  }
  window.addEventListener('touchend', releaseTouch, { passive: true });
  window.addEventListener('touchcancel', releaseTouch, { passive: true });
  carousel.addEventListener('focusin', restartTimer);
  carousel.addEventListener('focusout', () => requestAnimationFrame(restartTimer));
  carousel.addEventListener('keydown', restartTimer);
  carousel.addEventListener('wheel', restartTimer, { passive: true });
  // Incluye el desplazamiento por dedo y su inercia, sin interceptar gestos.
  track.addEventListener('scroll', () => {
    updateArrows();
    restartTimer();
  }, { passive: true });
  window.addEventListener('resize', () => {
    updateArrows();
    restartTimer();
  });
  window.addEventListener('blur', () => {
    pressed = false;
    touching = false;
    clearTimeout(timer);
  });
  window.addEventListener('focus', restartTimer);
  document.addEventListener('visibilitychange', restartTimer);
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
    updatePauseButton();
    restartTimer();
  });
  updateArrows();
  restartTimer();
}

/* El diseño contiene miniaturas, pero no URLs aprobadas de reproducción. */
const notice = document.querySelector('.notice');
for (const button of document.querySelectorAll('[data-pending]')) {
  button.addEventListener('click', () => notice.showModal());
}
