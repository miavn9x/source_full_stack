import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@features": path.resolve(process.cwd(), "src/features"),
      "@shared": path.resolve(process.cwd(), "src/shared"),
      "@platform": path.resolve(process.cwd(), "src/platform"),
    },
  },
});
