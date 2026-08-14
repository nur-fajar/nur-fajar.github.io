import V2Hero from './components/V2Hero';
import V2WhoIAm from './components/V2WhoIAm';
import V2Path from './components/V2Path';
import V2Skills from './components/V2Skills';
import V2Testimonials from './components/V2Testimonials';
import V2Closing from './components/V2Closing';

// Single top-to-bottom scroll flow, deliberately no visible section labels
// ("01", "02", "HERO") — the numbered-heading convention from the root
// page ("/") is intentionally not reused here.
export default function V2Page() {
  return (
    <main className="v2-flow">
      <V2Hero />
      <V2WhoIAm />
      <V2Path />
      <V2Skills />
      <V2Testimonials />
      <V2Closing />
    </main>
  );
}
