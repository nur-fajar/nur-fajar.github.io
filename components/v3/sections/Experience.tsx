import { LEADERSHIP, V3_SECTIONS, WORK_HISTORY, type Role } from '@/content/ledger';
import { formatRange } from '@/lib/dates';
import Section, { findSection } from '../Section';
import TimelineDraw from '../TimelineDraw';

/* Tanggal tidak pernah diformat di sini. lib/dates.ts satu-satunya yang boleh
   menerjemahkan format simpanan ("2024 FEB") ke format tampilan, karena versi
   lama situs ini memformatnya per komponen dan menghasilkan dua format berbeda
   di dalam satu kartu yang sama. */
function RoleCard({ role, quiet }: { role: Role; quiet?: boolean }) {
  return (
    <li className={quiet ? 'v3-role v3-role--quiet' : 'v3-card v3-role'}>
      <div className="v3-role__head">
        <div>
          <h3 className="v3-role__title">{role.title}</h3>
          <p className="v3-role__org">
            {role.org} <span aria-hidden="true">·</span> {role.place}
          </p>
        </div>
        <p className="v3-role__dates">{formatRange(role.start, role.end)}</p>
      </div>

      <p className="v3-role__detail">{role.detail}</p>

      {quiet ? null : (
        <ul className="v3-role__bullets">
          {role.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Tiga peran berbayar, lalu dua kepemimpinan organisasi di bawahnya dengan
 * bobot visual lebih ringan.
 *
 * Pemisahan itu bukan selera tata letak: CV memisahkan WORK EXPERIENCE dari
 * LEADERSHIP & ORGANIZATIONAL, dan kalau situs menyamakan keduanya, sinyal
 * seniority peran berbayar ikut mengencer. Kartu ringan tidak menampilkan
 * uraian butir, cuma jabatan, tempat, tanggal, dan satu baris ringkas.
 */
export default function Experience() {
  const section = findSection(V3_SECTIONS, 'experience');

  return (
    <Section section={section}>
      {/* Rel timeline cuma membungkus riwayat berbayar. Daftar kepemimpinan
          di bawahnya sengaja tidak ikut: rel ini menandai kronologi peran,
          dan CV memisahkan keduanya. */}
      <div className="v3-timeline">
        <TimelineDraw />
        <span className="v3-timeline__track" aria-hidden="true" />
        <span className="v3-timeline__fill" aria-hidden="true" />
        <ul className="v3-roles">
          {WORK_HISTORY.map((role) => (
            <RoleCard key={`${role.org}-${role.start}`} role={role} />
          ))}
        </ul>
      </div>

      <h3 className="v3-subhead">Leadership and organizations</h3>
      <ul className="v3-roles v3-roles--quiet">
        {LEADERSHIP.map((role) => (
          <RoleCard key={`${role.org}-${role.start}`} role={role} quiet />
        ))}
      </ul>
    </Section>
  );
}
