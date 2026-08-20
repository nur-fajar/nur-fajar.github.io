# Hero photo

Taruh SATU file di folder ini dengan nama `facilitating.jpg`
(boleh juga .jpeg / .png / .webp). Begitu file-nya ada, hero otomatis
berubah jadi dua kolom dan fotonya muncul di kanan (di bawah tombol
kalau di ponsel). Tidak ada kode yang perlu disentuh.

Kalau file-nya tidak ada, hero jatuh ke satu kolom penuh, bukan
menyisakan kotak kosong. Lihat components/site/Hero.tsx.

Gambar yang sama juga otomatis dipakai untuk OG image (preview
LinkedIn/WhatsApp), menggantikan avatar. Lihat app/opengraph-image.tsx.

## Kriteria foto, urut dari yang paling kuat

1. Sedang benar-benar memfasilitasi: berdiri di depan layar, grid Zoom
   sesi Train the Trainers, atau screenshot livestream YouTube.
2. Screenshot antarmuka salah satu kursus di ai4impact.

BUKAN headshot studio, BUKAN stok. Artefak orang yang sedang bekerja
mengalahkan potret.

## Ukuran

Rasio ditentukan CSS (4:5 desktop, 16:10 mobile) dan foto di-crop
`object-fit: cover`, jadi dimensi asli bebas. Sisi terpendek minimal
~900px supaya tetap tajam di layar retina.
