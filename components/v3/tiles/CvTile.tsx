import { ReadCvLogo } from '@phosphor-icons/react/dist/ssr';

/* aria-hidden karena pembungkus Tile sudah membawa aria-label "Download my
   CV" dari V3_HOME_TILES. Tanpa ini, tautannya diumumkan dua kali. */
export default function CvTile() {
  return (
    <span className="v3-glyph" aria-hidden="true">
      <ReadCvLogo size={64} weight="duotone" />
    </span>
  );
}
