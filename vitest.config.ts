import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: ['./tests/component/setup.ts'],
    globals: true,
    typecheck: {
      enabled: true,
    },
  },
});
