import { V6_HATS, type HatId } from '@/content/v6-hats';
import { HatGlyph } from './PixelCharacter';

/**
 * HatSelector: tiga chip topi. Topi terpakai mendapat status pressed dan
 * label "remove", topi netral memicu penerbangan ke sprite (orkestrasi di
 * HatStage). Tombol asli, jadi keyboard dan screen reader jalan.
 */
export default function HatSelector({
  worn,
  onEquip,
  onRemove,
}: {
  worn: HatId[];
  onEquip: (hat: HatId) => void;
  onRemove: (hat: HatId) => void;
}) {
  return (
    <div className="v6-hats" role="group" aria-label="Choose a hat">
      {V6_HATS.map((hat) => {
        const isWorn = worn.includes(hat.id);
        return (
          <button
            key={hat.id}
            type="button"
            data-hat={hat.id}
            className={`v6-hat${isWorn ? ' v6-hat--worn' : ''}`}
            style={{ ['--hat-accent' as string]: hat.accent }}
            aria-pressed={isWorn}
            aria-label={isWorn ? `${hat.name}: remove` : `${hat.name}: wear`}
            onClick={() => (isWorn ? onRemove(hat.id) : onEquip(hat.id))}
          >
            <span className="v6-hat__glyph" aria-hidden="true">
              {hat.glyph}
            </span>
            <span className="v6-hat__name">{hat.name}</span>
            <span className="v6-hat__role">{hat.title}</span>
          </button>
        );
      })}
    </div>
  );
}
