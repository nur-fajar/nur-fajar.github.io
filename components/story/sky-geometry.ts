// Matematika proyeksi untuk latar rasi bintang (StoryStarfield.tsx): data
// RA/Dec asli diproyeksikan ke kanvas 2D lewat bidang singgung gnomonik.
export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;

export function raDelta(ra: number, ref: number): number {
  let d = ra - ref;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

/**
 * Proyeksi azimuthal ekuidistan: (ra,dec) relatif pusat → offset derajat
 * dengan JARAK SUDUT SANGGUHAN c dari pusat sepanjang arah azimutnya.
 *
 * Kenapa bukan gnomonik untuk bentuk figur: gnomonik memetakan jarak lewat
 * tan(c) — figur yang jangkauannya lewat ~30° dari pusat (Hydra r 67°,
 * Ursa Major r 26°, Cetus r 27°) menggelembung di ujungnya, sementara rasi
 * kecil (r di bawah 10°) tetap pas. Akibatnya rasio ukuran antar rasi
 * meleset. Ekuidistan memakai jarak sudut c apa adanya: ukuran tiap figur =
 * jarak sudut aslinya × satu skala, jadi rasio antar rasi persis seperti
 * di langit. Azimutnya tak terdistorsi, jadi arah antar titik tetap benar;
 * hanya sedikit melar di tepi figur, tanpa inflasi.
 */
export function equiDistant(
  ra: number,
  dec: number,
  ra0: number,
  dec0: number,
): [number, number] | null {
  const d = dec * D2R;
  const d0 = dec0 * D2R;
  const dRa = raDelta(ra, ra0) * D2R;
  const sinD = Math.sin(d);
  const cosD = Math.cos(d);
  const sinD0 = Math.sin(d0);
  const cosD0 = Math.cos(d0);
  const cosC = sinD0 * sinD + cosD0 * cosD * Math.cos(dRa);
  if (cosC <= 0.001) return null; // jauh sekali dari pusat — putuskan ruas
  const c = Math.acos(Math.min(1, Math.max(-1, cosC))); // jarak sudut, radian
  const sinC = Math.sin(c);
  if (sinC === 0) return [0, 0]; // titik == pusat
  const az = Math.atan2(sinD * Math.sin(dRa), cosD0 * sinD - sinD0 * cosD * Math.cos(dRa));
  return [(c * Math.sin(az)) * R2D, (c * Math.cos(az)) * R2D];
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

