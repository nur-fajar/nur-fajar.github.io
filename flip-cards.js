/* ── Hero flip card: 5-page carousel ──────────────────────────────────────
   One flip button cycles forward through photo → zodiac globe → sudoku →
   chess → book quotes → photo. Each `.flip-page` is a persistent DOM node
   (canvases and game state stay alive off-screen); switching pages animates
   the outgoing page away and the incoming page in with a two-stage rotateY,
   so it still reads as "flipping" even though it's N pages, not 2 faces. */
'use strict';

if (typeof document !== 'undefined') {
  const TOOLTIPS = [
    "Hi, I'm Nur Fajar — most people call me NF or Fajar. Thanks for visiting my site. Flip this card to see how I actually think — how I read patterns, solve problems, lead, and keep growing.",
    "I've read the night sky since I was a kid, tracing patterns in stars scattered light-years apart. It's where I first learned to step back, see the bigger picture, and connect things that don't look connected yet — the start of how I think strategically.",
    "Sudoku is how I practice solving: weigh every possibility, rule out what doesn't hold, and commit to the one answer left — a calculated risk, not a guess.",
    "Chess is how I practice leading: make the move, own what it costs, and think past my own next step to how the other side will respond.",
    "Books are how I keep growing: every one pushes me to adapt, rethink what I know, and become a little more than I was before.",
  ];

  const QUOTES = [
    { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear', book: 'Atomic Habits' },
    { text: 'Begin with the end in mind.', author: 'Stephen R. Covey', book: 'The 7 Habits of Highly Effective People' },
    { text: 'When we are no longer able to change a situation, we are challenged to change ourselves.', author: 'Viktor E. Frankl', book: "Man's Search for Meaning" },
    { text: 'Whatever the mind can conceive and believe, it can achieve.', author: 'Napoleon Hill', book: 'Think and Grow Rich' },
    { text: 'Becoming is better than being.', author: 'Carol S. Dweck', book: 'Mindset' },
    { text: 'Enthusiasm is common. Endurance is rare.', author: 'Angela Duckworth', book: 'Grit' },
  ];

  const pageEls = Array.from(document.querySelectorAll('.flip-page'));
  const flipBtn = document.getElementById('flip-btn');
  const tooltipEl = document.getElementById('flip-tooltip');
  const countEl = document.getElementById('flip-count');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const onActivate = [
    null, // photo
    null, // globe — already self-animating via app.js
    () => window.initSudokuPage && window.initSudokuPage(),
    () => window.initChessPage && window.initChessPage(),
    () => setRandomQuote(),
  ];

  let lastQuoteIndex = -1;
  function setRandomQuote() {
    let i;
    do { i = Math.floor(Math.random() * QUOTES.length); } while (QUOTES.length > 1 && i === lastQuoteIndex);
    lastQuoteIndex = i;
    const q = QUOTES[i];
    document.getElementById('quote-page-text').textContent = q.text;
    document.getElementById('quote-page-meta').textContent = `${q.author} — ${q.book}`;
  }
  document.getElementById('quote-more').addEventListener('click', setRandomQuote);

  let current = 0;
  let animating = false;

  function setPageState(el, active) {
    el.classList.toggle('active', active);
    el.toggleAttribute('inert', !active);
  }

  function updateChrome() {
    tooltipEl.textContent = TOOLTIPS[current];
    countEl.textContent = `${current + 1}/${pageEls.length}`;
  }

  function goNext() {
    if (animating) return;
    const next = (current + 1) % pageEls.length;
    const outgoing = pageEls[current];
    const incoming = pageEls[next];

    if (onActivate[next]) onActivate[next]();

    if (reducedMotion.matches) {
      setPageState(outgoing, false);
      setPageState(incoming, true);
      current = next;
      updateChrome();
      return;
    }

    animating = true;
    setPageState(outgoing, false);
    outgoing.classList.add('leave');

    incoming.classList.add('enter-start');
    // force a reflow so the enter-start transform applies before we
    // transition away from it — otherwise the browser coalesces both
    // class changes into one frame and there's no animation to see
    void incoming.offsetWidth;
    incoming.classList.remove('enter-start');
    setPageState(incoming, true);

    current = next;
    updateChrome();

    setTimeout(() => { outgoing.classList.remove('leave'); animating = false; }, 340);
  }

  flipBtn.addEventListener('click', goNext);
  setPageState(pageEls[0], true);
  updateChrome();
}
