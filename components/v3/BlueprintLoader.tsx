'use client';

import dynamic from 'next/dynamic';

/* next/dynamic dengan ssr:false hanya boleh dipanggil dari Client
   Component, jadi loader tipis ini yang memisahkannya dari layout server.
   Ongkos Three.js (~600KB) tidak ikut bundle awal: kanvas baru diunduh
   setelah halaman hidup. */
const BlueprintCanvas = dynamic(() => import('./BlueprintCanvas'), { ssr: false });

export default function BlueprintLoader() {
  return <BlueprintCanvas />;
}
