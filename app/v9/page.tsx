import type { Metadata } from 'next';

import { V9_META } from '@/content/v9';
import { Cta1 } from '@/components/ui/call-to-action-01';

/**
 * /v9 - homepage edisi panggung 21st.dev (2026-11-08), dari proyek
 * mandiri nur-fajar-v9. Satu section: komponen "call-to-action-01"
 * (@aliimam, diadaptasi) - grid latar sel Aceternity edisi light, foto
 * kartun, headline besar dengan frasa berotasi, bio founder, dua kontak.
 *
 * Semua teks dari kanon content/v9.ts; tidak ada klaim baru. Root layout
 * repo ini sudah memegang no-title template, description SUMMARY, dan
 * tag-tag SEO/OG; halaman ini cuma menyetel judul mutlaknya agar tidak
 * muncul ", Nur Fajar" di belakang judul yang sudah nama.
 */
export const metadata: Metadata = {
  title: { absolute: V9_META.title },
};

export default function V9Page() {
  return <Cta1 />;
}
