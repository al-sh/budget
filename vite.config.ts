import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import fs from 'fs';

const PORT = 3000;

const packageJson = fs.readFileSync('./package.json').toString();
const version = JSON.parse(packageJson).version;
const homepage = JSON.parse(packageJson).homepage;

export default defineConfig({
  plugins: [svgr(), reactRefresh(), VitePWA({ registerType: 'autoUpdate', devOptions: { enabled: true } })],
  build: { outDir: 'build' },
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __HOMEPAGE__: JSON.stringify(homepage),
  },
  base: '/',
  server: {
    port: PORT,
    open: `http://localhost:${PORT}`,

    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
