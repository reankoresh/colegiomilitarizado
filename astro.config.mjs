// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-google-sans",
        weights: [300, 400, 500, 600, 700],
        styles: ["normal"],
        subsets: ["latin"],
        fallbacks: ["system-ui", "sans-serif"],
        display: "swap",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
