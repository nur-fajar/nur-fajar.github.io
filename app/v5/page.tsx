import type { Metadata } from 'next';
import About from '@/components/v5/About';
import Capabilities from '@/components/v5/Capabilities';
import Contact from '@/components/v5/Contact';
import Hero from '@/components/v5/Hero';
import Voices from '@/components/v5/Voices';
import Work from '@/components/v5/Work';
import { V5_SEO_SUMMARY } from '@/content/v5';

export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar — Your Team’s Utility Player' },
  description: V5_SEO_SUMMARY,
  robots: { index: false, follow: false },
};

/**
 * v5: founder-focused homepage.
 * Hero, Capabilities, Work, Voices, About, Contact.
 */
export default function V5Page() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Work />
      <Voices />
      <About />
      <Contact />
    </>
  );
}
