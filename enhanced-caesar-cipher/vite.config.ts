import { defineConfig } from 'vite';
import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        encrypt: resolve(__dirname, 'encrypt/index.html'),
        decrypt: resolve(__dirname, 'decrypt/index.html'),
      },
    },
  },
});
