import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  base: '/', 
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  define: {
    __APP_ENV__: JSON.stringify('production'),
  },
  server: {
    port: 3005,
    open: true,
    host: true
  }
});
