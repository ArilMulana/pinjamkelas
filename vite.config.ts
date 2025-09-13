import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
      '@': resolve(__dirname, 'resources/js'),
    },
  },
  server: {
    host: 'localhost',   // pastikan ini sesuai dengan url yang kamu akses
    port: 5173,          // port default vite
    strictPort: true,    // agar gagal kalau port 5173 dipakai
    hmr: {
      host: 'localhost', // supaya websocket HMR connect ke localhost:5173
      port: 5173,
    },
// server: {
//   host: '0.0.0.0',   // penting untuk expose ke host
//   port: 5173,
//   strictPort: true,
//   hmr: {
//     //host: 'localhost', // biar HMR connect ke host
//      host: '127.0.0.1', aktifkan ketika mau docker
//     port: 5173,
//   },
  },
});

