import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 *
 * @author ${pkg.author}
 * @license ${pkg.license}
 * @preserve
 */
`;

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["tests/**/*", "demo/**/*", "bench/**/*"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "SplayTree",
    },
    sourcemap: true,
    rollupOptions: {
      input: "src/index.ts",
      // postBanner is added after minification; a plain `banner` gets
      // stripped from the minified UMD bundle.
      output: [
        {
          format: "es",
          postBanner: banner,
        },
        {
          format: "umd",
          name: "SplayTree",
          postBanner: banner,
        },
      ],
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html", "json"],
    },
  },
});
