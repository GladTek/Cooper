# The Ultimate Astro Boilerplate

The most advanced, batteries-included template for building blazing-fast SaaS, AI tools, and modern web applications with Astro 5, Tailwind CSS 4, and React.

<p align="center">
  <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/GladTek/Cooper">
    <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" />
  </a>

  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/GladTek/Cooper">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>

  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGladTek%2FCooper">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

## Core Architectural Strategies

This boilerplate is built on several key architectural pillars designed for scale, performance, and developer experience.

### 1. Atomic Component Strategy
We categorize components into functional layers to ensure a clear separation of concerns:
- **UI (Atoms)**: Fundamental building blocks like `Button`, `Badge`, `Heading`, and `Card`.
- **Sections (Molecules/Organisms)**: Composed marketing sections like `Hero`, `FeaturesList`, `CTA`, and `PricingTable`.
- **Layout (Structure)**: Page-level structure including `Header`, `Footer`, `SEO`, and `Breadcrumbs`.
- **Blog (Contextual)**: Content-specific elements like `BlogCard`, `ChangelogItem`, and `TableOfContents`.
- **Common (Utilities)**: System-level utilities like `ThemeToggle`, `LanguagePicker`, and `CookieConsent`.

### 2. Documentation-First Approach
The project features a high-performance documentation engine powered by **MDX** and **Pagefind**:
- **Categorized Sidebar**: Documentation is automatically grouped by folder (e.g., `ui`, `sections`, `layout`).
- **Premium Typography**: Custom-styled prose optimized for readability.
- **Deep Linking**: Automatic anchor links and perfect scroll alignment with a sticky header.

### 3. Type-Safe Internationalization (i18n)
- **Flat File Dictionary**: Localizations are managed via `.properties` files for clean, type-safe translations.
- **RTL Support**: Automatic layout mirroring for languages like Arabic (`/ar/`).
- **Path Persistence**: Switching languages preserves the current page path.

## Project Structure

```text
src/
├── components/        # Categorized Component Library
│   ├── ui/            # UI Atoms (Buttons, Badges)
│   ├── sections/      # Marketing Sections (Hero, CTA)
│   ├── layout/        # Structural Elements (Header, Footer)
│   ├── blog/          # Content-specific components
│   └── common/        # Shared Utilities (Toggles, i18n)
├── content/           # Content Collections
│   ├── docs/          # Categorized Documentation (MDX)
│   ├── blog/          # Multilingual Blog Posts
│   └── config.ts      # Schema Definitions
├── i18n/              # type-safe translation logic
├── layouts/           # Page Shells
├── pages/             # File-based routing
├── styles/            # CSS (Tailwind 4 + Custom Layers)
└── site.config.ts     # Centralized Project Configuration
```

## Features

### Core Stack
- **Astro 5**: The latest version of the web framework for content-driven websites.
- **Tailwind CSS 4**: Zero-config, engine-integrated utility-first CSS.
- **React 19**: Powered by React 19 for modern concurrent rendering.
- **TypeScript**: 100% type-safe codebase.

### Accessibility & Performance
- **WCAG AA/AAA Compliant**: High-contrast dark/light themes and accessible focus states.
- **100/100 Lighthouse**: Optimized for Core Web Vitals out of the box.
- **Reduced Motion**: Respects system preferences for animations.

### Premium Components
- **Bento Grid**: Modern showcase layout for features.
- **Comparison Table**: Responsive pricing and feature comparison.
- **Infinite Marquee**: GPU-accelerated scrolling logo cloud.
- **Advanced FAQ**: Glassmorphic, accessible accordion.
- **Timeline & Stats**: Interactive roadmaps and animated counters.

## Customization
 
The project is designed to be easily customized via a centralized configuration file.
 
### 1. Site Configuration
Edit `src/site.config.ts` to manage:
- **Identity**: Site name, description, and logo.
- **Navigation**: Header (`NAV_LINKS`) and Footer (`FOOTER_LINKS`) menus.
- **Socials**: Social media links in `ACTION_LINKS`.
- **Analytics**: Google Analytics, Umami, etc.
- **Features**: Toggle built-in features like the announcement banner or search.
 
```typescript
// src/site.config.ts
export const siteConfig = {
  name: 'Cooper',
  logo: { src: '/logo.svg' },
  // ...
};
```
 
### 2. Styling & Theming
- **Tailwind CSS**: Configured in `src/styles/theme.css` via CSS variables for light/dark modes.
- **Typography**: Custom fonts and prose styles in `src/styles/typography.css`.
 
### 3. Internationalization
Add new languages or update translations in `src/i18n/locales/`. The project uses strictly typed `.properties` files.
 
## Getting Started

### Quick Start
Initialize a new project instantly with our CLI:
```bash
npx @gladtek/launch-cooper@latest
```

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GladTek/Cooper.git
   cd Cooper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Copy the example environment file and adjust the variables as needed:
   ```bash
   cp .env.example .env
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. **Deploy to Cloudflare**
   ```bash
   npm run deploy
   # or manually
   npx wrangler deploy
   ```

5. **Deploy to Vercel/Netlify**
   The project supports Vercel and Netlify out of the box. Use the corresponding build command:

   - **Vercel**: `npm run build:vercel`
   - **Netlify**: `npm run build:netlify`
   - **Cloudflare**: `npm run build:cloudflare`
   - **Node.js**: `npm run build` (default)


### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ADAPTER` | The build adapter (`vercel`, `netlify`, `cloudflare`, `node`). | `node` |
| `SITE_URL` | The production URL of the site. | `https://cooper.gladtek.com` |


## How To Guides

### Adding a New Component
1. Decide on the category (`ui`, `sections`, etc.).
2. Create the `.astro` file in the corresponding `src/components/{category}/` folder.
3. Import and use it in your pages using the `~/components/...` alias.

### Adding Documentation
1. Create an `.mdx` file in a subdirectory of `src/content/docs/` (e.g., `src/content/docs/ui/`).
2. The sidebar will automatically detect the folder and group the page correctly.
3. Set the `order` in frontmatter to control its position within the group.

### Managing Translations
1. Add keys to `src/i18n/locales/en.properties` and `ar.properties`.
2. Access them via the type-safe `t` function in any component.

---

**Built by Gladtek with ❤️ and the help of AI agents**
