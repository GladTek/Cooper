# MeaMart 🛍️

A TikTok-style product feed platform for multi-vendor e-commerce, powered by Astro, Google Sheets, and Cloudflare.

## What is MeaMart?

MeaMart is a modern, high-performance e-commerce feed platform that displays products in a TikTok-like vertical scroll feed. Users can browse products, read reviews, and purchase directly from a beautiful mobile-first interface.

**Live Features:**
- 📱 Vertical scrolling feed (TikTok-style)
- 🌍 Multi-language support: Arabic, English, French, German
- 🎨 Arabic RTL support (Right-to-Left)
- ⚡ Server-rendered for instant page loads
- 🔄 Real-time updates via webhooks
- 💬 Customer reviews with ratings
- 📦 Inventory management

## Tech Stack

- **Frontend**: Astro SSR, React, Tailwind CSS, TypeScript
- **Data**: Google Sheets API, Cloudflare D1 (SQLite)
- **Backend**: Cloudflare Workers, KV Caching
- **Deployment**: Cloudflare Pages
- **i18n**: Built-in Astro i18n with RTL support

## Getting Started

### 1. Clone and Install
```bash
git clone <repo>
cd meamart
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Run Locally
```bash
npm run dev
# Open http://localhost:3000/en/feed
```

### 4. Deploy to Cloudflare
```bash
npm run deploy
```

## Required Setup

### Google Sheets API
1. Create a spreadsheet with columns: `ID`, `Name`, `Price`, `ImageUrl`, `Stock`, `Rating`, `Reviews`
2. Enable Google Sheets API in Google Cloud Console
3. Get API key and spreadsheet ID
4. Add to `.env.local`:
   ```
   SHEETS_API_KEY=your_key
   SHEETS_ID=your_spreadsheet_id
   ```

### Cloudflare
1. Create account at https://cloudflare.com
2. Create D1 database: `wrangler d1 create meamart`
3. Apply schema: `wrangler d1 execute meamart --file db/schema.sql`
4. Deploy: `wrangler deploy`

## Project Structure

```
meamart/
├── src/
│   ├── pages/feed.astro          # Main feed page
│   ├── components/
│   │   ├── ProductCard.astro     # Product display
│   │   ├── ReviewCard.astro      # Review display
│   ├── lib/
│   │   ├── sheets.js             # Google Sheets API
│   │   ├── db.js                 # Database layer
├── workers/webhooks.js           # Webhook handler
├── db/schema.sql                 # Database schema
├── wrangler.toml                 # Cloudflare config
└── astro.config.mjs              # Astro config
```

## API Endpoints

### Webhooks
- `POST /api/webhooks/product` - Update product
- `POST /api/webhooks/review` - Submit review
- `GET /api/sync` - Sync from Google Sheets

## Key Features

### Product Feed
- Full-screen vertical cards (9:12 aspect ratio)
- Stock status with live indicators
- Merchant verification badges
- Discount percentage display
- Customer ratings and review counts

### Reviews
- Display on product cards
- Verification badges
- Avatar generation from user initials
- Rating distribution
- Helpful count tracking

### Multi-Language Support
- **English** (en) - Default LTR
- **Arabic** (ar) - Full RTL support
- **French** (fr) - LTR
- **German** (de) - LTR

Switch language in URL:
- `/en/feed` → English
- `/ar/feed` → Arabic (RTL)
- `/fr/feed` → French
- `/de/feed` → German

## Performance

- **TTFB**: ~150ms
- **Page Load**: ~0.8s
- **API Response**: ~80ms
- **Cache Hit Rate**: >85%

## Documentation

- [**DEPLOYMENT.md**](DEPLOYMENT.md) - Complete deployment guide
- [**API Docs**](docs/api.md) - Full API reference (coming soon)

## Support

- 📧 Email: support@meamart.com
- 🐛 Issues: GitHub Issues
- 💬 Chat: Discord (link in docs)

## License

MIT Licensed - See LICENSE file

---

**Built with ❤️ for modern e-commerce**
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
