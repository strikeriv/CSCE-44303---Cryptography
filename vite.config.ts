import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'src',
  plugins: [tailwindcss(), nodePolyfills()],
  build: {
    rollupOptions: {
      input: {
        main: 'src/index.html',
        hw1: 'src/hw1/index.html',
      },
    },
  },
});
