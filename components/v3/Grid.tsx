/** Wadah grid 12 kolom. Sengaja tidak tahu apa-apa tentang isinya: lebar
 *  tiap ubin diputuskan ubin itu sendiri dari span yang dibawanya. */
export default function Grid({ children }: { children: React.ReactNode }) {
  return <div className="v3-grid">{children}</div>;
}
