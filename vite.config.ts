import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Reachable from a phone on the same wifi, which is the only way to judge
    // a site built for phones.
    host: true,
    port: 5173,
  },
});
