import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL, // Use the VITE-prefixed variable
        changeOrigin: true,
        secure: false, // Only use if the SSL certificate is not valid
      },
    },
  },
});
