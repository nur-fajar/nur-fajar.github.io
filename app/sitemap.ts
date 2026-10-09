import type { MetadataRoute } from 'next';

/* Static export (GitHub Pages) menuntut ini eksplisit. */
export const dynamic = 'force-static';

/**
 * Satu halaman indeksabel: homepage (v5). Arsip v3/v4/v5 noindex dan
 * tidak masuk sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nurfajar.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
