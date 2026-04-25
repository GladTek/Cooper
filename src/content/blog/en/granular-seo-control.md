---
title: 'Granular SEO Control with Gladtek'
description: ' mastering indexation and visibility for your static site.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/graph.webp'
tags: ["seo", "guide"]
---

SEO isn't just about keywords; it's about controlling what search engines see. Gladtek gives you granular control over indexation.

## The `noindex` Prop

Sometimes you have pages you *don't* want Google to find. Staging environments, private documentation, or "thank you" pages.

In any `.astro` page or layout, you can simply pass:

```astro
<Layout noindex={true}>
  <!-- Secret content -->
</Layout>
```

## Frontmatter Support

For markdown files, add it to your YAML frontmatter:

```yaml
---
title: 'Private Draft'
noindex: true
---
```

## Sitemap Exclusion

Our efficient build process automatically scans for these flags and excludes `noindex` pages from your `sitemap.xml`, ensuring a clean signal to search engines.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

