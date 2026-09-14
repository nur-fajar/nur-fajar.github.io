'use client';

import { useEffect, useState } from 'react';

const JAKARTA = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Jakarta',
});

/**
 * Jam live Jakarta (GMT+7). Island kecil: render server sekali, lalu tick
 * tiap 15 detik di client. suppressHydrationWarning menutup selisih
 * detik antara HTML server dan hydrate pertama.
 */
export default function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} title="Local time in Jakarta (GMT+7)" suppressHydrationWarning>
      {JAKARTA.format(now)}
    </span>
  );
}
