import { WORK_GALLERY } from '@/content/ledger';
import GalleryRow from './GalleryRow';
import Reveal from './Reveal';

/**
 * Bento 2 baris untuk konten marketing & event yang saya bikin untuk
 * ai4impact: video, poster event, wawancara alumni, dan poster ucapan hari
 * besar. Ini pekerjaan desain/marketing, bukan kurikulum L&D, jadi ditaruh
 * di grid tersendiri, bukan ikut dicampur ke grid PROJECTS di atasnya.
 *
 * Posisinya setelah "Inside one program" dan sebelum CTA "Seen enough?":
 * bukti spesifik (satu program dibedah sampai lima fase) dulu, baru bukti
 * keluasan kerja di luar kurikulum, baru ajakan terakhir.
 *
 * 24 item dibagi selang-seling (index genap/ganjil) ke dua baris, supaya
 * tiap baris tetap campuran keempat kategori, bukan satu baris isinya cuma
 * poster dan satu lagi cuma video. Detail interaksinya ada di GalleryRow.
 */
export default function WorkGallery() {
  const rowA = WORK_GALLERY.filter((_, index) => index % 2 === 0);
  const rowB = WORK_GALLERY.filter((_, index) => index % 2 === 1);

  return (
    <div className="gallery">
      <Reveal className="gallery__head">
        <p className="eyebrow">Also built</p>
        <h3 className="gallery__title">Marketing and event content for ai4impact</h3>
        <p className="gallery__lede">
          Video, event posters, and alumni interviews I designed. Tap a card to open the original
          post.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <GalleryRow items={rowA} direction="left" label="Marketing and event work, row 1" />
      </Reveal>
      <Reveal delay={0.1}>
        <GalleryRow items={rowB} direction="right" label="Marketing and event work, row 2" />
      </Reveal>
    </div>
  );
}
