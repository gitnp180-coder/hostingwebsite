import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/bholandev/', // Matches your repo name exactly
  plugins: [react()],
  server: {
    port: 3000,
  }
});