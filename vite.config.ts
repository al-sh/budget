import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';

const PORT = 3000;

export default defineConfig({
  plugins: [svgr(), reactRefresh()],
  build: { outDir: 'build' },
  base: '/',
  server: {
    port: PORT,
    open: `http://localhost:${PORT}`,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
