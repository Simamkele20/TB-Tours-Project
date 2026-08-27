# TB Tours (Pty)Ltd - Angular + Node.js

Professional transport and tour booking web app for TB Tours (Pty)Ltd.

## Stack (latest at setup time)

- Node.js: 26.4.0 (project requires >=22)
- Angular: 22.x
- Angular CLI: 22.1.5
- Express: 5.2.1
- SMTP email quote workflow

## Project structure

- frontend: Angular app
- backend: Node.js/Express API
- Images: source wireframes and design references

## Features

- Responsive multi-page website (Home, About, Services, Tours, Fleet, Contact)
- Wireframe-aligned dark/gold brand styling
- Contact/quote form with validation
- Contact API endpoint for quote requests
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

The contact API calls use `environment.apiBaseUrl`.

Set your production backend URL in:

```ts
// frontend/src/environments/environment.prod.ts
apiBaseUrl: "https://your-render-backend.onrender.com/api"
```

## GitHub branch strategy (production)

- `main` branch: production environment

## Backend on Render (Web Service)

This repo includes `render.yaml` with one production service:

- `tb-tours-api-prod` from branch `main`

In Render, set environment variables for each service:

- `CLIENT_URLS` (comma-separated allowed origins)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `CONTACT_TO_EMAIL`

Example:

```env
CLIENT_URLS=https://tb-tours.co.za,https://www.tb-tours.co.za
```

## Frontend on Vercel

This repo is configured for Vercel deployment.

- Production branch: `main`
- Development/testing branch: `develop`
- Production build command: `npm run build:prod`
- Preview/develop build command: `npm run build:staging`
- Output directory: `frontend/dist/frontend/browser`

`vercel.json` handles SPA rewrites and environment-based build selection.

After Render deploys, update `environment.prod.ts` with your production backend URL.

## API endpoints

- GET /api/health
- GET /api/services
- POST /api/contact
- GET /api/contact
