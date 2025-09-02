import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3090,
    strictPort: false,
  },
  build: {
    outDir: './dist',
    minify: 'terser',
  },
});