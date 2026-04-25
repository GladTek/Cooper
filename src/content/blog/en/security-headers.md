---
title: 'Secure Headers & CSP'
description: 'Essential security best practices for modern web apps.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/shield.webp'
tags: ["security", "devops"]
---

Security is not an afterthought. Configuring the right HTTP headers is the first line of defense against XSS, clickjacking, and other attacks.

### Must-Have Headers

*   **Content-Security-Policy (CSP)**: Whitelists trusted content sources.
*   **Strict-Transport-Security (HSTS)**: Enforces HTTPS.
*   **X-Frame-Options**: Prevents clickjacking.
*   **X-Content-Type-Options**: Prevents MIME sniffing.

In Gladtek, we recommend configuring these headers at the edge (Cloudflare or Vercel) to ensure every response is secured before it reaches the browser.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

