---
title: 'Mastering Tailwind CSS 4'
description: 'How to leverage the latest features in Tailwind CSS v4 in your Astro projects.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/colors.webp'
tags: ["css", "tailwind"]
---

Tailwind CSS v4 brings a simplified configuration and a new engine written in Rust for blazing-fast builds.

## No More `tailwind.config.js`?

One of the biggest changes is the move towards configuring Tailwind directly in CSS using CSS variables. 

```css
@theme {
  --color-primary: #3b82f6;
  --font-family-display: "Clash Display", sans-serif;
}
```

## Dynamic Values

Tailwind v4 allows for more dynamic value usage without defining them in a config file beforehand. If you need a specific grid layout, just write it:

```html
<div class="grid-cols-[200px_1fr_100px]">
  <!-- ... -->
</div>
```

## Integration with Astro

In Gladtek, we've set up Tailwind v4 to work seamlessly with Astro's styling model, ensuring that only the CSS you use is included in the final build.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

