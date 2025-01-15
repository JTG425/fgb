import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgecss from 'vite-plugin-purgecss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    purgecss({
      content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.css'],
    }),
  ],
})
