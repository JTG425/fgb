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
  build: {
    // Enable source maps for production debugging (optional, remove if bundle size is critical)
    sourcemap: false,

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'motion'],
          'aws-vendor': ['aws-amplify', '@aws-amplify/ui-react'],
          'map-vendor': ['mapbox-gl', 'react-map-gl'],
        },
      },
    },

    // Increase chunk size warning limit (default is 500kb)
    chunkSizeWarningLimit: 1000,

    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
