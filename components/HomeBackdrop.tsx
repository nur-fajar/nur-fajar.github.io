import Starfield from './Starfield';

// Two backdrop layers behind the page content: a faint blueprint grid (see
// .bp-grid in globals.css) and the constellation Starfield canvas — apt for
// a dayside/nightside orbital theme, and it already existed for the hero's
// zodiac globe widget, just wasn't drawn full-page under the old bento skin.
export default function HomeBackdrop() {
  return (
    <>
      <div className="bp-grid" aria-hidden="true" />
      <Starfield />
    </>
  );
}
