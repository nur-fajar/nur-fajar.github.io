// Blueprint grid + scan beam — the home page's only ambient motion besides
// the starfield. Rendered as real elements (not body::before/::after) since
// the App Router shares one <body> across routes; lab/page.tsx simply never
// mounts this, so it stays calm and readable there.
export default function HomeBackdrop() {
  return (
    <>
      <div className="bp-grid" aria-hidden="true" />
      <div className="scan-beam" aria-hidden="true" />
    </>
  );
}
