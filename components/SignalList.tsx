import type { Signal } from '@/content/signals';
import Reveal from './motion/Reveal';

/** Renders `__word__` as bold — the only markup the signal bullets need
    (used to bold the "Output:" prefix on organizational-experience lines). */
function renderBullet(text: string) {
  const parts = text.split(/__([^_]+)__/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

export default function SignalList({ items }: { items: Signal[] }) {
  return (
    <Reveal as="div" className="signal-list panel">
      {items.map((s) => (
        <details className="signal" key={s.id} open={s.open}>
          <summary>
            <span className="sig-id mono">{s.id}</span>
            <span className="sig-main">
              {s.category && <span className="sig-category mono">{s.category}</span>}
              <span className="sig-name">{s.name}</span>
              <span className="sig-sub">{s.sub}</span>
            </span>
            {s.fill > 0 && (
              <span className="sig-bars" data-fill={s.fill} aria-label={`signal strength ${s.fill} of 5`}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            )}
          </summary>
          <ul className="sig-detail">
            {s.bullets.map((b, i) => (
              <li key={i}>{renderBullet(b)}</li>
            ))}
          </ul>
        </details>
      ))}
    </Reveal>
  );
}
