import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      include: ["src"],
      reporter: ["text", "html", "json"],
      // The website claims 100% coverage: keep it that way
      thresholds: { 100: true },
    },
  },
});
