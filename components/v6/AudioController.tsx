import { useEffect } from 'react';

/**
 * AudioController: engine sfx 8-bit kecil (Web Audio, tanpa file audio) plus
 * satu tombol mute/unmute. SFX lazily dibuat pada gesture pertama, jadi
 * browser tidak memblokir AudioContext.
 */

export type SfxKind = 'equip' | 'remove' | 'unicorn';

let ctx: AudioContext | null = null;
let muted = false;

export function setSfxMuted(value: boolean) {
  muted = value;
}

function tone(at: number, from: number, to: number, duration: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + duration);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.06, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

export function playSfx(kind: SfxKind) {
  if (muted) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    if (kind === 'equip') {
      tone(now, 330, 660, 0.12);
    } else if (kind === 'remove') {
      tone(now, 500, 220, 0.1);
    } else {
      // unicorn: arpeggio C5-E5-G5-C6, chime kemenangan.
      [523, 659, 784, 1047].forEach((freq, i) => tone(now + i * 0.09, freq, freq, 0.08));
    }
  } catch {
    // Tanpa audio (browser lama / autoplay policy), halaman tetap jalan.
  }
}

export default function AudioController({ muted: isMuted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="v6-audio" onClick={onToggle} aria-pressed={isMuted} aria-label={isMuted ? 'Turn on sound effects' : 'Turn off sound effects'}>
      {isMuted ? '🔇 sfx off' : '🔊 sfx on'}
    </button>
  );
}
