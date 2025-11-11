import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
      overlay: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  base: process.env.VITE_APP_BASE_URL ? new URL('/', process.env.VITE_APP_BASE_URL).pathname : '/',
  build: {
    target: 'es2020', // New: Aligns strict mode w/ modern JS (avoids reserved word clashes on exports)
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
    },
  },
});