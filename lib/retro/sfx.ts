// Efek suara beep sederhana lewat WebAudio oscillator, di-port dari
// nurfajar-island-v7.html. Dibungkus factory function (bukan singleton global)
// supaya gampang di-test dan tidak membuat AudioContext sebelum benar-benar dipakai.

export interface RetroSfx {
  step(): void;
  back(): void;
  open(): void;
  coin(): void;
  enter(): void;
  clear(): void;
  setEnabled(on: boolean): void;
  isEnabled(): boolean;
}

type ToneType = 'square' | 'sine' | 'triangle' | 'sawtooth';

export function createRetroSfx(): RetroSfx {
  let ctx: AudioContext | null = null;
  let enabled = true;

  function beep(freq: number, duration: number, volume = 0.05, type: ToneType = 'square') {
    if (!enabled) return;
    if (!ctx) {
      try {
        ctx = new AudioContext();
      } catch {
        return;
      }
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  return {
    step: () => beep(660, 0.05, 0.035),
    back: () => beep(330, 0.05, 0.03),
    open: () => {
      beep(784, 0.07, 0.05);
      setTimeout(() => beep(1046, 0.1, 0.05), 70);
    },
    coin: () => {
      beep(988, 0.05, 0.05);
      setTimeout(() => beep(1318, 0.12, 0.05), 55);
    },
    enter: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.1, 0.05), i * 70)),
    clear: () => [1046, 880, 698, 523].forEach((f, i) => setTimeout(() => beep(f, 0.12, 0.06), i * 80)),
    setEnabled: (on: boolean) => {
      enabled = on;
    },
    isEnabled: () => enabled,
  };
}
