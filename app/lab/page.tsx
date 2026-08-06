import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import LabHero from '@/components/lab/LabHero';
import PipelineWalk from '@/components/lab/PipelineWalk';
import ModelRouting from '@/components/lab/ModelRouting';
import YearNow from '@/components/YearNow';

export const metadata: Metadata = {
  title: 'Pipeline teardown',
  description:
    'A scroll-driven teardown of a 9-agent B2B outreach pipeline: model routing, the human review gate, and why irreversible actions stay behind a human.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pipeline teardown — Nur Fajar',
    description: 'Nine agents, one irreversible action, and the gate that sits in front of it.',
    images: ['/og.png'],
  },
};

export default function LabPage() {
  return (
    <div className="wrap">
      <Nav variant="lab" />

      <main>
        <LabHero />
        <PipelineWalk />
        <ModelRouting />

        {/* ── Closing ── */}
        <section className="lab-section lab-close">
          <h2 className="section-label mono">WHAT THIS PAGE IS</h2>
          <p className="section-lede">
            A motion demo that had to earn its place. The pipeline is a sequence, so a scroll-driven walk is the
            honest way to show it — and every word here is readable with JavaScript switched off, because a
            portfolio that hides its content when a script fails is not a portfolio.
          </p>
          <p className="lab-back">
            <Link href="/">← Back to the portfolio</Link>
          </p>
        </section>
      </main>

      <p className="foot mono">
        — END OF TRANSMISSION · © <YearNow /> NUR FAJAR —
      </p>
    </div>
  );
}
