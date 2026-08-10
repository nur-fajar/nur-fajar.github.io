// Shared math for the hero flip card's zodiac globe (Globe.tsx), which
// projects real RA/Dec constellation data onto a rotating unit sphere.
export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;

export function raDelta(ra: number, ref: number): number {
  let d = ra - ref;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

/** Gnomonik: (ra,dec) relatif pusat → offset derajat pada bidang singgung. */
export function gnomonic(ra: number, dec: number, ra0: number, dec0: number): [number, number] | null {
  const d = dec * D2R;
  const d0 = dec0 * D2R;
  const dRa = raDelta(ra, ra0) * D2R;
  const sinD = Math.sin(d);
  const cosD = Math.cos(d);
  const sinD0 = Math.sin(d0);
  const cosD0 = Math.cos(d0);
  const cosC = sinD0 * sinD + cosD0 * cosD * Math.cos(dRa);
  if (cosC <= 0.01) return null;
  return [((cosD * Math.sin(dRa)) / cosC) * R2D, ((cosD0 * sinD - sinD0 * cosD * Math.cos(dRa)) / cosC) * R2D];
}

export function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

export function raDecToXYZ([ra, dec]: readonly [number, number]): [number, number, number] {
  const r = ra * D2R;
  const d = dec * D2R;
  return [Math.cos(d) * Math.cos(r), Math.sin(d), Math.cos(d) * Math.sin(r)];
}
