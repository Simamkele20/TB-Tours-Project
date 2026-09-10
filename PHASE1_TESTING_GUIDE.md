# Phase 1: Authentication System - Testing Guide

## Prerequisites

### 1. Database Setup
This project uses **MySQL** with **Sequelize ORM** (not MongoDB).

- **Local:** Install MySQL Community Server from [mysql.com](https://www.mysql.com/downloads/)
- **Cloud:** Use MySQL on AWS RDS, DigitalOcean, or similar cloud provider
- Create a database: `tb_tours`

### 2. Role Assignment Policy

Roles are automatically assigned based on email domain during registration:

| Email Domain | Assigned Role | Description |
|---|---|---|
| `@tb-tours.co.za` | `admin` | Full admin access with dashboard view |
| `@tbtours.test` | Manual (testing) | Testing domain - role assigned for test scenarios |
| Any other domain | `customer` | Limited access to bookings and tours |

**Management Access:** Only the authorized manager email (`princetancu06@gmail.com`) can access management features, regardless of role.

### 3. Environment Configuration

**Backend (.env)**
Create or update `backend/.env`:
```env
PORT=4000
NODE_ENV=development
CLIENT_URLS=http://localhost:4200
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tb_tours
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=24h
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
CONTACT_TO_EMAIL=info@tb-tours.co.za
```

**Frontend (src/environments/environment.ts)**
Already configured:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:4000/api',
  useMockData: true,
  paystackPublicKey: 'pk_test_placeholder_replace_with_actual_key'
};
```

### 3. Email Setup (Optional for Testing)
- Use Gmail SMTP for easy local testing
- Enable "Less secure app access" or create an App Password
- Copy credentials to `SMTP_USER` and `SMTP_PASS` in `.env`

## Test Credentials

> **⚠️ IMPORTANT:** These are test accounts for development. DO NOT use in production.

### 1️⃣ Manager Account (Full Admin Access)
- **Email:** `princetancu06@gmail.com`
- **Password:** `Prince123!!`
- **Role:** admin
- **Name:** Prince Tancu
- **Access:** 
  - ✅ Admin Dashboard (Analytics, Users, Bookings)
  - ✅ Management (User management, Booking management, Tour management)
- **Status:** Verified ✓

### 2️⃣ Admin Dashboard User (Limited Admin)
- **Email:** `admin@gmail.com`
- **Password:** `Admin!!12`
- **Role:** admin
- **Name:** Test User
- **Access:** 
  - ✅ Admin Dashboard (View-only analytics, stats)
  - ❌ Management (User/Booking management blocked)
- **Status:** Verified ✓

### 3️⃣ Customer User
- **Email:** `testing@gmail.com`
- **Password:** `Testing!!12`
- **Role:** customer
- **Name:** Test Customer
- **Access:** 
  - ✅ My Bookings, Tours, Contact
  - ❌ Admin Dashboard (blocked)
- **Status:** Verified ✓

## Running Phase 1

### Terminal 1: Backend
```bash
cd backend
npm install  # First time only
npm run dev  # Uses nodemon for auto-reload
# Server starts on http://localhost:4000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install  # First time only
npm start    # or ng serve
# App runs on http://localhost:4200
```

## Test Cases

### Test 1: Manager Login (Full Access)

1. Navigate to `http://localhost:4200/auth/login`
2. Enter email: `princetancu06@gmail.com`
3. Enter password: `Prince123!!`
4. Click "Login"
5. ✅ Expected: User dropdown shows:
   - Admin Dashboard
   - Management (THIS IS THE KEY TEST - should be visible)
6. Click "Admin Dashboard"
7. ✅ Expected: Analytics dashboard loads with stats, charts, user management
8. Click "Management"
9. ✅ Expected: Management console loads with user management, booking management, tour management

---

### Test 2: Admin Dashboard Only Login

1. Navigate to `http://localhost:4200/auth/login`
2. Enter email: `admin@gmail.com`
3. Enter password: `Admin!!12`
4. Click "Login"
5. ✅ Expected: User dropdown shows:
   - Admin Dashboard
   - **Management should NOT be visible** (CRITICAL TEST)
6. Click "Admin Dashboard"
7. ✅ Expected: Analytics dashboard loads (view-only)
8. Try accessing `http://localhost:4200/admin/management` directly
9. ✅ Expected: Redirected back to `/admin` (access denied)

---

### Test 3: Customer Login (No Admin Access)

1. Navigate to `http://localhost:4200/auth/login`
2. Enter email: `testing@gmail.com`
3. Enter password: `Testing!!12`
4. Click "Login"
5. ✅ Expected: User dropdown shows:
   - My Bookings
   - **No Admin Dashboard or Management menus**
6. Try accessing `http://localhost:4200/admin` directly
7. ✅ Expected: Redirected to home page

---

### Test 4: Access Control Restrictions

#### 4a: Management API Endpoint Protection
```bash
# Login as admin@gmail.com (will get token)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Admin!!12"}'

# Try accessing management endpoint with admin@gmail.com token
curl -X GET http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# ✅ Expected: Error 403 "Management access required"
```

#### 4b: Dashboard API Endpoint (Allowed for All Admins)
```bash
# Same token from above
curl -X GET http://localhost:4000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# ✅ Expected: Returns analytics data (200 OK)
```

---

### Test 5: Token Persistence

1. Login as any user
2. Refresh the page (`Ctrl+R` or `Cmd+R`)
3. ✅ Expected: User menu still shows (token persisted in localStorage)
4. Open DevTools → Application → Local Storage
5. ✅ Expected: `auth_token` key contains JWT

---

### Test 6: Protected Routes

1. Logout
2. Try accessing `http://localhost:4200/admin`
3. ✅ Expected: Redirected to `/auth/login` with returnUrl
4. Login as manager account
5. ✅ Expected: Allowed access to admin dashboard

---

## API Testing with cURL

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "princetancu06@gmail.com",
    "password": "Prince123!!"
  }'
```

### Get Analytics (All Admins)
```bash
curl -X GET http://localhost:4000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Users (Management Only)
```bash
curl -X GET http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# If token is from admin@gmail.com:
# ✅ Expected: Error 403 "Management access required"

# If token is from princetancu06@gmail.com:
# ✅ Expected: Returns user list (200 OK)
```

### Get Bookings (Management Only)
```bash
curl -X GET http://localhost:4000/api/admin/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Same restriction as above applies
```

---

## Troubleshooting Checklist

- [ ] MySQL running and accessible
- [ ] Database `tb_tours` created
- [ ] `.env` file configured with DB credentials
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend builds without errors (`npm start`)
- [ ] Browser can access `http://localhost:4200`
- [ ] Manager login works with full access
- [ ] Admin login works but blocks Management
- [ ] Customer login works with no admin access
- [ ] Token persists in localStorage
- [ ] Logout clears token
- [ ] Protected endpoints return 401 without token
- [ ] Management endpoints return 403 for non-manager admins

---

## Access Control Matrix

| Feature | Manager (princetancu06@gmail.com) | Admin (admin@gmail.com) | Customer (testing@gmail.com) |
|---------|----------------------------------|------------------------|------------------------------|
| Admin Dashboard | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |
| Management | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Booking Management | ✅ | ❌ | ❌ |
| Tour Management | ✅ | ❌ | ❌ |
| My Bookings | ✅ | ❌ | ✅ |
| Contact Form | ✅ | ✅ | ✅ |

---

## Debugging

### Backend Issues

**"Cannot connect to MySQL"**
- Ensure MySQL is running: `mysql -u root -p` should connect
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Verify database `tb_tours` exists

**"Admin access denied"**
- Check user email is exactly `princetancu06@gmail.com` (case-insensitive)
- Verify user role is `admin` in database
- Check JWT token is valid and not expired

**Token errors**
- Clear browser localStorage: DevTools → Application → Local Storage → Clear All
- Delete auth_token key and login again

### Frontend Issues

**"Cannot connect to backend"**
- Check backend is running on `http://localhost:4000`
- Check CORS configuration in `backend/src/server.js`
- Browser console should show error details

**"Admin menu not showing"**
- Check if logged-in user role is `admin` (not `customer`)
- Open DevTools Console → `localStorage.getItem('auth_token')`
- Decode JWT at https://jwt.io to verify role field

---

## Next Steps

Once Phase 1 is fully tested:
1. **Phase 2**: Booking Management (view, create, cancel bookings)
2. **Phase 3**: Payment Integration (Paystack/Stripe)
3. **Phase 4**: Advanced Features (tour analytics, reporting)

