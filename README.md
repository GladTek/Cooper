# The Ultimate Astro Boilerplate

The most advanced, batteries-included template for building blazing-fast SaaS, AI tools, and modern web applications with Astro 5, Tailwind CSS 4, and React.

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

## Getting Started

### Quick Start
Initialize a new project instantly with our CLI:
```bash
npx @gladtek/launch-cooper@latest
```

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/gladtek/astro-boilerplate.git
   cd astro-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. **Deploy to Cloudflare**
   ```bash
   npm run deploy
   # or manually
   npx wrangler deploy
   ```

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
