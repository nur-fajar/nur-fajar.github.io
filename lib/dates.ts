/**
 * Satu tempat untuk memformat tanggal, dan satu-satunya.
 *
 * Situs ini pernah menampilkan dua format berbeda di dalam SATU kartu yang
 * sama: "2024 FEB - 2026 JUL" di header kartu, dan "2025 JUL to - 2026 JUL"
 * di baris sub-jabatan beberapa piksel di bawahnya, yang kedua rusak karena
 * kata "to" khusus screen reader ikut terbaca mata. Penyebabnya bukan salah
 * ketik, tapi karena tiap komponen memformat tanggalnya sendiri-sendiri.
 *
 * Perbaikannya adalah menghapus kemungkinan itu: data mentah menyimpan format
 * CV ("2024 FEB"), fungsi di file ini satu-satunya yang boleh menerjemahkannya
 * ke format tampilan, dan komponen tidak pernah menyentuh string tanggal
 * secara langsung.
 */

const MONTHS: Record<string, string> = {
  JAN: 'Jan',
  FEB: 'Feb',
  MAR: 'Mar',
  APR: 'Apr',
  MAY: 'May',
  JUN: 'Jun',
  JUL: 'Jul',
  AUG: 'Aug',
  SEP: 'Sep',
  OCT: 'Oct',
  NOV: 'Nov',
  DEC: 'Dec',
};

/**
 * "2024 FEB" jadi "Feb 2024".
 *
 * Bulan dalam title case, bukan caps: caps di tengah kalimat kecil terbaca
 * sebagai penekanan, dan tanggal tidak pernah butuh penekanan. Input yang
 * tidak dikenali dikembalikan apa adanya, karena tanggal yang tampil aneh
 * masih jauh lebih baik daripada tanggal yang hilang.
 */
export function formatMonth(value: string): string {
  const match = value.trim().match(/^(\d{4})\s+([A-Za-z]{3})$/);
  if (!match) return value;

  const [, year, rawMonth] = match;
  const month = MONTHS[rawMonth.toUpperCase()];
  return month ? `${month} ${year}` : value;
}

/**
 * "Feb 2024 – Jul 2026".
 *
 * Pemisahnya en dash, bukan hyphen: hyphen menyambung kata majemuk, en dash
 * menyatakan rentang, dan ini rentang. (Em dash tetap dilarang di seluruh
 * konten situs, dan en dash di sini bukan pengecualian untuk itu: ia dipakai
 * sebagai operator rentang, bukan sebagai jeda retoris.)
 */
export function formatRange(start: string, end: string): string {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}
