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
    host: '0.0.0.0', // agar bisa diakses dari luar container
    port: 5174,
    strictPort: true,
    origin: 'http://localhost:5174', // atau host.docker.internal jika pakai Docker Desktop
    cors: true,
    hmr: {
      host: 'localhost',    // harus sesuai domain tempat kamu akses di browser
    },

     proxy: {
      // Proxy semua request ke /dashboard ke backend Laravel di port 8001
      '/dashboard': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      }
    }
    
  },
});


