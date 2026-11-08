import type { ReactNode } from 'react';

import './v9.css';

/**
 * Layout /v9, edisi panggung 21st.dev (2026-11-08, dari proyek mandiri
 * nur-fajar-v9 yang sudah menjadi homepage).
 *
 * Root layout repo ini memegang <html>, font, MotionProvider, dan CSP;
 * layout ini cuma memegang cangkang v9-nya: token shadcn di .v9-root
 * (lihat ./v9.css) dan satu <main>. Tanpa <html> kedua - pola sama dengan
 * layout edisi lain (v3-v8) di repo ini.
 */
export default function V9Layout({ children }: { children: ReactNode }) {
  return (
    <div className="v9-root">
      <a className="skip-link" href="#v9-main">
        Skip to content
      </a>
      <main id="v9-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
