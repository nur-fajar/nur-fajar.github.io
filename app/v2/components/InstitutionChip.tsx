import type { InstitutionLogo } from '../data';

/* Small attribution mark — an official SVG when one could be sourced
   (rendered with `currentColor` so it inherits the chip's monochrome
   treatment), otherwise a plain text wordmark. Either way this is
   attribution-sized, never a big co-branding lockup. */
export default function InstitutionMark({ logo }: { logo: InstitutionLogo }) {
  if (logo.src) {
    // eslint-disable-next-line @next/next/no-img-element -- currentColor-tinted SVG, next/image can't do that
    return <img className="v2-mark-svg" src={logo.src} alt="" aria-hidden="true" />;
  }
  return (
    <span className="v2-mark-word mono" aria-hidden="true">
      {logo.name}
    </span>
  );
}
