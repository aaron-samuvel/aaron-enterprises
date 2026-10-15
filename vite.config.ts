import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/aaron-enterprises/',
  plugins: [react(), tailwindcss()],
  optimizeDeps: { noDiscovery: true, include: [] },
})
