---
title: 'Building with Components: The Bento Grid'
description: 'How to use Gladtek pre-built components to assemble pages in minutes.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/blocks.webp'
tags: ["components", "ui"]
---

Modern web design favors modularity. Gladtek comes packed with a suite of components, but the crown jewel is the **Bento Grid**.

## What is a Bento Grid?

Popularized by Apple, a Bento Grid allows you to display varying types of content—stats, features, images, and text—in a cohesive, masonry-like layout that adapts to screen size.

## Using It in Gladtek

We've made it trivial to use.

```astro
<BentoGrid>
  <BentoItem class="col-span-2">
    <h3>Key Feature</h3>
  </BentoItem>
  <BentoItem>
    <Stat value="99%" label="Uptime" />
  </BentoItem>
</BentoGrid>
```

The underlying CSS Grid usage ensures it remains responsive, collapsing gracefully on mobile devices.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

