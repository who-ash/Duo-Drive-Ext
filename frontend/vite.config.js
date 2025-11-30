import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon16.jpeg", "icon32.jpeg", "icon48.jpeg", "icon128.jpeg"],
      manifest: {
        name: "Duo Drive",
        short_name: "Duo Drive",
        description: "Your own pair partner for learning",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        icons: [
          {
            src: "/icon16.jpeg",
            sizes: "16x16",
            type: "image/jpeg"
          },
          {
            src: "/icon32.jpeg",
            sizes: "32x32",
            type: "image/jpeg"
          },
          {
            src: "/icon48.jpeg",
            sizes: "48x48",
            type: "image/jpeg"
          },
          {
            src: "/icon128.jpeg",
            sizes: "128x128",
            type: "image/jpeg"
          },
          {
            src: "/icon128.jpeg",
            sizes: "192x192",
            type: "image/jpeg",
            purpose: "any maskable"
          },
          {
            src: "/icon128.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpeg,jpg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
});
