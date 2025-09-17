import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'src',
  plugins: [tailwindcss(), nodePolyfills()],
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        hw1: 'src/hw1/index.html',
        'hw1-encrypt': 'src/hw1/encrypt/index.html',
        'hw1-decrypt': 'src/hw1/decrypt/index.html',
        hw3: 'src/hw3/index.html',
        'hw3-part1': 'src/hw3/part1/index.html',
        'hw3-part2': 'src/hw3/part2/index.html',
        'hw3-part3': 'src/hw3/part3/index.html',
      },
    },
  },
});
