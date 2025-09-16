import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: "src/index.html",
        hw1: "src/hw1/index.html",
      },
    },
  },
});
