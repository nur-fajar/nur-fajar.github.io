/* ─────────────────────────────────────────────────────────────────────────────
   lab.js — motion untuk halaman teardown.

   Pembagian tugas yang disengaja:
     CSS  mengurus STRUKTUR (position:sticky, grid). Tanpa JS halaman ini tetap
          jadi dokumen 9 agen yang utuh dan terbaca dari atas ke bawah.
     GSAP mengurus MOTION (highlight node aktif, masuknya teks tiap agen).

   Karena itu di sini TIDAK ADA gsap pin dan TIDAK ADA scrub yang memindahkan
   layout. Kalau GSAP gagal dimuat, yang hilang hanya penekanan — bukan isi.
   Aturan gsap.from() + clearProps yang sama seperti motion.js tetap berlaku.
   ────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var steps = Array.prototype.slice.call(document.querySelectorAll('.agent-step'));
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.pmap li'));
  if (!steps.length) return;

  /* ── Highlight node aktif ─────────────────────────────────────────────────
     Ini dijalankan lewat IntersectionObserver, bukan GSAP: tidak butuh
     interpolasi apa pun, cuma "langkah mana yang sedang dibaca". Jadi tetap
     bekerja meskipun CDN GSAP gagal. */
  function setActive(i) {
    nodes.forEach(function (n, j) {
      n.classList.toggle('is-active', j === i);
      n.classList.toggle('is-done', j < i);
    });
  }

  /* Hitung ulang dari SELURUH langkah, jangan dari daftar entries.
     IntersectionObserver hanya mengirim elemen yang BERUBAH status, sehingga
     langkah yang benar sering tidak ada di dalam batch — akibatnya highlight
     tertinggal satu. Jadi: scroll memicu, tapi pemenangnya dihitung dari nol. */
  var lastRun = 0, pending = 0;

  function update() {
    pending = 0;
    lastRun = Date.now();
    var mid = window.innerHeight / 2;
    var best = -1, bestDist = Infinity;

    for (var i = 0; i < steps.length; i++) {
      var r = steps[i].getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue; // di luar layar
      var d = Math.abs((r.top + r.height / 2) - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    }

    if (best === -1) {
      // Belum sampai ke pipeline (masih di intro) atau sudah melewatinya.
      nodes.forEach(function (n) { n.classList.remove('is-active'); });
      return;
    }
    setActive(best);
  }

  // Throttle berbasis waktu, bukan requestAnimationFrame: rAF berhenti di tab
  // yang tidak terlihat, dan highlight ini tidak perlu presisi per frame.
  function schedule() {
    if (pending) return;
    var wait = Math.max(0, 60 - (Date.now() - lastRun));
    pending = setTimeout(update, wait);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();

  /* ── Motion: masuknya teks tiap agen ─────────────────────────────────────
     Berhenti di sini kalau GSAP tidak ada atau user minta reduced motion. */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  if (typeof window.gsap === 'undefined') return;

  var gsap = window.gsap;
  var hasST = typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(window.ScrollTrigger);

  var touched = [];
  function forceClear() {
    touched.forEach(function (el) {
      if (!el || !el.style) return;
      if (el.style.opacity !== '' && parseFloat(el.style.opacity) < 1) el.style.removeProperty('opacity');
      if (el.style.transform) el.style.removeProperty('transform');
    });
  }
  setTimeout(forceClear, 5000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(forceClear, 1200);
  });
  window.addEventListener('beforeprint', forceClear);

  /* Intro */
  var heroBits = ['.lab-hero .eyebrow', '.lab-hero h1', '.lab-hero .lede', '.lab-hero .lab-meta', '.lab-scrollcue']
    .map(function (s) { return document.querySelector(s); }).filter(Boolean);
  if (heroBits.length) {
    touched.push.apply(touched, heroBits);
    gsap.from(heroBits, {
      y: 18, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08,
      clearProps: 'opacity,transform'
    });
  }

  /* Tiap agen: tween dibuat DI DALAM onEnter, jadi tidak ada blok yang
     disembunyikan sebelum waktunya. Sama seperti di motion.js. */
  if (hasST) {
    steps.forEach(function (step) {
      var bits = Array.prototype.slice.call(
        step.querySelectorAll('.agent-id, h2, .agent-file, p, .agent-io, .agent-note')
      );
      if (!bits.length) return;

      window.ScrollTrigger.create({
        trigger: step, start: 'top 78%', once: true,
        onEnter: function () {
          touched.push.apply(touched, bits);
          gsap.from(bits, {
            y: 14, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.045,
            clearProps: 'opacity,transform'
          });
        }
      });
    });

    /* Kartu model routing */
    var routes = document.querySelectorAll('.route');
    if (routes.length) {
      window.ScrollTrigger.create({
        trigger: '#routing', start: 'top 80%', once: true,
        onEnter: function () {
          touched.push.apply(touched, routes);
          gsap.from(routes, {
            y: 16, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1,
            clearProps: 'opacity,transform'
          });
        }
      });
    }
  }

  reduced.addEventListener('change', function (e) {
    if (!e.matches) return;
    gsap.globalTimeline.clear();
    if (hasST) window.ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    forceClear();
  });
})();
