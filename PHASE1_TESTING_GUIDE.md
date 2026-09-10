# Phase 1: Authentication System - Testing Guide

## Prerequisites

### 1. MongoDB Setup
Install MongoDB locally or use MongoDB Atlas (cloud):
- **Local:** `brew install mongodb-community` (macOS) or download from [mongodb.com](https://www.mongodb.com)
- **Atlas:** Sign up at https://www.mongodb.com/cloud/atlas (free tier available)

### 2. Environment Configuration

**Backend (.env.develop)**
Create `backend/.env.develop`:
```
PORT=4000
NODE_ENV=development
CLIENT_URLS=http://localhost:4200
MONGODB_URI=mongodb://localhost:27017/tb-tours
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=24h
VERIFICATION_CODE_EXPIRY=900000
SMTP_PASS=your-mailgun-api-key
CONTACT_TO_EMAIL=info@tb-tours.co.za
```

**Frontend (.env)**
Already configured in `frontend/src/environments/environment.ts`:
```typescript
apiBaseUrl: 'http://localhost:4000/api'
```

### 3. Mailgun Setup (Optional for Email Testing)
- Sign up at https://mailgun.com
- Get API key from dashboard
- Add authorized recipients in sandbox domain settings for testing
- Copy API key to `SMTP_PASS` in `.env.develop`

## Running Phase 1

### Terminal 1: Backend
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
# Server starts on http://localhost:4000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start  # or ng serve
# App runs on http://localhost:4200
```

## Test Cases

### Test 1: User Registration with Auto-Admin Detection

**Test 1a: Regular Customer Account**
1. Navigate to `http://localhost:4200/auth/register`
2. Enter email: `customer@example.com`
3. Enter password: `TestPassword123` (min 8 chars)
4. Click "Create Account"
5. ✅ Expected: Form submitted, move to Step 2 (verification code input)
6. Check terminal/console for verification code (printed to server logs)
7. Enter the 6-digit code
8. ✅ Expected: Redirected to login page with success message

**Test 1b: Admin Auto-Detection (tb-tours.co.za domain)**
1. Register with email: `admin-test@tb-tours.co.za`
2. Complete verification flow
3. After login, check navbar for "Admin Dashboard" link
4. ✅ Expected: Admin menu item appears in user dropdown

**Test 1c: Admin Auto-Detection (Specific Email)**
1. Register with email: `princetancu06@gmail.com`
2. Complete verification flow
3. After login, check user menu
4. ✅ Expected: "Admin Dashboard" link present

---

### Test 2: Email Verification Flow

1. Register with any email
2. Check server logs or Mailgun dashboard for verification email
3. ✅ Expected: Email contains 6-digit code
4. Try entering wrong code
5. ✅ Expected: Error message "Invalid verification code"
6. Try entering correct code multiple times
7. ✅ Expected: Success after correct code

---

### Test 3: Login Flow

1. After successful registration, navigate to `/auth/login`
2. Enter registered email and password
3. Click "Login"
4. ✅ Expected: Redirected to home page, user menu shows in navbar
5. Try logging in with wrong password
6. ✅ Expected: Error message "Invalid email or password"
7. Try logging in with unverified email (if using MongoDB seed data)
8. ✅ Expected: Error message "Email not verified. Please verify your email before logging in"

---

### Test 4: Password Reset Flow

1. On login page, click "Forgot your password?"
2. Enter email address
3. Click "Send Reset Code"
4. ✅ Expected: Success message "If the email exists, a password reset code has been sent"
5. Check server logs/Mailgun for reset code email
6. Enter the 6-digit code from email
7. Click "Verify Code"
8. ✅ Expected: Move to Step 3 (password reset form)
9. Enter new password and confirm
10. Click "Reset Password"
11. ✅ Expected: Success message, redirected to login page after 2 seconds
12. Login with new password
13. ✅ Expected: Should succeed with new password, fail with old password

---

### Test 5: Token Persistence

1. Login successfully
2. Refresh the page (`Ctrl+R` or `Cmd+R`)
3. ✅ Expected: User menu still shows (token persisted in localStorage)
4. Close browser tab and reopen
5. Navigate to `http://localhost:4200`
6. ✅ Expected: User menu still shows (token restored from localStorage)

---

### Test 6: Protected Routes

1. Logout (click Logout in user menu)
2. Try accessing a future protected route: `http://localhost:4200/bookings` (will exist in Phase 3)
3. ✅ Expected: Redirected to `/auth/login` with `returnUrl=/bookings`
4. Login successfully
5. ✅ Expected: Redirected back to `/bookings` (once it's created in Phase 3)

---

### Test 7: Admin-Only Routes

1. Login as non-admin customer account
2. Try accessing admin route (once created): `http://localhost:4200/admin`
3. ✅ Expected: Redirected to home page
4. Login as admin account (created in Test 1b or 1c)
5. Try accessing `/admin`
6. ✅ Expected: Admin pages load successfully

---

### Test 8: HTTP Interceptor (Token Injection)

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Login successfully
4. Make a request to protected endpoint (manually in DevTools console):
   ```javascript
   fetch('http://localhost:4000/api/auth/me', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') }
   }).then(r => r.json()).then(console.log)
   ```
5. ✅ Expected: Returns current user data
6. Try without Authorization header:
   ```javascript
   fetch('http://localhost:4000/api/auth/me').then(r => r.json()).then(console.log)
   ```
7. ✅ Expected: Returns 401 error "Missing or invalid authorization header"

---

## Debugging

### Backend Issues

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Check `MONGODB_URI` in `.env.develop` is correct format

**"Mailgun not configured"**
- Email sending will fail silently if `SMTP_PASS` is not set
- To test without email: Generate code manually and test verification endpoint with Postman

**JWT token errors**
- Clear browser localStorage: DevTools → Application → Local Storage → Clear All
- Regenerate token by logging in again

### Frontend Issues

**"Cannot connect to backend"**
- Check backend is running on `http://localhost:4000`
- Check CORS configuration in `backend/src/server.js`
- Browser console should show error details

**"Token not being sent"**
- Check localStorage has `auth_token` key: DevTools → Application → Local Storage
- Check Network tab in DevTools to verify Authorization header is present
- Verify auth interceptor is registered in `app.config.ts`

---

## API Testing with Postman/cURL

### Register Endpoint
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "confirmPassword": "TestPassword123"
  }'
```

### Verify Email Endpoint
```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

### Login Endpoint
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Protected Endpoint (Get Current User)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Forgot Password
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:4000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "newPassword": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'
```

---

## Troubleshooting Checklist

- [ ] MongoDB running and accessible
- [ ] `.env.develop` file created with required variables
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend builds without errors (`npm start`)
- [ ] Browser can access `http://localhost:4200`
- [ ] Can navigate to `/auth/register`
- [ ] Form validation works (email format, password length)
- [ ] User can complete registration and verification
- [ ] User can login after verification
- [ ] User menu shows after login
- [ ] Token persists in localStorage
- [ ] Logout clears token
- [ ] Can request password reset
- [ ] Admin detection works for recognized emails
- [ ] Protected endpoints return 401 without token

---

## Next Steps

Once Phase 1 is fully tested:
1. **Phase 2**: Admin Dashboard (user management, stats)
2. **Phase 3**: Booking Management (create, view, cancel bookings)
3. **Phase 4**: Payment Gateway Integration (Stripe/PayPal)

