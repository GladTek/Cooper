# MeaMart - TikTok-Style Product Feed Platform

A high-performance, multi-vendor e-commerce feed platform built with Astro SSR, Google Sheets integration, and Cloudflare infrastructure.

**Key Features:**
- 📱 **TikTok-style vertical scroll feed** - Full-screen product cards with snap scrolling
- 🌍 **Multi-language RTL support** - Arabic, English, French, German with proper RTL layout
- 🚀 **Server-side rendering** - Astro SSR for optimal performance and SEO
- ☁️ **Cloudflare-powered** - Workers, D1 database, KV caching, and global CDN
- 📊 **Google Sheets integration** - Manage products directly from spreadsheets
- ⚡ **Real-time webhooks** - Product updates, reviews, orders via webhook handlers
- 📱 **Mobile-first design** - Optimized for portrait orientation devices
- 🔒 **Security-first** - Input validation, error handling, webhook verification

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Google Cloud account with Sheets API enabled
- Cloudflare account for deployment
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Fill in your configuration
nano .env.local
```

### Environment Setup

Required environment variables:
- `SHEETS_API_KEY` - Google Sheets API key
- `SHEETS_ID` - Google Sheets spreadsheet ID
- `WEBHOOK_SECRET` - Secure string for webhook verification
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_ZONE_ID` - Your Cloudflare zone ID

Optional variables:
- `DEBUG` - Enable detailed logging (default: false)
- `SITE_URL` - Your site's public URL (default: https://meamart.com)

### Local Development

```bash
# Start development server
npm run dev

# Access at http://localhost:3000
# Feed page: http://localhost:3000/en/feed
```

### Building

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

## Architecture

### Frontend (Astro SSR)
- **feed.astro** - Main TikTok feed page with error handling
- **ProductCard.astro** - Full-screen product display with RTL support
- **ReviewCard.astro** - Customer review cards with avatars
- **lib/sheets.js** - Google Sheets API integration with caching
- **lib/db.js** - Unified database abstraction (SQLite/D1)

### Backend (Cloudflare Workers)
- **workers/webhooks.js** - Webhook handler for product/review/order updates
- **wrangler.toml** - Cloudflare configuration with D1 and KV bindings

### API Endpoints
- `POST /api/webhooks/product` - Product update webhooks
- `POST /api/webhooks/review` - Review submission webhooks
- `GET /api/sync` - Manual Google Sheets synchronization

### Database (Cloudflare D1)
- **products** - Product catalog with pricing and inventory
- **merchants** - Vendor information and verification status
- **reviews** - Customer reviews and ratings
- **orders** - Order history and status
- **users** - User profiles and preferences
- **analytics_events** - User behavior tracking

## Data Flow

### Product Data
1. Products stored in Google Sheets
2. `lib/sheets.js` fetches with 5-minute cache
3. Cached in Cloudflare KV for fast access
4. Displayed in TikTok feed with real-time stock status
5. Webhook updates trigger cache invalidation

### Reviews
1. Reviews submitted via webhook to `/api/webhooks/review`
2. Validated (rating 1-5, required fields)
3. Stored in D1 database
4. Displayed on product cards
5. KV cache updated for quick retrieval

### Orders
1. Order webhooks update inventory
2. Stored in D1 with analytics events
3. Merchant verified status updated
4. Real-time order tracking available

## Error Handling

All layers include custom error classes with detailed messages:
- `SheetsError` - Google Sheets API issues
- `DatabaseError` - D1/SQLite failures
- `WebhookError` - Webhook processing errors
- `ValidationError` - Input validation failures

Error responses include:
- Human-readable message
- Machine-readable error code
- HTTP status code
- Timestamp for debugging

## RTL/Arabic Support

The platform fully supports Arabic and other RTL languages:
- Auto-detection: `isRTL = lang === 'ar'`
- Direction attribute applied at component level
- All UI text translated to Arabic
- Proper text alignment and flex direction

Arabic UI text:
- "متوفر" (Available) / "غير متوفر" (Out of stock)
- "تم التحقق" (Verified)
- "عرض التفاصيل" (View Details)
- "مفيد" (Helpful)

## Deployment

### Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Deploy
npm run deploy

# Or use wrangler directly
wrangler deploy
```

### Configure Cloudflare D1

```bash
# Create D1 database
wrangler d1 create meamart

# Apply schema
wrangler d1 execute meamart --file db/schema.sql
```

### Set Environment Variables

In Cloudflare Dashboard:
1. Go to Workers → Settings → Variables
2. Add all required variables from `.env.local`
3. Set `DEBUG=false` for production
4. Configure webhook URL for external services

## Webhook Integration

### Product Updates
```bash
POST https://api.meamart.com/api/webhooks/product
Content-Type: application/json
X-Webhook-Signature: <sha256_signature>

{
  "productId": "prod_123",
  "name": "Product Name",
  "price": 99.99,
  "originalPrice": 149.99,
  "stock": 50,
  "merchantId": "merchant_1",
  "category": "Electronics"
}
```

### Review Submissions
```bash
POST https://api.meamart.com/api/webhooks/review
Content-Type: application/json
X-Webhook-Signature: <sha256_signature>

{
  "productId": "prod_123",
  "userName": "John Doe",
  "comment": "Great product!",
  "rating": 5,
  "verified": true,
  "email": "john@example.com"
}
```

### Manual Sync
```bash
GET https://api.meamart.com/api/sync?token=<SYNC_TOKEN>
```

## Performance

- **TTFB**: <200ms (Cloudflare CDN)
- **Page Load**: <1s (Astro SSR + optimized assets)
- **API Response**: <100ms (D1 database)
- **Cache Hit Rate**: >90% (5-minute TTL)

### Optimization Techniques
- Server-side rendering with Astro
- Cloudflare KV caching (5-minute TTL)
- Image optimization with responsive sizes
- CSS compression with Tailwind purge
- JavaScript minification and tree-shaking

## Monitoring

View real-time logs in Cloudflare Dashboard:
1. Workers → meamart
2. View logs or tail events
3. Filter by status, method, or path

Structured logging in production:
```javascript
console.log('Event:', {
  timestamp: new Date().toISOString(),
  type: 'product.updated',
  productId: 'prod_123',
  duration: '45ms',
});
```

## Security

- Webhook signature verification (HMAC-SHA256)
- Input validation on all endpoints
- Rate limiting on webhook endpoints
- SQL injection prevention via parameterized queries
- CSRF protection via SameSite cookies
- Content Security Policy headers

## Development

### Project Structure
```
meamart/
├── src/
│   ├── pages/
│   │   ├── feed.astro
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   ├── sync.ts
│   ├── components/
│   │   ├── ProductCard.astro
│   │   ├── ReviewCard.astro
│   ├── lib/
│   │   ├── sheets.js
│   │   ├── db.js
├── workers/
│   ├── webhooks.js
├── db/
│   ├── schema.sql
├── wrangler.toml
├── astro.config.mjs
└── tailwind.config.mjs
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

### Building Documentation

```bash
# Generate API docs
npm run docs
```

## Troubleshooting

### Products not loading
1. Check `SHEETS_API_KEY` and `SHEETS_ID` in environment
2. Verify Google Sheets is shared publicly or via service account
3. Check browser console for `SheetsError` details
4. Review KV cache: `wrangler kv:key list --binding=CACHE`

### Reviews not appearing
1. Verify webhook signature header is correct
2. Check D1 database: `wrangler d1 query meamart "SELECT * FROM reviews"`
3. Ensure rating is between 1-5
4. Review webhook logs in Cloudflare Dashboard

### Webhooks failing
1. Verify `WEBHOOK_SECRET` matches sending system
2. Check webhook payload format matches schema
3. Review error response for specific validation issues
4. Check Cloudflare rate limiting: `wrangler d1 query meamart "SELECT * FROM webhook_logs"`

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open pull request with description

## Future Enhancements

- [ ] Google OAuth authentication
- [ ] Shopping cart functionality
- [ ] Payment integration (Stripe/PayPal)
- [ ] Wishlist feature
- [ ] Advanced search and filtering
- [ ] Seller dashboard
- [ ] Admin panel for product management
- [ ] Push notifications for order updates
- [ ] Social sharing features
- [ ] Affiliate marketing system

## License

Licensed under MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open GitHub issue
- Email: support@meamart.com
- Discord: [Community Server](https://discord.gg/meamart)

## Changelog

### v1.0.0 (Initial Release)
- TikTok-style feed implementation
- MultiLanguage RTL support (Arabic, English, French, German)
- Google Sheets integration
- Cloudflare D1 database
- Webhook processing system
- Product cards with ratings and reviews
- Responsive mobile-first design
