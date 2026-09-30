# Production Database Setup Guide

## Overview
This guide covers cleaning the production database and setting up admin users.

## Scripts Available

### 1. **setup-production.js** (Recommended)
Complete production setup that:
- Cleans all test data (bookings, tours, destinations)
- Sets `princetancu06@gmail.com` as admin
- Sets all users with `@tb-tours.co.za` email domain as admin
- Provides a summary of admin users

**Usage:**
```bash
cd backend
node setup-production.js
```

**Requires:** `.env.production` file with database connection details

### 2. **clean-test-data.js**
Cleans only test data without modifying admin roles.

**Usage:**
```bash
cd backend
node clean-test-data.js
```

### 3. **set-admin.js**
Sets a single user as admin.

**Usage:**
```bash
cd backend
node set-admin.js [email]
# Example:
node set-admin.js princetancu06@gmail.com
```

## Admin Users Configuration

### Current Admin Settings:
- **Primary Manager:** `princetancu06@gmail.com` (Prince Tancu)
  - Full access to management features
  - Can access: Admin Dashboard, Management Panel, User Management, Booking Management, Tour Management

- **Company Domain:** `@tb-tours.co.za`
  - All staff members with this email domain get admin access
  - Examples: `staff@tb-tours.co.za`, `admin@tb-tours.co.za`

## Database Cleanup Details

The production setup removes:
- ✓ All bookings
- ✓ All tours
- ✓ All destinations
- ✓ Keeps user data (for admin/manager access)

## Post-Setup Verification

After running the setup, verify:

1. **Check current database state:**
   ```bash
   cd backend
   node -e "
   require('dotenv').config({ path: '.env.production' });
   const { sequelize } = require('./src/db/connect');
   (async () => {
     await sequelize.authenticate();
     const User = sequelize.models.User;
     const users = await User.findAll();
     console.log('Users:', users.map(u => ({ email: u.email, role: u.role })));
     process.exit(0);
   })();
   "
   ```

2. **Verify admin access in frontend:**
   - Login with `princetancu06@gmail.com`
   - Check for "Admin Dashboard" option in user menu
   - Verify access to management features

3. **Test tb-tours.co.za domain:**
   - Create a test user with `@tb-tours.co.za` email
   - Verify admin access is granted

## Important Notes

- ⚠️ Production setup is **destructive** - it removes all test bookings, tours, and destinations
- Always backup your database before running cleanup
- The `.env.production` file must be correctly configured with production database credentials
- Admin roles are NOT automatically reverted if needed - use `set-admin.js` to manage individual roles

## Troubleshooting

### Issue: "User not found" for princetancu06@gmail.com
**Solution:** The user must be registered first. Run the registration flow or create the user manually.

### Issue: tb-tours.co.za users not getting admin role
**Solution:** Verify:
- Users are registered with correct email domain
- Database connection is working (check `.env.production`)
- Run the script again or use `set-admin.js` for individual users

### Issue: Script fails to connect to database
**Solution:**
- Check `.env.production` exists and has correct credentials
- Verify database is running and accessible
- Check file permissions in the backend directory
