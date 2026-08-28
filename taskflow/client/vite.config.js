// vite.config.js
// Configures Vite dev server with proxy so /api requests go to the Express backend

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to the Express backend during development
    // This way, the browser calls http://localhost:5173/api/...
    // and Vite forwards them to http://localhost:5000/api/...
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
