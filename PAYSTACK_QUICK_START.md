# Paystack Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Paystack Keys (2 minutes)

1. Go to https://paystack.com
2. Sign up or log in
3. Click **Settings** > **API Keys & Webhooks**
4. Copy your **Test Public Key** (starts with `pk_test_`)
5. Copy your **Test Secret Key** (starts with `sk_test_`)

### Step 2: Configure Backend (.env) (1 minute)

Create `backend/.env.develop` file (or update if exists):

```bash
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=http://localhost:4200/payment-callback
FRONTEND_URL=http://localhost:4200
CLIENT_URL=http://localhost:4200
```

Replace `xxxxxxxxxxxxx` with your actual keys.

### Step 3: Configure Frontend (1 minute)

Update `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:4000/api",
  apiBaseUrl: "http://localhost:4000/api",
  paystackPublicKey: "pk_test_xxxxxxxxxxxxx",  // Your test key here
  maintenanceMode: false,
  useMockData: false
};
```

### Step 4: Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

### Step 5: Test Payment Flow (5 minutes)

1. Open http://localhost:4200
2. Click **Login** (create account if needed)
3. Go to **Tours** page
4. Click on any tour
5. Click **BOOK NOW**
6. Fill in booking details
7. Click **Pay & Confirm Booking**
8. **Paystack payment page will open**
9. Enter test card: `4084 0840 8408 4081`
10. Any future expiry date (e.g., 12/25)
11. Any CVV (e.g., 123)
12. Any 6-digit OTP (e.g., 123456)
13. Complete payment
14. **Redirected back to payment callback page** ✅
15. See success message with payment details

## 🧪 Test Cards

Use these for testing:

| Type | Card Number | Expiry | CVV | OTP |
|------|------------|--------|-----|-----|
| Test Visa | 4084 0840 8408 4081 | Any future | Any 3 | Any 6 |
| Test Mastercard | 5531 8866 5725 4957 | Any future | Any 3 | Any 6 |

## ❓ Common Issues & Quick Fixes

### "Payment failed to initialize"
- ✅ Verify `PAYSTACK_SECRET_KEY` in `.env.develop`
- ✅ Restart backend (`npm start`)
- ✅ Check internet connection

### "Paystack page won't open"
- ✅ Verify `PAYSTACK_PUBLIC_KEY` in `environment.ts`
- ✅ Check browser console (F12) for errors

### "Payment successful but not updating in bookings"
- ✅ Refresh page (F5)
- ✅ Check backend logs for webhook events
- ✅ Wait 2-3 seconds (webhooks may be async)

### "Still seeing errors?"
- Check the detailed guide: `PAYSTACK_INTEGRATION_COMPLETE.md`
- Review backend logs in terminal
- Check browser console (F12)

## 🎯 What Each Component Does

| Component | Purpose |
|-----------|---------|
| `paystack.js` | Communicates with Paystack API |
| `payments.js` (route) | Handles payment verification & webhooks |
| `bookings.js` (route) | Creates bookings and initializes Paystack |
| `payment-callback.component.ts` | Shows payment result to user |
| `paystack.service.ts` | Angular service for payment operations |

## 📊 Payment Status Tracking

After payment, booking status changes:
- **Payment Pending** → User completes Paystack payment
- **Payment Paid** → Confirmation page shows success
- **Booking Confirmed** → Appears in "My Bookings"

## 💡 Pro Tips

- 🔒 **Never share secret keys** - Keep them in `.env` only
- 🧪 **Always test with test keys first** - Only use live keys in production
- 📧 **Check email** - Confirmation emails sent after payment success
- 📱 **Test on mobile** - Payment redirect works on all devices
- 🔄 **Webhooks optional** - System works with or without webhook setup

## 🚀 Ready to Go Live?

When you're ready for production:

1. Get **live keys** from Paystack
2. Update environment variables with live keys
3. Update frontend to use live public key
4. Deploy to production servers
5. Configure webhook URL in Paystack dashboard

## 📞 Debugging Commands

See logs in real-time:
```bash
# Backend logs
tail -f backend.log

# Check if services are running
lsof -i :4000  # Backend port
lsof -i :4200  # Frontend port
```

---

**You're all set! 🎉 Start booking and processing payments.**
