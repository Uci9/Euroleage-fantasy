import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Reachable from a phone on the same wifi, which is the only way to judge
    // a site built for phones.
    host: true,
    port: 5173,
    // The API is a separate process; proxying it means the browser sees one
    // origin, so there are no cross-origin rules to get wrong.
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } },
  },
});
