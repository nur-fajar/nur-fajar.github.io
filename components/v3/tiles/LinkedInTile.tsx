import Image from 'next/image';
import { CONTACT } from '@/content/ledger';

/**
 * Glif "in" putih, diambil dari berkas mark resmi LinkedIn.
 *
 * Mark resminya adalah kotak biru dengan "in" putih di dalamnya. Ditempel
 * apa adanya di atas ubin yang juga biru, ia akan terbaca sebagai kotak biru
 * lain di atas biru, seperti kesalahan. Yang dipakai di sini cuma glif
 * putihnya, dipisahkan dari kotaknya dengan menyaring piksel terang.
 *
 * Handle di bawahnya diturunkan dari CONTACT.linkedin, bukan diketik ulang:
 * satu tautan yang hidup di dua tempat cepat atau lambat berbeda.
 *
 * aria-hidden karena pembungkus Tile sudah membawa aria-label "LinkedIn".
 */
const HANDLE = new URL(CONTACT.linkedin).pathname.replace(/\/$/, '');

export default function LinkedInTile() {
  return (
    <span className="v3-glyph" aria-hidden="true">
      <Image src="/logos/linkedin-glyph.png" alt="" width={48} height={48} />
      <span className="v3-glyph__label">{HANDLE}</span>
    </span>
  );
}
