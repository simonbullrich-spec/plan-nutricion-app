import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // En GitHub Pages la app vive en /plan-nutricion-app/ (lo define el workflow de deploy)
  base: process.env.BASE_PATH || "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Plan Nutrición",
        short_name: "Nutrición",
        description: "Plan de comidas semanal para recomposición corporal: comidas, agua y entrenamientos.",
        lang: "es-AR",
        theme_color: "#2E6A45",
        background_color: "#F3F5F1",
        display: "standalone",
        start_url: ".",
        scope: ".",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // todo lo necesario para abrir la app sin conexión (incluye las fuentes)
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "index.html",
      },
    }),
  ],
});
