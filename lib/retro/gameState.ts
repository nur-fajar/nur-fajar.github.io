// Mesin state murni untuk game /retro. Tidak ada DOM, tidak ada React —
// supaya gampang di-unit-test dan gampang dipakai ulang dari komponen mana pun.

export type AreaGenre = 'platformer' | 'maze' | 'puzzle' | 'tetris';
export type AreaKey = 'org' | 'work' | 'proj' | 'skill' | 'hire';

export interface AreaBlueprint {
  id: number;
  key: AreaKey;
  name: string;
  sectionLabel: string;
  genre: AreaGenre;
  color: string;
  iconColor?: string;
  mapPos: [number, number];
  icon: 'camp' | 'tower' | 'forest' | 'temple' | 'light';
  intro: string;
  /** Jumlah entri konten area ini (item WORK/ORG/PROJECTS/SKILLS, atau kontak untuk 'hire'). */
  itemCount: number;
}

export interface AreaDef extends AreaBlueprint {
  /** Jumlah langkah (scroll/klik) untuk menuntaskan area ini. */
  steps: number;
}

export interface StepCursor {
  area: number | null;
  step: number;
}

/** Setiap entri butuh 2 langkah (buka blok -> baca isi), kecuali area 'hire':
    1 langkah per kontak + 1 langkah penutup "line clear". Plus 1 langkah
    pembuka (kartu genre) untuk semua area. */
export function computeAreaSteps(blueprint: AreaBlueprint): number {
  if (blueprint.key === 'hire') return 1 + blueprint.itemCount + 1;
  return 1 + blueprint.itemCount * 2;
}

export function buildAreas(blueprints: AreaBlueprint[]): AreaDef[] {
  return blueprints.map((b) => ({ ...b, steps: computeAreaSteps(b) }));
}

export function totalSteps(areas: AreaDef[]): number {
  return areas.reduce((sum, a) => sum + a.steps, 0);
}

/** Langkah global 1-indexed dipakai buat progress bar/track. 0 selama masih di peta. */
export function globalStep(cursor: StepCursor, areas: AreaDef[]): number {
  if (cursor.area === null) return 0;
  let n = 0;
  for (let i = 0; i < cursor.area; i++) n += areas[i].steps;
  return n + Math.max(0, cursor.step) + 1;
}

export interface AdvanceResult {
  cursor: StepCursor;
  /** true kalau hasil advance ini keluar dari area (mundur dari step 0, atau area selesai). */
  leftArea: boolean;
  /** id area yang baru saja dituntaskan, atau null kalau bukan penuntasan. */
  completedAreaId: number | null;
}

/** Menghitung cursor berikutnya untuk delta langkah (+1 maju, -1 mundur) SAAT SUDAH di dalam
    sebuah area. Saat cursor.area === null, navigasi ditangani di luar (lihat nextUndoneArea +
    pemanggilan enter area secara eksplisit oleh caller), jadi fungsi ini no-op di kondisi itu. */
export function advanceCursor(cursor: StepCursor, areas: AreaDef[], delta: number): AdvanceResult {
  if (cursor.area === null) {
    return { cursor, leftArea: false, completedAreaId: null };
  }
  const area = areas[cursor.area];
  const nextStep = cursor.step + delta;

  if (nextStep < 0) {
    return { cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: null };
  }
  if (nextStep >= area.steps) {
    return { cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: area.id };
  }
  return { cursor: { area: cursor.area, step: nextStep }, leftArea: false, completedAreaId: null };
}

/** Area belum-selesai pertama, urut sesuai array `areas` — dipakai saat pengguna scroll maju
    dari peta tanpa mengklik landmark tertentu. */
export function nextUndoneArea(areas: AreaDef[], done: ReadonlySet<number>): number | null {
  const found = areas.find((a) => !done.has(a.id));
  return found ? found.id : null;
}
