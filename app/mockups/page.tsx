import MockupBrowser from './MockupBrowser';
import { CATALOG } from './catalog';

/* Halaman alat eksplorasi: 48 mockup di-browse lewat katalog. Konten mockup
   adalah berkas statis di public/mockups/*.html yang di-iframe di detail view. */
export default function Page() {
  return <MockupBrowser items={CATALOG} />;
}
