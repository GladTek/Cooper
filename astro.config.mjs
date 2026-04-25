import { defineConfig, fontProviders } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";
import vercel from "@astrojs/vercel";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node";
import tailwindcss from '@tailwindcss/vite';
import mermaid from "astro-mermaid";
import process from "node:process";

// Strip heading IDs from changelogs to fix duplicate ID warnings based on hN having the same name example with mdx, md plugins : Performance (0.3.0, 0.2.8)
const stripIdsPlugin = () => (tree, file) => {
  const filePath = (file.path || (file.history && file.history[0]) || '').replace(/\\/g, '/');
  const isChangelog = filePath.toLowerCase().includes('changelog') || filePath.match(/v\d+-\d+-\d+/);
  
  if (isChangelog) {
    const visit = (node) => {
      // Remark phase: preemptively block the internal slugifier
      if (node.type === 'heading') {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.id = "";
      }
      
      // Rehype phase: final sweep to make sure IDs are actually gone from the HTML
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        if (node.properties && ('id' in node.properties)) {
          delete node.properties.id;
        }
      }
      
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  }
};

const DEFAULT_LOCALE = "en";

function getAdapter() {
  const adapter = process.env.ADAPTER || 'node';
  switch (adapter) {
    case 'vercel': return vercel({ webAnalytics: { enabled: true } });
    case 'netlify': return netlify();
    case 'cloudflare': return cloudflare({ platformProxy: { enabled: true }, runtime: { mode: 'advanced', type: 'worker', nodejsCompat: true } });
    case 'node': default: return node({ mode: 'standalone' });
  }
}

export default defineConfig({
  site: process.env.SITE_URL || 'https://cooper.gladtek.com',
  output: 'static',
  image: {
    domains: ['vitejs.dev', 'upload.wikimedia.org', 'astro.build', 'pagepro.co'],
    service: { entrypoint: 'astro/assets/services/sharp' },
    quality: 80,
  },
  adapter: getAdapter(),
  markdown: {
    remarkPlugins: [stripIdsPlugin],
    rehypePlugins: [stripIdsPlugin],
  },
  vite: {
    plugins: [tailwindcss()],
    define: { 'import.meta.env.DEFAULT_LOCALE': JSON.stringify(DEFAULT_LOCALE) },
    ssr: {
      noExternal: ['lucide-react', 'motion', 'motion/react']
    }
  },
  fonts: [
    { provider: fontProviders.fontsource(), name: "Inter", cssVariable: "--font-inter" },
    { provider: fontProviders.fontsource(), name: "Outfit", cssVariable: "--font-outfit" }
  ],
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: ["en", "ar", "fr", "de"],
    routing: { prefixDefaultLocale: true }
  },
  integrations: [
    sitemap(), 
    react(), 
    mdx({
      remarkPlugins: [stripIdsPlugin],
      rehypePlugins: [stripIdsPlugin]
    }),
    mermaid()
  ]
});
