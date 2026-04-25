---
title: 'Deploying to the Edge'
description: 'Getting your Gladtek site live on Cloudflare or Vercel.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/globe.webp'
tags: ["devops", "deployment"]
---

Static sites are the easiest to deploy. Because Gladtek produces standard HTML/CSS/JS, you can host it anywhere. But "Edge" networks offer the best performance.

## Cloudflare Pages

1.  Connect your GitHub repo.
2.  Select **Astro** as the framework.
3.  Deploy.

Cloudflare's edge network ensures your assets are cached in hundreds of data centers worldwide, reducing latency to near zero.

## Vercel

Similar ease of use, with the added benefit of excellent analytics and "Deploy Previews" that allow you to review changes before they merge to main.

Gladtek is optimized for both, with a `wrangler.toml` ready for Cloudflare users who need advanced features like Workers or KV bindings.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

