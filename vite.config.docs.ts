import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "lib"),
      "@docs": resolve(__dirname, "docs/src"),
      "@examples": resolve(__dirname, "src/examples"),
    },
  },
  // Specify the index.html path for the docs
  root: "docs",
  // Support importing example code as raw text
});
