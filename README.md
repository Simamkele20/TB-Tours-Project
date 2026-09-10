# TB Tours (Pty)Ltd - Angular + Node.js

Professional transport and tour booking web app for TB Tours (Pty)Ltd.

## Stack

- **Node.js**: 26.4.0 (requires >=22)
- **Angular**: 17+ (standalone components)
- **Express**: 5.2.1
- **MySQL**: with Sequelize ORM
- **TypeScript**: strict mode
- **SMTP**: Email notifications

## Project Structure

```
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── models/      # Sequelize models (User, Booking, Tour, etc.)
│   │   ├── routes/      # API routes (auth, admin, bookings)
│   │   ├── auth/        # JWT, password hashing
│   │   ├── email/       # Email templates
│   │   └── server.js    # Express app setup
│   └── package.json
├── frontend/            # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/   # Feature components
│   │   │   ├── services/ # API services
│   │   │   ├── guards/  # Route guards (auth, admin)
│   │   │   └── app.ts   # Root component
│   │   └── main.ts
│   └── package.json
└── Images/             # Design references
```

## Features

- **Authentication**: JWT-based login/register with email verification
- **Role-Based Access**: Customer, Admin (dashboard only), Manager (full admin)
- **Admin Dashboard**: View analytics, user management, booking management
- **Management Console**: Full admin controls (users, bookings, tours) - manager only
- **Domain-Based Roles**: Users registering with @tb-tours.co.za automatically get admin role
- **Booking System**: View and manage tour bookings
- **Responsive Design**: Mobile-first dark/gold theme
- **Currency**: South African Rand (ZAR)

## Test Credentials

### Manager Account (Full Admin Access)
```
Email: princetancu06@gmail.com
Password: Prince123!!
Access: Admin Dashboard + Management Console
```

### Admin Dashboard User (View-Only Admin)
```
Email: admin@gmail.com
Password: Admin!!12
Access: Admin Dashboard only (no management)
```

### Customer User
```
Email: testing@gmail.com
Password: Testing!!12
Access: My Bookings, Tours, Contact
```

⚠️ **DO NOT use these credentials in production**

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Configure Backend

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
CLIENT_URLS=http://localhost:4200

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tb_tours

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h

# Email (Gmail SMTP recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_TO_EMAIL=info@tb-tours.co.za
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Runs on http://localhost:4200
```

## Frontend Environments

Development and production configurations:

```typescript
// frontend/src/environments/environment.ts (dev)
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:4000/api",
  useMockData: true
};

// frontend/src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiBaseUrl: "https://your-backend-domain.com/api",
  useMockData: false
};
```

## Access Control

### Frontend Routes
| Route | Admin | Manager | Customer |
|-------|-------|---------|----------|
| `/admin` (Dashboard) | ✅ | ✅ | ❌ |
| `/admin/management` | ❌ | ✅ | ❌ |
| `/admin/tours` | ❌ | ✅ | ❌ |
| `/my-bookings` | ❌ | ❌ | ✅ |

### Backend API
| Endpoint | Admin | Manager | Customer |
|----------|-------|---------|----------|
| `GET /api/admin/analytics` | ✅ | ✅ | ❌ |
| `GET /api/admin/users` | ❌ | ✅ | ❌ |
| `PUT /api/admin/users/:id` | ❌ | ✅ | ❌ |
| `GET /api/bookings` | ❌ | ❌ | ✅ |

**Note:** Management features (users, bookings, tours) are ONLY accessible to `princetancu06@gmail.com`

## Role Assignment Policy

### Automatic Role Assignment Based on Email Domain

When users register, their role is automatically assigned based on their email domain:

- **@tb-tours.co.za** → `admin` role (full dashboard access)
- **@tbtours.test** → Testing domain (role set manually for testing)
- **Any other domain** → `customer` role (limited access)

### Management Access

Within the `admin` role, only the authorized manager email has access to management features:
- **Manager Email**: `princetancu06@gmail.com`
- **Access**: Full management console (users, bookings, tours management)
- **Other Admins**: Dashboard view-only (analytics, statistics)

**Example:**
```
User A: alice@tb-tours.co.za → Registered as admin (dashboard access)
User B: bob@gmail.com → Registered as customer (limited access)
User C: princetancu06@gmail.com → Registered as admin + manager (full access)
```

## GitHub Strategy

- `main` branch: Production environment
- Deploy backend to Render
- Deploy frontend to Vercel

## Deployment

### Backend on Render

Configure `render.yaml` service with environment variables:

```env
CLIENT_URLS=https://your-domain.com
DB_HOST=your-mysql-host
DB_USER=production_user
DB_PASSWORD=secure_password
DB_NAME=tb_tours_prod
JWT_SECRET=production_secret_key
SMTP_USER=production_email@gmail.com
SMTP_PASS=production_app_password
CONTACT_TO_EMAIL=support@tb-tours.co.za
```

### Frontend on Vercel

Vercel automatically deploys on push to `main` branch.

Configure:
- Build: `npm run build`
- Output: `dist/frontend/browser`

## Testing

Run the comprehensive testing guide:

See [PHASE1_TESTING_GUIDE.md](./PHASE1_TESTING_GUIDE.md) for:
- Setup instructions
- Test cases with expected results
- Access control matrix
- API testing examples
- Troubleshooting guide

## Key Files

- **Authentication**: `backend/src/routes/auth.js`
- **Admin Routes**: `backend/src/routes/admin.js`
- **Auth Guard**: `frontend/src/app/guards/admin.guard.ts`
- **Auth Service**: `frontend/src/app/services/auth.service.ts`
- **Admin Dashboard**: `frontend/src/app/pages/admin/admin-dashboard.component.ts`

## Coding Standards

### Frontend (Angular 17+)
- Standalone components (no shared modules)
- RxJS for reactive state
- Strict TypeScript (no `any` types)
- Lazy-loaded feature routes
- Responsive design with SCSS

### Backend (Express)
- Modular route handlers
- Consistent error handling
- Input validation on all endpoints
- Service-layer pattern
- Sequelize ORM for database

## Support

For issues or questions, check:
1. [PHASE1_TESTING_GUIDE.md](./PHASE1_TESTING_GUIDE.md) - Troubleshooting section
2. Backend logs: `npm run dev` output
3. Frontend console: Browser DevTools → Console tab

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
