/* Música: paginación responsive y swipe nativo, sin reproductores ficticios. */
(() => {
  const carousel = document.querySelector('.music-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.media-track--albums');
  const cards = [...track.children];
  const controls = carousel.querySelector('.music-controls');
  const arrows = [...controls.querySelectorAll('[data-music-step]')];
  const pagination = controls.querySelector('.music-pagination');
  const position = carousel.querySelector('.music-position');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible;
  let starts = [];
  let animation;
  let scrollTimer;

  const offset = index => cards[index].offsetLeft - cards[0].offsetLeft;
  const limit = () => Math.max(0, track.scrollWidth - track.clientWidth);
  function currentIndex() {
    return cards.reduce((nearest, card, index) =>
      Math.abs(offset(index) - track.scrollLeft) < Math.abs(offset(nearest) - track.scrollLeft)
        ? index : nearest, 0);
  }

  function update() {
    const index = Math.min(currentIndex(), cards.length - visible);
    const page = starts.reduce((nearest, start, i) =>
      Math.abs(start - index) < Math.abs(starts[nearest] - index) ? i : nearest, 0);
    pagination.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-current', String(i === page));
    });
    arrows[0].disabled = track.scrollLeft <= 1;
    arrows[1].disabled = track.scrollLeft >= limit() - 1;
    position.textContent = `${index + 1}–${Math.min(index + visible, cards.length)} de ${cards.length}`;
  }

  function stopAnimation() {
    cancelAnimationFrame(animation);
    animation = undefined;
    track.classList.remove('is-animating');
  }

  function go(index) {
    stopAnimation();
    const target = Math.max(0, Math.min(offset(index), limit()));
    if (motion.matches) {
      track.scrollTo({ left: target, behavior: 'instant' });
      update();
      return;
    }
    // 400 ms reales; scroll nativo conserva swipe, rueda y navegación sin JS.
    const from = track.scrollLeft;
    const startTime = performance.now();
    track.classList.add('is-animating');
    function frame(now) {
      const progress = Math.min(1, (now - startTime) / 400);
      const ease = 1 - Math.pow(1 - progress, 3);
      track.scrollTo({ left: from + (target - from) * ease, behavior: 'instant' });
      if (progress < 1) animation = requestAnimationFrame(frame);
      else {
        stopAnimation();
        update();
      }
    }
    animation = requestAnimationFrame(frame);
  }

  function resize() {
    const nextVisible = Number(getComputedStyle(carousel).getPropertyValue('--music-visible'));
    const index = currentIndex();
    stopAnimation();
    if (nextVisible !== visible) {
      visible = nextVisible;
      starts = [];
      for (let i = 0; i < cards.length; i += visible) starts.push(Math.min(i, cards.length - visible));
      pagination.replaceChildren(...starts.map(start => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'music-page';
        button.setAttribute('aria-controls', track.id);
        button.setAttribute('aria-label', `Mostrar canciones ${start + 1} a ${Math.min(start + visible, cards.length)}`);
        button.addEventListener('click', () => go(start));
        return button;
      }));
    }
    track.scrollTo({ left: Math.min(offset(Math.min(index, cards.length - visible)), limit()), behavior: 'instant' });
    update();
  }

  for (const arrow of arrows) {
    arrow.addEventListener('click', () => {
      const index = currentIndex();
      const direction = Number(arrow.dataset.musicStep);
      const target = direction > 0
        ? starts.find(start => start > index)
        : [...starts].reverse().find(start => start < index);
      if (target !== undefined) go(target);
    });
  }
  track.addEventListener('keydown', event => {
    if (event.target.closest('a, button, input, select, textarea')) return;
    const actions = { ArrowLeft: -1, ArrowRight: 1 };
    if (event.key in actions) {
      event.preventDefault();
      go(Math.max(0, Math.min(cards.length - visible, currentIndex() + actions[event.key])));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      go(event.key === 'Home' ? 0 : cards.length - visible);
    }
  });
  track.addEventListener('pointerdown', stopAnimation, { passive: true });
  track.addEventListener('touchstart', stopAnimation, { passive: true });
  track.addEventListener('wheel', stopAnimation, { passive: true });
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(update, 100);
  }, { passive: true });
  motion.addEventListener('change', () => { stopAnimation(); update(); });
  window.addEventListener('resize', resize);
  controls.hidden = false;
  resize();
})();
