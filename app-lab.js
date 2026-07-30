/* Toggle tema + tahun untuk lab.html.
   Sengaja terpisah dari app.js: halaman lab tidak punya canvas rasi bintang
   maupun globe, jadi memuat app.js di sini hanya menambah kerja yang tidak
   dipakai dan akan error mencari #sky. */

(function () {
  'use strict';

  var root = document.documentElement;

  function setMode(mode) {
    root.dataset.mode = mode;
    try { localStorage.setItem('mode', mode); } catch (e) {}
    document.querySelectorAll('[data-set-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setMode === mode));
    });
  }

  document.querySelectorAll('[data-set-mode]').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.setMode); });
  });

  // Selaraskan aria-pressed dengan mode yang sudah dipasang inline di <head>
  setMode(root.dataset.mode === 'light' ? 'light' : 'dark');

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
