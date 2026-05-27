// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const strapiOrigin =
  /** @type {any} */ (globalThis).process?.env?.STRAPI_URL ??
  "http://localhost:1337";

/** @type {{ protocol: string; hostname: string; port?: string }} */
let strapiRemotePattern = {
  protocol: "http",
  hostname: "localhost",
  port: "1337",
};

try {
  const parsed = new URL(strapiOrigin);
  strapiRemotePattern = {
    protocol: parsed.protocol.replace(":", ""),
    hostname: parsed.hostname,
    port: parsed.port || undefined,
  };
} catch {
  // Keep localhost defaults if STRAPI_URL is invalid.
}

// https://astro.build/config
export default defineConfig({
  image: {
    remotePatterns: [
      {
        ...strapiRemotePattern,
        pathname: "/**",
      },
    ],
  },
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
  redirects: {
    "/tienda": "https://www.tienda.kikiriprint.com/",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
