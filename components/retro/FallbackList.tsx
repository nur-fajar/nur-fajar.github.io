// components/retro/FallbackList.tsx
// Mode non-game: daftar linear semua konten, tanpa scroll-jacking dan tanpa
// animasi scene. Dipakai otomatis saat prefers-reduced-motion aktif, atau
// lewat toggle manual di HUD (lihat IslandGame.tsx).
import { AREAS, CONTACT, ORG, PROJECTS, SKILLS, WORK, type StoryBeat, type ProjectEntry } from '@/lib/retro/content';
import { RichText } from './RichText';

function StoryList({ items }: { items: (StoryBeat | ProjectEntry)[] }) {
  return (
    <ul className="space-y-4">
      {items.map((d) => (
        <li key={d.tag} className="border-2 border-[var(--ink)] bg-[var(--cream-d)] p-4">
          <p className="font-pixel text-[8px] text-[var(--ink-2)]">{d.sub}</p>
          <h4 className="font-pixel text-[11px]">{d.title}</h4>
          <p className="mt-2">
            <RichText text={d.problem} />
          </p>
          <p className="mt-1">
            <RichText text={d.resolution} />
          </p>
        </li>
      ))}
    </ul>
  );
}

export function FallbackList() {
  return (
    <main className="mx-auto max-w-[74ch] px-5 py-10 text-[var(--ink)]">
      <h1 className="font-pixel text-[16px] leading-relaxed">NUR FAJAR — ISLAND (TEXT VERSION)</h1>
      <p className="mt-3">
        This is the non-animated version of the island portfolio, shown automatically when your system prefers
        reduced motion. Every section below is the same content as the animated version.
      </p>

      {AREAS.map((area) => (
        <section key={area.id} className="mt-9" aria-labelledby={`fallback-${area.key}`}>
          <h2 id={`fallback-${area.key}`} className="font-pixel text-[13px]" style={{ color: area.color }}>
            {area.sectionLabel}
          </h2>
          <p className="mt-1 text-[var(--ink-2)]">{area.intro}</p>
          <div className="mt-3">
            {area.key === 'skill' ? (
              <ul className="space-y-4">
                {SKILLS.map((s) => (
                  <li key={s.name} className="border-2 border-[var(--ink)] bg-[var(--cream-d)] p-4">
                    <h4 className="font-pixel text-[11px]">{s.plainName.toUpperCase()}</h4>
                    <p className="mt-2">
                      <RichText text={s.blurb} />
                    </p>
                    <ul className="mt-2 ml-5 list-disc">
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : area.key === 'hire' ? (
              <ul className="space-y-4">
                {CONTACT.map((c) => (
                  <li key={c.tag} className="border-2 border-[var(--ink)] bg-[var(--cream-d)] p-4">
                    <h4 className="font-pixel text-[11px]">
                      {c.tag} — {c.value}
                    </h4>
                    <p className="mt-2">
                      <RichText text={c.blurb} />
                    </p>
                    <a className="mt-2 inline-block border-b-2 border-[var(--accent)]" href={c.href}>
                      Open {c.tag.toLowerCase()} →
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <StoryList items={area.key === 'org' ? ORG : area.key === 'work' ? WORK : PROJECTS} />
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
