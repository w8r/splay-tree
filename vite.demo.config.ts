import { defineConfig } from "vite";
import { resolve } from "path";

// Builds the demo/ landing page as a static site for GitHub Pages. Kept apart
// from vite.config.ts, which builds the npm package: sharing one config would
// leak the site into dist/. The page imports the library from src/ directly.
export default defineConfig({
  root: resolve(import.meta.dirname, "demo"),
  base: "/splay-tree/",
  build: {
    target: "es2020",
    outDir: resolve(import.meta.dirname, "demo-dist"),
    emptyOutDir: true,
  },
});
