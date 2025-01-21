import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
  define: {
    "process.env": process.env,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/bundle.js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
