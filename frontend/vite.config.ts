import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,

    fs: { strict: false },
    middlewareMode: false,

    // ⚠️ IMPORTANTE: NÃO PROXY /shares (é rota do frontend)
    proxy: {
      "/dashboards": "http://localhost:3000",
      "/pivot": "http://localhost:3000",
      "/metrics": "http://localhost:3000",
    },
  },
});
