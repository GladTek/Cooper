import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from '@tailwindcss/vite';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import process from "node:process";

const DEFAULT_LOCALE = "en";

/**
 * Get appropriate adapter based on environment
 */
function getAdapter() {
  const adapter = process.env.ADAPTER || 'cloudflare';
  
  switch (adapter) {
    case 'cloudflare':
      return cloudflare({
        platformProxy: {
          enabled: true,
        },
        runtime: {
          mode: 'advanced',
          type: 'workers',
          nodejsCompat: true,
        },
      });
    case 'node':
    default:
      const node = (await import("@astrojs/node")).default;
      return node({
        mode: 'standalone'
      });
  }
}

// https://astro.build/config
export default defineConfig({
  // Enable SSR mode for dynamic content
  output: 'hybrid',
  
  site: process.env.SITE_URL || 'https://meamart.com',
  base: process.env.BASE_URL || '/',
  
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  integrations: [
    cloudflare(),
    react({
      jsxImportSource: 'react',
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: {
          'en': 'en-US',
          'ar': 'ar-SA',
          'fr': 'fr-FR',
          'de': 'de-DE',
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@emotion/react', '@emotion/styled'],
    },
    define: {
      'import.meta.env.DEFAULT_LOCALE': JSON.stringify(DEFAULT_LOCALE),
    },
    optimize: {
      include: ['date-fns'],
    },
  },

  // i18n configuration for RTL/LTR support
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: ["en", "ar", "fr", "de"],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // Image optimization
  image: {
    domains: [
      'meamart.com',
      'cdn.meamart.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
      },
    ],
  },

  // Adapter
  adapter: await getAdapter(),

  // Experimental features
  experimental: {
    contentCollectionCache: true,
  },

  // Server configuration
  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  // Build configuration
  build: {
    format: 'file',
    assets: 'assets',
    inlineStylesheets: 'auto',
  },

  // Security headers
  integrations: [],
});
