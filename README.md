# Cooper - The Ultimate Astro Boilerplate

The advanced, batteries-included template for building blazing-fast modern web applications with **Astro 6.1**, **Tailwind CSS 4.2**, and **React 19**.

<p align="center">
  <img src="https://img.shields.io/github/v/release/gladtek/cooper?color=%231A81FA&label=Latest&logo=%20" alt="Latest Release" />
</p>

| Cloudflare | Netlify | Vercel |
| :--- | :--- | :--- |
| [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GladTek/Cooper) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/GladTek/Cooper) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGladTek%2FCooper) |

## Live Demos

| Platform   | URL                                      |
| :--------- | :--------------------------------------- |
| **Cloudflare** | [https://cooper.gladtek.com/](https://cooper.gladtek.com/) |
| **Netlify**    | [https://astro-cooper.netlify.app/](https://astro-cooper.netlify.app/) |
| **Vercel**     | [https://astro-cooper.vercel.app/](https://astro-cooper.vercel.app/) |

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
The project features a high-performance documentation engine powered by **MDX** and **Fuse.js**:
- **Categorized Sidebar**: Documentation is automatically grouped by folder (e.g., `ui`, `sections`, `layout`).
- **Premium Typography**: Custom-styled prose optimized for readability.
- **Deep Linking**: Automatic anchor links and perfect scroll alignment with a sticky header.

### 3. Type-Safe Internationalization (i18n)
- **Flat File Dictionary**: Localizations are managed via type-safe `.ts` and `.properties` files.
- **RTL Support**: Automatic layout mirroring for languages like Arabic (`/ar/`).
- **Path Persistence**: Switching languages preserves the current page path.

### 4. Robust Testing Suite
The boilerplate includes a pre-configured, production-ready testing infrastructure:
- **E2E Testing (Playwright)**: Automated flows for Form Submissions, Search Indexing, Language Switching, and Responsiveness.
- **Unit/Component Testing (Vitest)**: Fast, reliable testing for core logic and React islands using JSDOM.

---

## Features

### Core Stack
- **Astro 6.1**: The latest version of the web framework for content-driven websites.
- **Tailwind CSS 4.2**: Engine-integrated utility-first CSS using modern CSS variables.
- **React 19**: Powered by React 19 for modern concurrent rendering and optimized hydration.
- **TypeScript 6.0**: 100% type-safe codebase.

### Accessibility & Performance
- **WCAG AA/AAA Compliant**: Accessible color contrast and focus state management.
- **SSR/Hydration Optimized**: Production-grade Vite configuration resolving common hydration conflicts.
- **Core Web Vitals**: Precision optimization for LCP and CLS out of the box.

---

## Getting Started

### Quick Start
Initialize a new project instantly:
```bash
npx @gladtek/launch-cooper@latest
```

### Manual Setup
1. **Install dependencies** (Requires **pnpm 10+**)
   ```bash
   pnpm install
   ```
2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
3. **Start the dev server**
   ```bash
   pnpm run dev
   ```

---

## Testing

Cooper comes with a comprehensive testing suite to ensure stability across deployments.

### End-to-End (E2E)
We use **Playwright** for full browser testing of critical user journeys.
```bash
pnpm run test:e2e        # Run all E2E tests
pnpm run test:e2e:ui     # Open Playwright UI for debugging
```
The suite covers:
- **Contact Flows**: Form validation and submission states.
- **I18n**: Correct language rendering and RTL switching.
- **Search**: Real-time indexing and navigation results.
- **Responsive**: Mobile menu functionality and layout adjustments.

### Unit & Component
We use **Vitest** for fast testing of isolated logic and components.
```bash
pnpm run test:unit       # Run all unit tests
pnpm run test:unit:watch # Watch mode
```

---

## Performance Benchmarks 🚀

Cooper is engineered for speed and accessibility. We enforce these standards via **Lighthouse CI** as a mandatory quality gate for every build:

| Category | Minimum Score | Severity |
| :--- | :---: | :--- |
| ⚡ **Performance** | **90** | `Warn` |
| ♿ **Accessibility** | **95** | `Error` |
| 🛡️ **Best Practices** | **90** | `Error` |
| 🔍 **SEO** | **95** | `Error` |

*Automated audits are performed on the **Homepage** and **Key Blog Content** for every PR to ensure zero performance regression.*

---

## Deployment

The project supports multi-adapter deployment out of the box. Use the corresponding build command:

- **Cloudflare**: `pnpm run build:cloudflare` (Recommended)
- **Vercel**: `pnpm run build:vercel`
- **Netlify**: `pnpm run build:netlify`
- **Node.js**: `pnpm run build` (Default)

---

**Built by Gladtek with ❤️ and the help of AI agents**
