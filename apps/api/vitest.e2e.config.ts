import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.e2e.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
  },
});
