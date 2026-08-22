# TB Tours - Angular + Node.js

Professional transport and tour booking web app for TB Tours.

## Stack (latest at setup time)

- Node.js: 26.4.0 (project requires >=22)
- Angular: 22.x
- Angular CLI: 22.1.5
- Express: 5.2.1
- Stripe: 22.5.0

## Project structure

- frontend: Angular app
- backend: Node.js/Express API
- Images: source wireframes and design references

## Features

- Responsive multi-page website (Home, About, Services, Tours, Fleet, Contact)
- Wireframe-aligned dark/gold brand styling
- Online booking form with validation
- Booking API endpoint
- Stripe Checkout session endpoint
- Unified dev command for frontend + backend

## Run locally

1. Install dependencies:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

2. Configure backend environment:

```bash
copy backend\.env.example backend\.env
```

3. Add your real values in backend/.env:

```env
CLIENT_URLS=http://localhost:4200
STRIPE_SECRET_KEY=sk_test_your_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

4. Start full stack:

```bash
npm run dev
```

- Frontend: http://localhost:4200
- Backend: http://localhost:4000

## Frontend environments

- `frontend/src/environments/environment.ts` (development)
- `frontend/src/environments/environment.prod.ts` (production)

The booking and contact API calls now use `environment.apiBaseUrl`.

Set your production backend URL in:

```ts
// frontend/src/environments/environment.prod.ts
apiBaseUrl: "https://your-render-backend.onrender.com/api"
```

## GitHub branch strategy (dev + production)

- `develop` branch: staging/dev environment
- `main` branch: production environment

Suggested flow:

```bash
git checkout -b develop
git push -u origin develop
git checkout main
git push -u origin main
```

## Backend on Render (Web Service)

This repo includes `render.yaml` with two services:

- `tb-tours-api-dev` from branch `develop`
- `tb-tours-api-prod` from branch `main`

In Render, set environment variables for each service:

- `CLIENT_URLS` (comma-separated allowed origins)
- `STRIPE_SECRET_KEY`
- `STRIPE_CURRENCY=zar`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `CONTACT_TO_EMAIL`

Example:

```env
CLIENT_URLS=https://tb-tours-dev.netlify.app,https://tb-tours.netlify.app
```

## Frontend on Netlify

This repo includes `netlify.toml` configured for Angular SPA:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist/frontend/browser`
- SPA redirect is included.

Create two Netlify sites:

- Dev site from branch `develop`
- Production site from branch `main`

After Render deploys, update `environment.prod.ts` and (optionally) `environment.ts` if your dev frontend uses hosted backend.

## Frontend on Vercel (alternative)

If you use Vercel instead of Netlify:

- Set Root Directory to `frontend`
- Framework Preset: Angular
- Build command: `npm run build`
- Output directory: `dist/frontend/browser`

`frontend/vercel.json` includes SPA rewrites.

## API endpoints

- GET /api/health
- GET /api/services
- POST /api/bookings
- GET /api/bookings
- POST /api/payments/checkout-session
