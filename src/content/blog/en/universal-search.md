---
title: 'Universal Search with Fuse.js'
description: 'Implementing lightning-fast fuzzy search with a premium Command Palette.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/search.webp'
tags: ["search", "tech"]
---

Search usually requires complex infrastructure: ElasticSearch, Algolia, or a dedicated database. 
**Fuse.js** combined with a static JSON index changes the paradigm for content-driven sites.

## How It Works

1.  **Build Time**: During the Astro build process, we generate a `search.json` file containing all site content.
2.  **Run Time**: When the user opens the search modal, the browser fetches the lightweight index.
3.  **Fuzzy Matching**: Fuse.js provides near-instant results with support for typos and partial matches.

## The Result

- **Zero API Costs**: It runs entirely on the client without third-party services.
- **Privacy First**: Search queries never leave the user's browser.
- **Fuzzy Precision**: Users find what they need even with incomplete queries.

Gladtek wraps this powerful engine in a beautiful, accessible Command Palette (`Cmd+K`) interface.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

