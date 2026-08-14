/* ── Data untuk section "The Path" di /v2 ────────────────────────────────
   Cuma dipakai halaman /v2. Copy-nya persis kalimat yang diminta di brief
   — tidak ada angka/fakta yang diulang di section lain halaman itu.

   Soal logo: semua file di /public/logos diambil dari asset resmi
   (bukan digambar ulang) —
     - unsil.png            → unsil.ac.id (situs resmi Universitas Siliwangi)
     - bri.svg              → Wikimedia Commons "BANK BRI logo.svg" (logo korporat resmi)
     - bank-indonesia.png   → Wikimedia "BI Logo.png" (logo resmi Bank Indonesia)
     - google-developers.svg→ Wikimedia "Google Developers logo.svg" (mark resmi
                              program Google Developers, induk dari GDSC)
     - bangkit.png          → Wikimedia "Bangkit-logo.png"
   Terra AI tidak punya asset publik yang bisa diverifikasi, jadi chip-nya
   sengaja teks saja daripada menggambar logo palsu. */

export interface PathLogo {
  src: string;
  alt: string;
  /** Ratio dipakai untuk menghitung lebar render dari tinggi tetap. */
  w: number;
  h: number;
}

export interface PathChip {
  name: string;
  stat: string;
  logo?: PathLogo;
}

export const LOGOS: Record<string, PathLogo> = {
  unsil: { src: '/logos/unsil.png', alt: 'Universitas Siliwangi', w: 300, h: 300 },
  bri: { src: '/logos/bri.svg', alt: 'BRI', w: 512, h: 176 },
  bankIndonesia: { src: '/logos/bank-indonesia.png', alt: 'Bank Indonesia', w: 2201, h: 697 },
  googleDevelopers: { src: '/logos/google-developers.svg', alt: 'Google Developers', w: 512, h: 78 },
  bangkit: { src: '/logos/bangkit.png', alt: 'Bangkit Academy', w: 600, h: 141 },
  claude: { src: '/logos/claude.svg', alt: 'Claude', w: 24, h: 24 },
  openai: { src: '/logos/openai.svg', alt: 'OpenAI', w: 24, h: 24 },
  gemini: { src: '/logos/googlegemini.svg', alt: 'Google Gemini', w: 24, h: 24 },
};

/** Logo mono (single-path, warna ikut currentColor kalau di-invert) —
    dibedakan karena treatment dark mode-nya beda dari logo berwarna. */
export const MONO_LOGOS = new Set(['/logos/claude.svg', '/logos/openai.svg', '/logos/googlegemini.svg']);

/** Kalimat 1 — anchor text, plus baris atribusi kecil di bawahnya. */
export const PATH_OPENING =
  'It started at Universitas Siliwangi, where I graduated as the best graduate of the Faculty of Engineering with a 3.94 GPA — on scholarship from BRI and Bank Indonesia.';

export const PATH_OPENING_LOGOS: PathLogo[] = [LOGOS.unsil, LOGOS.bri, LOGOS.bankIndonesia];

/** Kalimat 2 — dipecah jadi chip per entitas. */
export const PATH_CHIPS: PathChip[] = [
  {
    name: 'Google Developer Student Clubs',
    stat: 'founder — first chapter on campus',
    logo: LOGOS.googleDevelopers,
  },
  {
    name: 'Kuliah Dhuha',
    stat: '2,000+ attendees · 30+ committee',
    logo: LOGOS.unsil,
  },
  {
    name: 'Village service program (KKN)',
    stat: '16-person team',
    logo: LOGOS.unsil,
  },
];

/** Teks penghubung antar chip, supaya kalimat 2 tetap terbaca sebagai kalimat. */
export const PATH_CHIPS_LEAD = 'Along the way, I founded, led, and coordinated:';
export const PATH_CHIPS_TAIL =
  'Kuliah Dhuha was a one-day online welcome program for incoming Muslim students; I ran it as chief organizer.';

/** Kalimat 3 — kembali ke narasi utuh. */
export const PATH_CLOSING =
  'Twice, I was selected for Kampus Merdeka: first as a Machine Learning mentor at Bangkit Academy, then as an apprentice-turned-Training Specialist at Terra AI — a role that grew into my current one: Learning & Development Specialist.';

export const PATH_CLOSING_CHIPS: PathChip[] = [
  { name: 'Bangkit Academy', stat: 'Machine Learning mentor', logo: LOGOS.bangkit },
  { name: 'Terra AI', stat: 'apprentice → Training Specialist' },
];

export const PATH_TRANSITION = 'What I bring to your team is this versatile skillset.';
