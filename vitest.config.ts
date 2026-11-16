import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Instruments `vitest bench` when run under CodSpeedHQ/action in CI;
  // a no-op locally, so `npm run bench` behaves as before.
  plugins: [codspeedPlugin()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html", "json"],
    },
  },
});
