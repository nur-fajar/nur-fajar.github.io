import Image from 'next/image';

/**
 * Glif "in" putih, diambil dari berkas mark resmi LinkedIn.
 *
 * Mark resminya adalah kotak biru dengan "in" putih di dalamnya. Ditempel
 * apa adanya di atas ubin yang juga biru, ia akan terbaca sebagai kotak biru
 * lain di atas biru, seperti kesalahan. Yang dipakai di sini cuma glif
 * putihnya, dipisahkan dari kotaknya dengan menyaring piksel terang.
 *
 * aria-hidden karena pembungkus Tile sudah membawa aria-label "LinkedIn".
 */
export default function LinkedInTile() {
  return (
    <span className="v3-glyph" aria-hidden="true">
      <Image src="/logos/linkedin-glyph.png" alt="" width={56} height={56} />
    </span>
  );
}
