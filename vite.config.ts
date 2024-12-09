import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => ({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
      "page": path.join(__dirname, "./src/ui/pages"),
      "component": path.join(__dirname, "./src/ui/components"),
      "util": path.join(__dirname, "./src/util")
    }
  },

  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    fs: {
      cachedChecks: false
    }
  },
}));
