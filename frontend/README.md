# TB Tours Frontend

Angular 17+ standalone components application for TB Tours booking system.

## Architecture

- **Angular 17+**: Standalone components, strict TypeScript
- **RxJS**: Reactive programming with Observables
- **Routing**: Lazy-loaded feature modules
- **State**: Signals for reactive state management
- **Styling**: SCSS with responsive design
- **Guards**: Auth and admin access control

## Development Setup

### Install Dependencies
```bash
npm install
```

### Environment Configuration
```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:4000/api',
  useMockData: true,
  paystackPublicKey: 'pk_test_...'
};
```

### Start Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

## Features

### Authentication
- Register / Login with email verification
- JWT token management
- Persistent session (localStorage)
- Logout with token cleanup

### Authorization
- Customer role: View bookings, contact support
- Admin role: View admin dashboard
- Manager role (`princetancu06@gmail.com`): Full management access

### Pages
- **Home**: Landing page with tour highlights
- **Tours**: Browse available tours
- **Booking**: Book tours with date selection
- **My Bookings**: View and manage customer bookings
- **Admin Dashboard**: Analytics and statistics (admin only)
- **Management**: User/booking/tour management (manager only)
- **Contact**: Submit support requests

### Services
- **AuthService**: Authentication and token management
- **AuthInterceptor**: Automatic JWT injection
- **BookingService**: Booking API calls
- **SeoService**: Meta tags and SEO
- **PageDataService**: Page-specific content

### Guards
- **AuthGuard**: Protects authenticated routes
- **AdminGuard**: Restricts admin routes to authorized users

## File Structure

```
src/
├── app/
│   ├── app.ts                    # Root component
│   ├── app.routes.ts             # Route definitions
│   ├── app.config.ts             # App configuration
│   ├── pages/
│   │   ├── admin/               # Admin dashboard
│   │   ├── auth/                # Login, register
│   │   ├── booking/             # Booking pages
│   │   ├── tours/               # Tour listing
│   │   └── ...
│   ├── services/
│   │   ├── auth.service.ts       # Auth API and state
│   │   ├── booking-api.service.ts # Booking API
│   │   ├── auth.interceptor.ts   # Token injection
│   │   └── ...
│   ├── guards/
│   │   ├── auth.guard.ts         # Auth protection
│   │   └── admin.guard.ts        # Admin protection
│   └── shared/
│       ├── components/           # Reusable components
│       └── directives/           # Custom directives
├── environments/                 # Config per environment
└── main.ts                       # Bootstrap
```

## Build

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

Output: `dist/frontend/browser/`

## Testing

### Unit Tests
```bash
ng test
```

### Test Credentials (Development)

| User | Email | Password | Role |
|------|-------|----------|------|
| Manager | princetancu06@gmail.com | Prince123!! | admin (full) |
| Admin | admin@gmail.com | Admin!!12 | admin (dashboard only) |
| Customer | testing@gmail.com | Testing!!12 | customer |

## Key Components

### Admin Dashboard Component
- Analytics and statistics
- User management table
- Booking management table
- Date range filtering

### Authentication Components
- Login with email/password
- Register with verification
- Password reset flow
- Email verification step

### Booking Components
- Browse available tours
- Select dates and passengers
- View booking details
- Manage bookings

## Styling

- **Colors**: Gold (#D4AF37) and Dark theme
- **Typography**: Professional sans-serif
- **Breakpoints**: Mobile-first responsive design
- **Icons**: Bootstrap Icons (bi-*)

SCSS files:
- `styles.scss`: Global styles
- `styles-redesign.scss`: Redesigned theme
- Component-level: `.component.scss`

## API Integration

Backend API: `http://localhost:4000/api`

### Authentication Endpoints
- `POST /auth/register` - Create account
- `POST /auth/login` - Sign in
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Reset password request
- `POST /auth/reset-password` - Complete reset

### Admin Endpoints
- `GET /admin/analytics` - Dashboard analytics (all admins)
- `GET /admin/users` - User management (manager only)
- `GET /admin/bookings` - Booking management (manager only)
- `PUT /admin/users/:id` - Update user (manager only)
- `DELETE /admin/users/:id` - Delete user (manager only)

### Booking Endpoints
- `GET /bookings` - Customer's bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

## Role Assignment

Roles are automatically assigned based on email domain:

| Email Domain | Role | Description |
|---|---|---|
| `@tb-tours.co.za` | `admin` | Dashboard access with analytics |
| `@tbtours.test` | Manual | Testing domain (test-specific roles) |
| Other domains | `customer` | Limited access to bookings and tours |

**Note:** Management features require additional authorization beyond just the admin role. Only `princetancu06@gmail.com` can access management (user/booking/tour management).

## Access Control Matrix

| Route | Customer | Admin | Manager |
|-------|----------|-------|---------|
| `/` | ✅ | ✅ | ✅ |
| `/auth/*` | ✅ | ✅ | ✅ |
| `/tours` | ✅ | ✅ | ✅ |
| `/my-bookings` | ✅ | ❌ | ❌ |
| `/admin` | ❌ | ✅ | ✅ |
| `/admin/management` | ❌ | ❌ | ✅ |

## Mock Data

Development uses mock data (Signals) instead of API calls:

```typescript
// frontend/src/environments/environment.ts
useMockData: true
```

Mock data includes:
- MOCK_USERS: Test user accounts
- MOCK_TOURS: Available tours with pricing (ZAR)
- MOCK_BOOKINGS: Sample bookings for analytics
- MOCK_BOOKINGS_ANALYTICS: Calculated from bookings

## Debugging

### Browser DevTools
1. **Console**: Check for errors and logs
2. **Network**: Monitor API calls
3. **Application**: View localStorage (auth_token)
4. **Lighthouse**: Performance and accessibility

### Common Issues

**"Cannot connect to backend"**
- Check backend is running: `npm --prefix backend run dev`
- Verify `apiBaseUrl` in environment config
- Check CORS settings in backend

**"Not authorized"**
- Check token in localStorage: `localStorage.getItem('auth_token')`
- Decode at https://jwt.io to verify payload
- Verify user role matches route requirements

**"API returns 403 Forbidden"**
- Management endpoints require `princetancu06@gmail.com`
- Check email is exactly correct (case-insensitive)
- Verify user role is `admin` in database

## Performance

### Optimization
- Lazy loading feature routes
- OnPush change detection
- RxJS unsubscribe management
- Tree-shaking unused code

### Bundle Size
```bash
ng build --stats-json
webpack-bundle-analyzer dist/frontend/browser/stats.json
```

## Deployment

### Vercel
Automatically deploys from `main` branch.

Configuration:
- Build: `npm run build`
- Output: `dist/frontend/browser`

### Environment Variables
Set in Vercel dashboard:
```
ANGULAR_API_BASE_URL=https://api.tb-tours.co.za
```

Update `environment.prod.ts` to use:
```typescript
apiBaseUrl: process.env['NG_APP_API_BASE_URL'] || 'https://api.tb-tours.co.za'
```

## Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Guide](https://rxjs.dev/guide/overview)
- [Testing Guide](../../PHASE1_TESTING_GUIDE.md)
- [Main README](../../README.md)

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
