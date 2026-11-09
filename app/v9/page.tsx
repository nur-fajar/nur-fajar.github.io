import type { Metadata } from 'next';

import { V9_META } from '@/content/v9';
import { BackgroundShapesBleed } from '@/components/ui/background-shapes';
import { Cta1 } from '@/components/ui/call-to-action-01';
import { GiantFooter } from '@/components/ui/giant-footer';

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
  return (
    <div className="relative">
        {/* Palit hitam-putih (tinta --ink bervariasi alpha) — transparan
          supaya fokus tetap ke tulisan (permintaan founder 2026-11-09). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-55 [mask-image:radial-gradient(ellipse_at_center,black_62%,rgba(0,0,0,0.45))]">
        <BackgroundShapesBleed
          className="size-full"
          cellSize={56}
          strokeWidth={6}
          colors={['rgba(15,18,34,0.22)', 'rgba(15,18,34,0.14)', 'rgba(15,18,34,0.09)', 'rgba(15,18,34,0.05)']}
        />
      </div>
      <Cta1 />
      <GiantFooter />
    </div>
  );
}
