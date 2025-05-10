import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/', // ✅ Ensures correct base path
  build: {
    outDir: 'dist', // ✅ Vercel expects this if using static output
  },
  server: {
    allowedHosts: ['https://34bb-39-37-141-100.ngrok-free.app'],
  },
});
