'use client';

import { useEffect, useState } from 'react';

// This page is static-exported at build time, so a plain `new Date()` in the
// component body would freeze the copyright year at whenever the last deploy
// happened. Rendering the build year first (matches the prerendered HTML,
// so no hydration mismatch) and correcting client-side keeps it honest
// across a year boundary without a rebuild.
export default function YearNow() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  // Re-reads the clock post-mount on purpose — see the note above. Not
  // derivable during render, since render must match whatever the last
  // build produced.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
