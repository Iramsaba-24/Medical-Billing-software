// // vite.config.ts
// import { defineConfig } from "file:///D:/STARSOFTECH/medical_billing_project/node_modules/vite/dist/node/index.js";
// import path from "node:path";
// import electron from "file:///D:/STARSOFTECH/medical_billing_project/node_modules/vite-plugin-electron/dist/simple.mjs";
// import react from "file:///D:/STARSOFTECH/medical_billing_project/node_modules/@vitejs/plugin-react/dist/index.js";
// import tailwindcss from "file:///D:/STARSOFTECH/medical_billing_project/node_modules/@tailwindcss/vite/dist/index.mjs";
// var __vite_injected_original_dirname = "D:\\STARSOFTECH\\medical_billing_project";
// var vite_config_default = defineConfig({
//   base: "./",
//   plugins: [
//     tailwindcss(),
//     react(),
//     electron({
//       main: {
//         entry: "electron/main.ts"
//       },
//       preload: {
//         input: path.join(__vite_injected_original_dirname, "electron/preload.ts")
//       },
//       // See https://github.com/electron-vite/vite-plugin-electron-renderer
//       renderer: process.env.NODE_ENV === "test" ? void 0 : {}
//     })
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__vite_injected_original_dirname, "src/renderer/src")
//     }
//   },
//   server: {
//     port: 7e3,
//     open: true,
//     host: true
//   }
// });
// export {
//   vite_config_default as default
// };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxTVEFSU09GVEVDSFxcXFxtZWRpY2FsX2JpbGxpbmdfcHJvamVjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcU1RBUlNPRlRFQ0hcXFxcbWVkaWNhbF9iaWxsaW5nX3Byb2plY3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1NUQVJTT0ZURUNIL21lZGljYWxfYmlsbGluZ19wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24vc2ltcGxlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTonLi8nLFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICByZWFjdCgpLFxyXG4gICAgZWxlY3Ryb24oe1xyXG4gICAgICBtYWluOiB7XHJcbiAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluLnRzJyxcclxuICAgICAgfSxcclxuICAgICAgcHJlbG9hZDoge1xyXG4gICAgICAgIGlucHV0OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZWxlY3Ryb24vcHJlbG9hZC50cycpLFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uLXZpdGUvdml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcclxuICAgICAgcmVuZGVyZXI6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCdcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24tdml0ZS92aXRlLXBsdWdpbi1lbGVjdHJvbi1yZW5kZXJlci9pc3N1ZXMvNzgjaXNzdWVjb21tZW50LTIwNTM2MDA4MDhcclxuICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgIDoge30sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gICAgIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9yZW5kZXJlci9zcmMnKSxcclxuICAgIH1cclxuICB9LFxyXG4gICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDcwMDAsXHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgaG9zdDogdHJ1ZVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUyxTQUFTLG9CQUFvQjtBQUN2VSxPQUFPLFVBQVU7QUFDakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUp4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFLO0FBQUEsRUFDTCxTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDSixPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTyxLQUFLLEtBQUssa0NBQVcscUJBQXFCO0FBQUEsTUFDbkQ7QUFBQTtBQUFBLE1BRUEsVUFBVSxRQUFRLElBQUksYUFBYSxTQUUvQixTQUNBLENBQUM7QUFBQSxJQUNQLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDRyxTQUFTO0FBQUEsSUFDVixPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxJQUNqRDtBQUFBLEVBQ0Y7QUFBQSxFQUNDLFFBQVE7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
