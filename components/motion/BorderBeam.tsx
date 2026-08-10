/* ── Border beam ───────────────────────────────────────────────────────────
   A slim point of light continuously circling a button's edge — the Magic
   UI / 21st.dev "border beam" effect, in ~15 lines of CSS (see .border-beam
   in globals.css) instead of an npm dependency. Reserved for the page's two
   primary calls to action (nav CV download, contact send) — one recurring
   motion moment used sparingly reads as intentional; scattered across every
   button it would read as noise. Purely decorative: aria-hidden, and the
   parent button supplies its own :hover/:focus-visible state. */
export default function BorderBeam() {
  return <span className="border-beam" aria-hidden="true" />;
}
