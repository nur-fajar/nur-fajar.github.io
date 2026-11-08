import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [...nextCoreWebVitals, {
    // Worktree agent adalah checkout penuh dengan build-nya sendiri; tanpa ini
    // `npm run lint` dari root melaporkan ratusan temuan dari kode yang tidak
    // ada di branch ini. archive/ = skin edisi v9 lama yang dilepas
    // 2026-11-08, tetap di disk tanpa ikut build/lint/kebanyakan test hsai.
    ignores: ['out/**', '.next/**', '.claude/**', '.worktrees/**', 'v2/**', 'archive/**', '*.jsx'],
  }];

export default eslintConfig;
