import type { Metadata } from 'next';
import DayInLife from '@/components/playground/DayInLife';

// Easter egg, deliberately kept out of search results — the main site
// (app/page.tsx) is the canonical resume; this is a scroll-parallax detour,
// linked quietly from the footer rather than the nav.
export const metadata: Metadata = {
  title: 'A Day in the Life',
  description: 'A scroll-parallax easter egg — Nur Fajar’s typical day, told the rleonardi.com/interactive-resume way.',
  robots: { index: false, follow: false },
};

export default function PlaygroundPage() {
  return <DayInLife />;
}
