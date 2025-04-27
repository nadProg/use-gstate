import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { fileURLToPath } from "url";

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      "@lib": path.resolve(__dirname, "lib"),
      "@docs": path.resolve(__dirname, "docs/src"),
      "@examples": path.resolve(__dirname, "src/examples"),
    },
  },
  // Specify the index.html path for the docs
  root: "docs",
  // Support importing example code as raw text
});
