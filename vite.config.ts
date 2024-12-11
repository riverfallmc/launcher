import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from 'vite-plugin-svgr';

export default defineConfig(async () => ({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
      "assets": path.join(__dirname, "./src/assets"),
      "component": path.join(__dirname, "./src/ui/components"),
      "page": path.join(__dirname, "./src/ui/pages"),
      "util": path.join(__dirname, "./src/util")
    }
  },

  plugins: [react(), svgr({
    include: '**/*.svg',
    svgrOptions: {
      exportType: 'default',
    },
  })],
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