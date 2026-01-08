import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  site: 'https://tannerka5.com',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'framer-motion': ['framer-motion'],
            'react-vendor': ['react', 'react-dom'],
            'home-animations': ['./src/components/AnimatedCounter', './src/components/AnimatedDivider', './src/components/StaggeredList'],
          },
        },
      },
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  }
});
