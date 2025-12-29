import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from '@tailwindcss/vite';
import compress from "astro-compress";
import mermaid from "astro-mermaid";
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Helper to find noindex URLs
function getNoIndexUrls() {
  const urls = new Set();
  const contentDir = path.resolve('./src/content');
  const pagesDir = path.resolve('./src/pages');

  function scanDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath, callback);
      } else {
        callback(fullPath);
      }
    }
  }

  // Scan Content Collections
  scanDir(contentDir, (filePath) => {
    if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        if (data.noindex) {
           let relative = path.relative(contentDir, filePath);
           let urlPath = relative.replace(/\.(md|mdx)$/, '');
           urlPath = urlPath.replace(/\\/g, '/');
           if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;
           urls.add(urlPath);
           urls.add(urlPath + '/');
        }
      } catch (e) {
        console.warn(`Error parsing frontmatter for ${filePath}`, e);
      }
    }
  });

  // Scan Pages
  scanDir(pagesDir, (filePath) => {
    if (filePath.endsWith('.astro')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('noindex={true}')) {
        let relative = path.relative(pagesDir, filePath);
        let urlPath = relative.replace(/\.astro$/, '');
        urlPath = urlPath.replace(/\\/g, '/');
        
        if (urlPath.endsWith('/index')) {
          urlPath = urlPath.replace(/\/index$/, '') || '/';
        } else if (urlPath === 'index') {
            urlPath = '/';
        }

        if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;
        urls.add(urlPath);
        urls.add(urlPath + '/');
      }
    }
  });

  return Array.from(urls);
}

const noIndexUrls = getNoIndexUrls();
console.log('Excluding URLs from sitemap:', noIndexUrls);

const DEFAULT_LOCALE = "en";

import vercel from "@astrojs/vercel";
import netlify from "@astrojs/netlify";
import process from "node:process";

// ... other imports

// Adapter selection strategy
function getAdapter() {
  const adapter = process.env.ADAPTER || 'cloudflare';
  
  switch (adapter) {
    case 'vercel':
      return vercel({
        webAnalytics: { enabled: true }
      });
    case 'netlify':
      return netlify();
    case 'cloudflare':
    default:
      return cloudflare({
        platformProxy: {
          enabled: true,
        },
        runtime: {
          mode: 'advanced',
          type: 'worker',
          nodejsCompat: true,
        },
      });
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://cooper.gladtek.com',
  output: 'static',
  image: {
    domains: ['vitejs.dev', 'upload.wikimedia.org', 'astro.build', 'pagepro.co'],
  },
  adapter: getAdapter(),
  integrations: [
      sitemap({
          filter: (page) => {
              const url = new URL(page);
              const pathname = url.pathname;
              return !noIndexUrls.includes(pathname);
          }
      }), 
      react(), 
      mdx(),
      mermaid(),
      (await import("astro-compress")).default({Image : true, JavaScript : true, HTML : false})
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
        'import.meta.env.DEFAULT_LOCALE': JSON.stringify(DEFAULT_LOCALE)
    }
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: ["en", "ar", "fr", "de"],
    routing: {
        prefixDefaultLocale: true
    }
  }
});
