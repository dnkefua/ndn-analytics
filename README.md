# NDN Analytics

Enterprise AI products and blockchain solutions — [ndnanalytics.com](https://www.ndnanalytics.com/)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript (strict), Vite 8 |
| Styling | CSS Modules, Framer Motion |
| Hosting | Firebase Hosting (CDN) |
| Backend | Firebase Cloud Functions (Node 22) |
| Database | Cloud Firestore |
| Auth | Firebase Auth |
| Payments | Stripe Checkout + Webhooks |
| Email | Resend API |
| AI | Anthropic Claude (ARIA chatbot) |
| Analytics | Google Analytics 4, Web Vitals |
| Monitoring | Sentry (error tracking + replay) |
| CI/CD | GitHub Actions → Firebase deploy |

## Project Structure

```
src/
├── components/       # React components by feature
│   ├── hero/         # Homepage hero with animated counters
│   ├── products/     # Product catalog (11 AI/blockchain products)
│   ├── checkout/     # Stripe checkout flow
│   ├── blog/         # Dynamic blog (Firestore-backed)
│   ├── aria/         # ARIA AI chatbot panel
│   ├── seo/          # SEO components (6 JSON-LD schemas)
│   ├── admin/        # Admin dashboard
│   └── ...
├── lib/              # Utilities (analytics, leads, A/B testing)
├── styles/           # Global CSS (variables, typography, animations)
├── test/             # Unit & integration tests (vitest)
└── types/            # TypeScript type definitions
functions/
├── src/
│   ├── aria/         # ARIA chatbot Cloud Function (Anthropic)
│   ├── checkout/     # Stripe session creator + webhook handler
│   ├── scheduled/    # Email queue processor
│   └── utils/        # Rate limiter (Firestore-backed)
e2e/                  # Playwright E2E smoke tests
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Fill in your keys (see .env.example for descriptions)

# 3. Start dev server
npm run dev

# 4. Run tests
npm test

# 5. Build for production
npm run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint (flat config) |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run optimize:images` | Convert images to WebP via Sharp |

## Cloud Functions

```bash
cd functions
npm install

# Lint
npx eslint .

# Set secrets (one-time)
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set ANTHROPIC_API_KEY
firebase functions:secrets:set RESEND_API_KEY
```

## Deployment

Pushes to `main` trigger the **Deploy to Firebase Hosting** workflow:

1. Lint + type check
2. Lint Cloud Functions
3. Unit & integration tests (253+ tests)
4. Build
5. Deploy to Firebase (hosting + functions)

PRs trigger **Preview Deploy** with E2E tests and a temporary Firebase hosting channel (expires in 7 days).

## Security

- **CSP** enforced via `Content-Security-Policy` header (not report-only)
- **HSTS**, **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**
- **Firestore rules** validate all client writes (email format, field limits, rate limiting)
- **Rate limiting** via Firestore-backed counters (persists across cold starts)
- **Secrets** stored in Firebase Secret Manager (never in source)
- **Stripe webhook** signature verification on every event

