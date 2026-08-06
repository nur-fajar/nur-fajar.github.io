// Blueprint grid — the home page's calm, static backdrop layer. Rendered as
// a real element (not body::before/::after) since the App Router shares one
// <body> across routes; lab/page.tsx simply never mounts this, so it stays
// calm and readable there.
//
// The scan beam used to live here too, sweeping the entire viewport. It now
// lives scoped inside the hero flip-card (see FlipCard.tsx / .card-scan-beam
// in globals.css) so it reads as a HUD flourish on that one card instead of
// motion wallpapered across the whole page.
export default function HomeBackdrop() {
  return <div className="bp-grid" aria-hidden="true" />;
}
