// Sprite pixel-art 12x16 digambar sebagai daftar rect, di-port dari fungsi
// sprite() di nurfajar-island-v7.html. Dikembalikan sebagai data (bukan string
// HTML) supaya komponen React bisa me-render-nya lewat <rect> JSX biasa, tanpa
// dangerouslySetInnerHTML.

export type SpriteGear = 0 | 1 | 2 | 3 | 4;

export interface SpriteRect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export function spriteRects(scale: number, gear: SpriteGear): SpriteRect[] {
  const s = scale;
  const P = (x: number, y: number, w: number, h: number, fill: string): SpriteRect => ({
    x: x * s,
    y: y * s,
    w: w * s,
    h: h * s,
    fill,
  });

  const rects: SpriteRect[] = [
    P(3, 0, 6, 1, '#20182e'), // hair top
    P(2, 1, 8, 2, '#20182e'),
    P(3, 3, 6, 3, '#f2c79b'), // face
    P(4, 4, 1, 1, '#20182e'),
    P(7, 4, 1, 1, '#20182e'),
    P(3, 6, 6, 5, '#4a6fd8'), // body
    P(2, 7, 1, 3, '#f2c79b'), // arms
    P(9, 7, 1, 3, '#f2c79b'),
    P(3, 11, 2, 4, '#2f2a4a'), // legs
    P(7, 11, 2, 4, '#2f2a4a'),
    P(2, 15, 3, 1, '#20182e'),
    P(7, 15, 3, 1, '#20182e'),
  ];

  if (gear >= 1) {
    rects.push(P(2, 0, 8, 1, '#ffcb2e'), P(9, 1, 3, 1, '#ffcb2e')); // cap
  }
  if (gear >= 2) {
    rects.push(P(9, 7, 3, 4, '#fdf6e8'), P(10, 6, 1, 1, '#fdf6e8')); // clipboard
  }
  if (gear >= 3) {
    rects.push(P(0, 8, 3, 3, '#54c8e0'), P(0, 11, 4, 1, '#54c8e0')); // laptop
  }
  if (gear >= 4) {
    rects.push(P(2, 2, 1, 3, '#e0557f'), P(9, 2, 1, 3, '#e0557f'), P(2, 1, 8, 1, '#e0557f')); // headset
  }

  return rects;
}
