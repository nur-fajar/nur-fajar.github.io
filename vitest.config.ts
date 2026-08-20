import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // Alasan yang sama dengan `ignores` di eslint.config.mjs: worktree agent
    // adalah checkout penuh yang membawa test-nya sendiri.
    exclude: ['**/node_modules/**', '.claude/**', '.worktrees/**', 'v2/**', 'out/**'],
  },
});
