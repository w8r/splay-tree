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
  plugins: [dts({ rollupTypes: true, entryRoot: "src" })],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "SplayTree",
    },
    sourcemap: true,
    rollupOptions: {
      input: "src/index.ts",
      output: [
        {
          format: "es",
          banner,
        },
        {
          format: "umd",
          name: "SplayTree",
          banner,
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
