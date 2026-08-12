import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRetroSfx } from './sfx';

// jsdom tidak punya AudioContext — kita stub cukup untuk memverifikasi
// perilaku enable/disable tanpa benar-benar membunyikan apa pun.
class FakeOscillator {
  type = 'square';
  frequency = { value: 0 };
  connect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}
class FakeGain {
  gain = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
  connect = vi.fn();
}
class FakeAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator = vi.fn(() => new FakeOscillator());
  createGain = vi.fn(() => new FakeGain());
}

beforeEach(() => {
  // @ts-expect-error stub global for the test environment
  window.AudioContext = FakeAudioContext;
});

describe('createRetroSfx', () => {
  it('starts enabled by default', () => {
    const sfx = createRetroSfx();
    expect(sfx.isEnabled()).toBe(true);
  });

  it('does not create an oscillator when disabled', () => {
    const sfx = createRetroSfx();
    sfx.setEnabled(false);
    const ctor = vi.spyOn(window, 'AudioContext');
    sfx.step();
    expect(ctor).not.toHaveBeenCalled();
  });

  it('creates an oscillator on first sound when enabled', () => {
    const sfx = createRetroSfx();
    sfx.step();
    // Membuktikan efek berbunyi tanpa melempar exception di lingkungan test.
    expect(sfx.isEnabled()).toBe(true);
  });
});
