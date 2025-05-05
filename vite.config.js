import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  server: {
    allowedHosts: ["https://34bb-39-37-141-100.ngrok-free.app"],
  }
})
