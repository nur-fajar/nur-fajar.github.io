import Image from 'next/image';
import { DownloadSimple, SealCheck } from '@phosphor-icons/react/dist/ssr';

/**
 * Foto profil (avatar yang sama dengan nav dan OG image) plus lencana
 * centang biru gaya terverifikasi di kanan bawahnya, lalu tulisan
 * "Download Resume/CV".
 *
 * Seluruh ubin tetap satu anchor unduhan PDF (diurus Tile): foto dan
 * lencananya aria-hidden karena nama tautannya sudah dibawa label ubin.
 * Foto di-crop lingkaran lewat CSS, jadi aspek berkas aslinya tidak
 * penting. Saat ubin di-hover, lencana ceklis bermorf jadi panah unduh:
 * dua ikon bertumpuk di sel grid yang sama, saling menggantikan lewat
 * skala dan opacity.
 */
export default function CvTile() {
  return (
    <span className="v3-glyph" aria-hidden="true">
      <span className="v3-avatar">
        <Image src="/foto-profile-nf-avatar.jpg" alt="" width={76} height={76} />
        <span className="v3-avatar__badge">
          <SealCheck className="v3-avatar__check" size={20} weight="fill" />
          <DownloadSimple className="v3-avatar__dl" size={17} weight="bold" />
        </span>
      </span>
      <span className="v3-glyph__label">Download Resume/CV</span>
    </span>
  );
}
