import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function getPlugins() {
  const plugins = [react(), tsconfigPaths()];
  return plugins;
}

export default defineConfig({
  plugins: getPlugins(),
  build: {
    // 构建输出目录
    outDir: "dist/static",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 使用相对模式，避免以 "/" 或 "./" 开头导致的构建错误
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
