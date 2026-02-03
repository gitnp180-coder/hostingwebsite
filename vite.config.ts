import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/bholandev/',  // MUST have leading AND trailing slashes
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  // Optional: Add build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});