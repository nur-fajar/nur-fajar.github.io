import type { MetadataRoute } from 'next';

/* Static export (GitHub Pages) menuntut ini eksplisit, sama seperti
   opengraph-image.tsx. */
export const dynamic = 'force-static';

/**
 * Archive routes (/v3 /v4 /v5) noindex lewat metadata masing-masing; di
 * robots.txt juga ditolak supaya crawler tidak membuang budget di arsip.
 * /hire-me boleh diindeks: itu halaman aplikasi yang benar-benar dicari.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/v3', '/v4', '/v5'],
      },
    ],
    sitemap: 'https://nurfajar.com/sitemap.xml',
  };
}
