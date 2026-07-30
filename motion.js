/* ─────────────────────────────────────────────────────────────────────────────
   Layer motion — GSAP + ScrollTrigger.

   KESELAMATAN KONTEN ADALAH SYARAT PERTAMA, BUKAN PERTIMBANGAN KEDUA.
   Portofolio ini dipakai melamar kerja. Teks yang tak terlihat karena animasi
   tidak selesai adalah kerugian nyata, bukan glitch kosmetik.

   Tiga lapis pertahanan, karena satu tidak cukup:

   1. TIDAK ADA YANG DISEMBUNYIKAN SEBELUM WAKTUNYA.
      gsap.from() menetapkan state awal SEGERA saat dipasang. Kalau dipasang
      lewat properti `scrollTrigger`, seluruh halaman — termasuk section paling
      bawah — langsung jadi opacity 0 saat load, dan baru pulih kalau di-scroll.
      Itu berarti Ctrl+F tidak menemukan apa pun secara visual, dan tab yang
      dibuka di background bisa meninggalkan konten tersembunyi.
      Karena itu setiap tween dibuat DI DALAM onEnter, bukan sebagai properti.

   2. clearProps di setiap tween. Begitu selesai, inline style dibuang, elemen
      kembali sepenuhnya ke kendali CSS.

   3. FAILSAFE. Timer dan visibilitychange yang memaksa bersih apa pun yang
      masih nyangkut. Kalau semua asumsi di atas salah, konten tetap muncul.

   Ditambah: prefers-reduced-motion mematikan semuanya, dan tidak ada
   scroll-jacking / pinning / scrub di halaman ini. Pinning hanya di lab.html,
   tempat tontonan memang jadi isinya.
   ────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  if (typeof window.gsap === 'undefined') return;

  var gsap = window.gsap;
  var hasST = typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(window.ScrollTrigger);

  var CLEAR = 'opacity,transform';
  var touched = [];

  /** Catat elemen yang kita sentuh, supaya failsafe tahu apa yang harus dibersihkan. */
  function track(targets) {
    if (typeof targets === 'string') {
      touched.push.apply(touched, document.querySelectorAll(targets));
    } else if (targets instanceof Element) {
      touched.push(targets);
    } else if (targets && targets.length) {
      touched.push.apply(touched, targets);
    }
    return targets;
  }

  /** gsap.from() dengan clearProps wajib. Satu-satunya cara kita menganimasi. */
  function reveal(targets, vars) {
    if (!targets || (targets.length === 0 && !(targets instanceof Element))) return;
    track(targets);
    vars.clearProps = CLEAR;
    return gsap.from(targets, vars);
  }

  /* ── Failsafe ─────────────────────────────────────────────────────────────
     Apa pun yang terjadi, 4 detik setelah load semua yang kita sentuh harus
     bebas dari inline opacity/transform. Juga dijalankan saat tab kembali
     terlihat, karena rAF ter-pause di background dan tween bisa tak selesai. */
  function forceClear() {
    if (!touched.length) return;
    touched.forEach(function (el) {
      if (!el || !el.style) return;
      var o = el.style.opacity;
      if (o !== '' && parseFloat(o) < 1) el.style.removeProperty('opacity');
      if (el.style.transform) el.style.removeProperty('transform');
    });
  }
  setTimeout(forceClear, 4000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(forceClear, 1200);
  });
  window.addEventListener('beforeprint', forceClear);

  /* ── Hero: satu entrance, cepat ────────────────────────────────────────── */
  var heroBits = [
    '.hero .eyebrow', '.hero h1', '.hero .status-lamps',
    '.hero .lede', '.hero .stats', '.hero .stats-note'
  ].map(function (s) { return document.querySelector(s); }).filter(Boolean);

  if (heroBits.length) {
    reveal(heroBits, { y: 16, opacity: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07 });
  }

  var globeBox = document.querySelector('.globe-box');
  if (globeBox) {
    reveal(globeBox, { opacity: 0, scale: 0.94, duration: 0.9, ease: 'power2.out', delay: 0.15 });
  }

  /* ── Angka hero berjalan naik ──────────────────────────────────────────────
     Nilai akhir dibaca dari teks yang SUDAH ada di DOM lalu dipulihkan persis,
     jadi tidak ada angka yang bergantung pada JS untuk bisa dibaca. */
  function countUp(el) {
    var finalText = el.textContent.trim();
    var m = finalText.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m) return;
    var target = parseFloat(m[1]);
    var suffix = m[2] || '';
    var decimals = (m[1].split('.')[1] || '').length;
    var obj = { v: 0 };
    var restore = function () { el.textContent = finalText; };

    gsap.to(obj, {
      v: target, duration: 1.1, ease: 'power2.out',
      onUpdate: function () { el.textContent = obj.v.toFixed(decimals) + suffix; },
      onComplete: restore
    });
    // Failsafe khusus angka: teks tidak boleh tertinggal di nilai tengah.
    setTimeout(restore, 3000);
  }

  var stats = document.querySelectorAll('.hero .stat-n');
  if (stats.length) {
    if (hasST) {
      window.ScrollTrigger.create({
        trigger: '.hero .stats', start: 'top 90%', once: true,
        onEnter: function () { stats.forEach(countUp); }
      });
    } else {
      stats.forEach(countUp);
    }
  }

  /* ── Reveal per section ───────────────────────────────────────────────────
     14px, bukan 60px. Ini menandai batas section, bukan pertunjukan.
     Tween dibuat di dalam onEnter — lihat aturan 1 di atas. */
  if (hasST) {
    document.querySelectorAll('main > section').forEach(function (sec, i) {
      if (i === 0) return; // hero punya entrance sendiri

      var head = [sec.querySelector('.section-label'), sec.querySelector('.section-lede')]
        .filter(Boolean);
      var items = sec.querySelectorAll(
        '.track, .quote, .program, .skill-group, .case-block, .edu-card, .signal-list'
      );

      window.ScrollTrigger.create({
        trigger: sec, start: 'top 85%', once: true,
        onEnter: function () {
          if (head.length) {
            reveal(head, { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 });
          }
          if (items.length) {
            reveal(items, {
              y: 14, opacity: 0, duration: 0.5, ease: 'power2.out',
              delay: head.length ? 0.1 : 0,
              stagger: items.length > 6 ? 0.05 : 0.09
            });
          }
        }
      });
    });
  }

  /* Denyut lampu "Open to work" ditangani CSS (@keyframes lamp-pulse) — box-shadow
     berulang lebih murah lewat CSS, dan CSS sudah punya guard reduced-motion. */

  /* ── Hover CV: mikro ──────────────────────────────────────────────────── */
  var cv = document.querySelector('.nav-cv');
  if (cv) {
    cv.addEventListener('mouseenter', function () {
      gsap.to(cv, { y: -2, duration: 0.18, ease: 'power2.out' });
    });
    cv.addEventListener('mouseleave', function () {
      gsap.to(cv, { y: 0, duration: 0.18, ease: 'power2.out' });
    });
  }

  /* Kalau user mengubah preferensi motion di tengah sesi: matikan dan pulihkan. */
  reduced.addEventListener('change', function (e) {
    if (!e.matches) return;
    gsap.globalTimeline.clear();
    if (hasST) window.ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    forceClear();
  });
})();
