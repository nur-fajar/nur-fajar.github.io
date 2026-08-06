// Apply saved mode before first paint. Loaded via next/script
// strategy="beforeInteractive" so it runs before React hydrates and before
// the page is painted — no flash of the wrong theme.
try {
  var m = localStorage.getItem('mode');
  if (m === 'light' || m === 'dark') document.documentElement.dataset.mode = m;
} catch (e) {}
