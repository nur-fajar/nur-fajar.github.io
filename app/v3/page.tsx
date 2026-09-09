import type { Metadata } from 'next';
import Grid from '@/components/v3/Grid';
import Tile from '@/components/v3/Tile';
import { V3_HOME_TILES } from '@/content/ledger';

/* absolute, bukan judul biasa: template root menambahkan ", Nur Fajar" di
   belakang setiap judul, dan di halaman yang judulnya sudah namanya sendiri
   itu keluar sebagai "Nur Fajar, Nur Fajar". */
export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar, Learning & Development Specialist' },
};

/**
 * Home screen: enam ubin, tiga baris, dua belas kolom, nol sel sisa.
 *
 * Halaman ini sengaja tidak menyimpan tata letaknya sendiri. Urutan, lebar,
 * dan tinggi tiap ubin datang dari V3_HOME_TILES di ledger, tempat sebuah
 * tes memeriksa bahwa setiap baris tertutup penuh 12 kolom. Kalau angkanya
 * ditulis di sini, tes itu tidak punya apa pun untuk dibaca.
 */
export default function V3HomePage() {
  return (
    <div className="v3-shell">
      <Grid>
        {V3_HOME_TILES.map((tile) => (
          <Tile key={tile.id} tile={tile}>
            <span>{tile.label}</span>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}
