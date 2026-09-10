import { CONTACT } from '@/content/ledger';

/**
 * Tulisan tangan, lalu satu baris yang menurunkan biaya psikologis mengirim
 * pesan dingin. Ubin ini sebelumnya cuma memuat dua kata di ruang 548x165.
 */
export default function ConnectTile() {
  return (
    <>
      <p className="v3-connect">Let&apos;s Connect!</p>
      <p className="v3-connect__reply">{CONTACT.responseTime}</p>
    </>
  );
}
