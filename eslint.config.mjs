import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [...nextCoreWebVitals, {
    // Worktree agent adalah checkout penuh dengan build-nya sendiri; tanpa ini
    // `npm run lint` dari root melaporkan ratusan temuan dari kode yang tidak
    // ada di branch ini.
    ignores: ['out/**', '.next/**', '.claude/**', '.worktrees/**', 'v2/**', '*.jsx'],
  }];

export default eslintConfig;
