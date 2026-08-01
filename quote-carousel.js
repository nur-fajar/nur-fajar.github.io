/* ── References: one-testimonial-at-a-time slider ─────────────────────────
   Slides are persistent DOM nodes stacked with position:absolute; switching
   slides animates the outgoing one off to one side and the incoming one in
   from the other, so it reads as a directional slide rather than a fade. */
'use strict';

if (typeof document !== 'undefined') {
  const slides = Array.from(document.querySelectorAll('#quote-track .quote'));
  const dots = Array.from(document.querySelectorAll('#quote-dots button'));
  const prevBtn = document.getElementById('quote-prev');
  const nextBtn = document.getElementById('quote-next');
  const viewport = document.querySelector('.quote-viewport');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let current = 0;
  let animating = false;

  /* Slides are position:absolute so the viewport can't size itself off their
     content — at narrow widths a fixed height clips the longer quotes. Measure
     each slide's natural (unstretched) height and size the viewport to the
     tallest one, so nothing gets cut off at any width. */
  function measureHeight(slide) {
    const clone = slide.cloneNode(true);
    clone.style.position = 'static';
    clone.style.visibility = 'hidden';
    clone.style.opacity = '1';
    clone.style.transform = 'none';
    clone.style.transition = 'none';
    viewport.appendChild(clone);
    const height = clone.offsetHeight;
    viewport.removeChild(clone);
    return height;
  }

  function updateHeight() {
    const max = Math.max(...slides.map(measureHeight));
    if (max > 0) viewport.style.height = max + 'px';
  }

  updateHeight();
  window.addEventListener('resize', debounce(updateHeight, 150));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateHeight);
  }

  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  function show(index, dir) {
    if (animating || index === current) return;
    const outgoing = slides[current];
    const incoming = slides[index];

    dots[current].setAttribute('aria-selected', 'false');
    dots[index].setAttribute('aria-selected', 'true');

    if (reducedMotion.matches) {
      outgoing.classList.remove('active');
      incoming.classList.add('active');
      current = index;
      return;
    }

    animating = true;
    const outClass = dir > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = dir > 0 ? 'slide-in-right' : 'slide-in-left';

    outgoing.classList.remove('active');
    outgoing.classList.add(outClass);

    incoming.classList.add(inClass);
    // force a reflow so the off-screen starting position applies before we
    // transition away from it in the same frame
    void incoming.offsetWidth;
    incoming.classList.remove(inClass);
    incoming.classList.add('active');

    current = index;
    setTimeout(() => { outgoing.classList.remove(outClass); animating = false; }, 340);
  }

  prevBtn.addEventListener('click', () => show((current - 1 + slides.length) % slides.length, -1));
  nextBtn.addEventListener('click', () => show((current + 1) % slides.length, 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, i > current ? 1 : -1)));
}
