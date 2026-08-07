// Faint dot-grain layer over the page's gradient-mesh background (see
// --bg-gradient in globals.css) — keeps large panels of flat color from
// looking sterile without reintroducing the old blueprint grid. Rendered as
// a real element (not body::before/::after) since the App Router shares one
// <body> across routes; any route that doesn't import this simply doesn't
// get it.
export default function HomeBackdrop() {
  return <div className="bp-grid" aria-hidden="true" />;
}
