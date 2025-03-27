import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
      "assets": path.join(__dirname, "./assets"),
      "component": path.join(__dirname, "./src/ui/components"),
      "page": path.join(__dirname, "./src/ui/pages"),
      "util": path.join(__dirname, "./src/util")
    }
  },

  plugins: [svgr({
    include: "**/*.svg",
  }), react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    }
  },
});