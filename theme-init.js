// apply saved mode before first paint
try { var m = localStorage.getItem('mode'); if (m === 'light' || m === 'dark') document.documentElement.dataset.mode = m; } catch (e) {}
