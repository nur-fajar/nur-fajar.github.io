import type { MetadataRoute } from 'next';

/* Static export (GitHub Pages) menuntut ini eksplisit. */
export const dynamic = 'force-static';

/**
 * Dua halaman indeksabel: homepage (v5) dan /hire-me. Arsip v3/v4/v5
 * noindex dan tidak masuk sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nurfajar.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://nurfajar.com/hire-me',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
