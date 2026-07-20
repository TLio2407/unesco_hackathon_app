import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  oxc: false,
  define: { __DEV__: 'false', 'process.env.NODE_ENV': '"test"' },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/component/**/*.test.tsx'],
    setupFiles: ['./tests/component/setup.ts'],
    server: { deps: { inline: [/.*/] } },
  },
});
