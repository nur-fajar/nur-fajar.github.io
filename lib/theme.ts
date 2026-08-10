// Small imperative theme store shared by ThemeToggle and the hero flip
// card's canvas Globe widget. Kept outside React state on purpose: the
// canvas reads colors straight from CSS variables via getComputedStyle, so
// a mode change needs to (1) flip the DOM attribute that drives the CSS
// variables and (2) tell any listener to re-read + redraw once. A DOM event
// is the least amount of plumbing for that.
export type Mode = 'light' | 'dark';

export const MODE_CHANGE_EVENT = 'nf:mode-change';

export function getMode(): Mode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light';
}

export function setMode(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  try {
    localStorage.setItem('mode', mode);
  } catch {
    // storage disabled/unavailable — theme still applies for this load
  }
  window.dispatchEvent(new CustomEvent<Mode>(MODE_CHANGE_EVENT, { detail: mode }));
}
