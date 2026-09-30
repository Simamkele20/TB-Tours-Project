# Paystack Integration Setup Guide for TB Tours

This guide provides step-by-step instructions to complete the Paystack payment integration for TB Tours.

## ✅ What's Already Implemented

1. **Backend Paystack Service** - Full API integration with payment initialization and verification
2. **Payment Routes** - Endpoints for payment initialization, verification, and webhook handling
3. **Database Models** - Booking model updated with payment-related fields
4. **Frontend Paystack Service** - Angular service for payment operations
5. **Booking Form** - Redirects to Paystack for payment processing
6. **Payment Callback Component** - NEW - Handles post-payment verification
7. **Callback Route** - NEW - Route for payment-callback page

## 🔧 Step 1: Configure Environment Variables

### Backend Configuration

Create or update `.env.develop` in the `backend/` directory:

```bash
# Paystack Configuration (Test Keys)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=http://localhost:4200/payment-callback
FRONTEND_URL=http://localhost:4200
CLIENT_URL=http://localhost:4200

# For Production, use:
# PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
# PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
# PAYSTACK_CALLBACK_URL=https://yourdomain.com/payment-callback
# FRONTEND_URL=https://yourdomain.com
```

**Get your Paystack keys:**
1. Visit https://paystack.com and sign up
2. Go to Settings > API Keys & Webhooks
3. Copy your test keys (start with `pk_test_` and `sk_test_`)
4. For production, use live keys (start with `pk_live_` and `sk_live_`)

### Frontend Configuration

Update `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:4000/api",
  apiBaseUrl: "http://localhost:4000/api",
  paystackPublicKey: "pk_test_xxxxxxxxxxxxx",  // Your test public key
  maintenanceMode: false,
  useMockData: false
};
```

Update `frontend/src/environments/environment.prod.ts` for production:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.tb-tours.co.za/api",
  apiBaseUrl: "https://api.tb-tours.co.za/api",
  paystackPublicKey: "pk_live_xxxxxxxxxxxxx",  // Your live public key
  maintenanceMode: false,
  useMockData: false
};
```

## 🧪 Step 2: Test the Integration

### Option A: Test with Mock Payments (For Development)

Set this in your `.env.develop`:
```bash
USE_MOCK_PAYMENT=true
```

This allows testing without actual Paystack calls. Mock payment links will be generated.

### Option B: Test with Real Paystack Test Keys

**Test Card Details:**
- Card Number: `4084 0840 8408 4081`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- OTP: Any 6 digits (e.g., 123456)

### Test Flow

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Open browser:**
   ```
   http://localhost:4200
   ```

4. **Test booking flow:**
   - Log in or register
   - Navigate to Tours page
   - Click on a tour
   - Complete booking form
   - Click "Pay & Confirm Booking"
   - You'll be redirected to Paystack
   - Enter test card details
   - Complete payment
   - You'll be redirected back to payment-callback
   - Payment status will be verified automatically

## 🔐 Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   User Books a Tour                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Frontend: Booking form submitted                          │
│    └─> POST /api/bookings                                   │
├─────────────────────────────────────────────────────────────┤
│ 2. Backend: Create booking + Initialize Paystack payment    │
│    └─> Paystack API: /transaction/initialize                │
│        Returns: authorization_url                           │
├─────────────────────────────────────────────────────────────┤
│ 3. Frontend: Redirect to Paystack payment page              │
│    └─> User enters card details                             │
├─────────────────────────────────────────────────────────────┤
│ 4. Paystack: Process payment                                │
│    └─> Redirect back to:                                    │
│        /payment-callback?reference=TRANSACTION_REFERENCE    │
├─────────────────────────────────────────────────────────────┤
│ 5. Frontend: Payment Callback Component                      │
│    └─> GET /api/payments/verify/REFERENCE                   │
├─────────────────────────────────────────────────────────────┤
│ 6. Backend: Verify payment + Update booking status          │
│    └─> Payment Status: "paid" or "failed"                   │
├─────────────────────────────────────────────────────────────┤
│ 7. Frontend: Show success/failure message                   │
│    └─> Redirect to My Bookings or Home                      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 API Endpoints

### Payment Endpoints

#### 1. Initialize Payment (Called internally by booking)
```
POST /api/bookings
Body: {
  tourId: number,
  tourDate: string,
  numberOfPassengers: number,
  specialRequests?: string,
  accommodationPreferences?: string,
  passengerDetails?: array
}

Response:
{
  data: {
    booking: { id, bookingReference, ... },
    paystackAuthorizationUrl: "https://checkout.paystack.com/...",
    paystackReference: "reference_string"
  }
}
```

#### 2. Verify Payment
```
GET /api/payments/verify/{reference}

Response (Success):
{
  success: true,
  data: {
    reference: "reference_string",
    amount: 25000,
    status: "success",
    paidAt: "2024-09-28T10:30:00Z"
  }
}

Response (Failed):
{
  success: false,
  error: "Payment verification failed"
}
```

#### 3. Payment Webhook (Paystack → Backend)
```
POST /api/payments/webhook
Headers:
  x-paystack-signature: (webhook signature)

Events handled:
- charge.success: Payment successful
- charge.failed: Payment failed
```

#### 4. Request Refund
```
POST /api/payments/refund
Body: {
  reference: "reference_string",
  amount: number
}
```

## 🛡️ Security Considerations

1. **Secret Keys**: Never expose `PAYSTACK_SECRET_KEY` on frontend. Keep it only in backend `.env`
2. **CORS**: Ensure frontend origin is whitelisted in server.js
3. **Webhook Signature**: Paystack webhooks are signed and verified on backend
4. **HTTPS**: Always use HTTPS in production
5. **Environment**: Test with test keys first before going live

## 📧 Email Configuration

After successful payment, booking confirmation emails should be sent automatically:
- Make sure `SMTP_PASS` (Mailgun API key) is configured in `.env`
- Confirmation emails include booking details and payment receipt

## 🐛 Troubleshooting

### Issue: "Failed to initialize payment"
**Solution:**
- Verify `PAYSTACK_SECRET_KEY` is correct
- Check internet connection
- Ensure Paystack service is accessible
- Check backend logs for detailed error

### Issue: "Payment verification failed"
**Solution:**
- Verify payment reference is correct
- Check if Paystack transaction is successful
- Ensure backend can reach Paystack API
- Check backend logs

### Issue: "Payment not appearing in My Bookings"
**Solution:**
- Refresh browser (payments may take a moment to sync)
- Check if payment verification webhook was called
- Verify booking was created with correct booking ID
- Check database booking records

### Issue: "CORS error when accessing payment endpoint"
**Solution:**
- Ensure frontend URL is in `allowedOrigins` in server.js
- Verify `CLIENT_URLS` env variable includes your frontend URL
- Restart backend after changing env variables

### Issue: "Paystack test mode warning not showing"
**Solution:**
- Check browser console (F12 -> Console tab)
- Verify `paystackPublicKey` in environment.ts starts with `pk_test_`
- Clear browser cache if needed

## 🔄 Webhook Setup (For Production)

To handle payments in real-time:

1. Log in to Paystack dashboard
2. Go to Settings > API Keys & Webhooks
3. Add webhook URL:
   ```
   https://yourdomain.com/api/payments/webhook
   ```
4. Events to subscribe:
   - charge.success
   - charge.failed
5. Test webhook delivery (Paystack provides test button)

## 📊 Database Fields Added to Booking

The `Booking` model now includes:
- `paymentReference` - Unique payment reference
- `transactionId` - Paystack transaction ID
- `paymentDate` - Payment completion date
- `refundAmount` - Amount refunded (if any)
- `refundDate` - Refund processing date
- `paymentStatus` - ENUM: 'unpaid', 'pending', 'paid', 'failed', 'refunded'

## ✨ Next Steps

1. ✅ Set environment variables with your Paystack keys
2. ✅ Test with mock payments or test keys
3. ✅ Complete a full booking payment flow
4. ✅ Verify payment appears in My Bookings
5. ✅ Check confirmation email is received
6. ✅ Set up production keys when ready to go live
7. ✅ Configure webhook in Paystack dashboard

## 📞 Support

For issues or questions:
- Check Paystack documentation: https://paystack.com/docs/api/
- Review backend logs: `npm run dev` and check console output
- Check browser console: F12 -> Console tab
- Contact support: support@tb-tours.co.za

## 📝 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can log in successfully
- [ ] Can access booking page
- [ ] Can fill in booking form
- [ ] Paystack payment modal opens/redirect works
- [ ] Can complete test payment
- [ ] Redirected back to payment-callback page
- [ ] Payment status shows "success"
- [ ] Booking appears in "My Bookings"
- [ ] Confirmation email received
- [ ] Payment details show in booking

---

**Last Updated:** September 28, 2024
**Status:** Production Ready ✅
