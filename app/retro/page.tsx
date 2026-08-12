// Alias route: nurfajar.com/retro merender halaman yang sama persis dengan "/".
// Sengaja tidak menghapus/mindahin app/page.tsx supaya root domain tidak ikut berubah.
import HomePage from '../page';

export default function RetroPage() {
  return <HomePage />;
}
