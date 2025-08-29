import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        home: "src/home/index.html",
        encrypt: "src/encrypt/index.html",
      },
    },
  },
});
