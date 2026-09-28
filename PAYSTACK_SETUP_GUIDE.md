# Paystack Integration Guide for TB Tours

## Overview

Paystack is a payment gateway that allows TB Tours to accept payments from customers worldwide. This guide covers the complete setup and implementation of Paystack for the booking system.

---

## Prerequisites

- A Paystack account (free to create at https://paystack.com)
- Test keys for development
- Live keys for production
- Backend server running Node.js/Express
- Frontend running Angular 17+

---

## Step 1: Create a Paystack Account

1. Visit https://paystack.com and sign up for a business account
2. Complete identity verification (required to go live)
3. Once verified, navigate to **Settings > API Keys & Webhooks**
4. Note your **Public Key** and **Secret Key** for both test and live environments

**Test Keys Format:**
- Public Key: `pk_test_xxxxxxxxxxxxx`
- Secret Key: `sk_test_xxxxxxxxxxxxx`

**Live Keys Format:**
- Public Key: `pk_live_xxxxxxxxxxxxx`
- Secret Key: `sk_live_xxxxxxxxxxxxx`

---

## Step 2: Backend Configuration

### 2.1 Environment Variables

Add the following to your `.env` file in the backend root:

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx  # Use test key for development
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=http://localhost:4200/payment-callback
FRONTEND_URL=http://localhost:4200
```

**For Production:**
```bash
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=https://yourdomain.com/payment-callback
FRONTEND_URL=https://yourdomain.com
```

### 2.2 Install Paystack Package

The backend already uses HTTP requests via axios to communicate with Paystack's API. No additional packages are needed.

### 2.3 Backend Files Created

- `backend/src/payments/paystack.js` - Paystack service with API methods
- `backend/src/routes/payments.js` - Payment endpoints

### 2.4 Database Migration

The Booking model has been updated with these new fields:

```javascript
- paymentReference    // Unique reference for tracking
- transactionId       // Paystack transaction ID
- paymentDate         // When payment was completed
- refundAmount        // Amount refunded (if any)
- refundDate          // When refund was processed
- paymentStatus       // ENUM: unpaid, pending, paid, failed, refunded
```

Run database migration if needed:
```bash
cd backend
npm run migrate  # or your migration command
```

---

## Step 3: Frontend Configuration

### 3.1 Update Environment Files

**For Development:** `frontend/src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:4000/api",
  paystackPublicKey: "pk_test_xxxxxxxxxxxxx",
  maintenanceMode: false,
  useMockData: false
};
```

**For Production:** `frontend/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.yourdomain.com/api",
  paystackPublicKey: "pk_live_xxxxxxxxxxxxx",
  maintenanceMode: false,
  useMockData: false
};
```

**For Staging:** `frontend/src/environments/environment.staging.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: "https://api-staging.yourdomain.com/api",
  paystackPublicKey: "pk_test_xxxxxxxxxxxxx",
  maintenanceMode: false,
  useMockData: false
};
```

### 3.2 Frontend Service

A Paystack service has been created at `frontend/src/app/services/paystack.service.ts` with methods for:

- `initializePayment()` - Create a payment transaction
- `verifyPayment()` - Check payment status
- `requestRefund()` - Request a refund
- `handlePayment()` - Open Paystack payment interface

---

## Step 4: Integration in Booking Flow

### 4.1 Backend Payment Endpoints

**POST /api/payments/initialize**
Initiates a payment. Required fields:
```json
{
  "bookingId": 1,
  "email": "customer@example.com",
  "amount": 2500,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+27123456789"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "access_code_xxx",
    "reference": "BK-1-1234567890"
  }
}
```

**GET /api/payments/verify/:reference**
Verifies a completed payment.

Response:
```json
{
  "success": true,
  "data": {
    "reference": "BK-1-1234567890",
    "amount": 2500,
    "status": "success",
    "paidAt": "2024-01-15T10:30:00Z"
  }
}
```

**POST /api/payments/webhook**
Paystack sends payment confirmations here. Must be called with valid Paystack signature.

**POST /api/payments/refund**
Request a refund for a transaction:
```json
{
  "reference": "BK-1-1234567890",
  "amount": 2500
}
```

### 4.2 Frontend Integration Example

In your booking component:

```typescript
import { PaystackService } from '../services/paystack.service';

export class BookingComponent {
  constructor(private paystackService: PaystackService) {}

  onCheckout(bookingData: any) {
    // Initialize payment
    this.paystackService.initializePayment({
      bookingId: bookingData.id,
      email: bookingData.email,
      amount: bookingData.totalPrice,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      phone: bookingData.phone
    }).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirect to Paystack checkout
          this.paystackService.handlePayment(
            response.data!.authorization_url
          );
        }
      },
      error: (error) => console.error('Payment initialization failed', error)
    });
  }

  // Called after returning from Paystack
  verifyPayment() {
    const reference = this.paystackService.extractReferenceFromUrl();
    if (reference) {
      this.paystackService.verifyPayment(reference).subscribe({
        next: (response) => {
          if (response.success && response.data?.status === 'success') {
            // Payment successful - redirect to confirmation page
            this.router.navigate(['/booking-confirmation']);
          } else {
            // Payment failed
            alert('Payment verification failed');
          }
        },
        error: (error) => console.error('Payment verification error', error)
      });
    }
  }
}
```

---

## Step 5: Webhook Setup (Important!)

### 5.1 Configure Webhook in Paystack Dashboard

1. Log in to https://dashboard.paystack.com
2. Go to **Settings > Webhooks**
3. Add a webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events: **Charge Successful**, **Charge Failed**
5. Copy the webhook signing secret (if provided)

### 5.2 Webhook Events

Paystack will POST to your webhook endpoint when:

- **charge.success** - Payment completed successfully
- **charge.failed** - Payment failed
- **charge.pending** - Payment is pending

Your backend automatically updates booking and user records based on these webhooks.

---

## Step 6: Testing

### 6.1 Test Paystack Credentials

When using test keys, use these test card numbers:

**Successful Payment:**
- Card Number: `4084084084084081`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)

**Failed Payment:**
- Card Number: `5555555555554444`
- Expiry: Any future date
- CVV: Any 3 digits

### 6.2 Test Email Verification

When a test card completes, you'll be prompted for a test OTP. Use any 6-digit number.

### 6.3 Testing Workflow

1. Create a booking in the UI
2. Click "Proceed to Payment"
3. You'll be redirected to Paystack checkout
4. Enter test card details
5. Complete the payment
6. You should be redirected back to your callback URL
7. Verify the booking status changed to "paid"

---

## Step 7: Production Deployment

### 7.1 Pre-Production Checklist

- [ ] Replace test keys with live keys in `.env`
- [ ] Update frontend environment configs
- [ ] Test webhook endpoint is accessible from internet
- [ ] Verify HTTPS is enabled for all endpoints
- [ ] Test with real test transactions
- [ ] Set up proper error handling and logging
- [ ] Configure email notifications for payment confirmations

### 7.2 Go Live with Paystack

1. Verify your business details with Paystack
2. Pass identity verification
3. Switch from test to live keys
4. Test with a small real transaction
5. Monitor webhooks for issues

### 7.3 SSL/HTTPS

Paystack requires HTTPS in production. Ensure:
- Your backend API has valid SSL certificate
- Frontend is served over HTTPS
- Webhook endpoint is accessible via HTTPS

---

## Troubleshooting

### Payment Initialization Fails
- Check `PAYSTACK_SECRET_KEY` is set correctly
- Verify backend environment variables are loaded
- Check network requests in browser console

### Webhook Not Processing
- Verify webhook URL is publicly accessible
- Check backend logs for webhook requests
- Ensure request body is being parsed as JSON

### Payment Shows as Pending
- Wait a few seconds for webhook to process
- Check backend logs for webhook errors
- Verify database connection is working

### Refund Issues
- Refunds must be initiated from Paystack dashboard
- Your `/api/payments/refund` endpoint logs requests for manual processing
- Implement automated refund processing as needed

---

## Security Considerations

1. **Secret Key Protection**
   - Never commit `PAYSTACK_SECRET_KEY` to version control
   - Use environment variables in production
   - Rotate keys periodically

2. **Webhook Signature Verification**
   - Backend verifies all webhook signatures automatically
   - Never trust webhook data without verification

3. **HTTPS Enforcement**
   - All payment endpoints must use HTTPS in production
   - Use SSL certificates from trusted providers

4. **Data Privacy**
   - Don't store full credit card information
   - Paystack handles PCI compliance
   - Store only transaction references and IDs

---

## Useful Links

- Paystack Documentation: https://paystack.com/docs
- API Reference: https://paystack.com/docs/api/
- Dashboard: https://dashboard.paystack.com
- Test Credentials: https://paystack.com/docs/payments/test-authentication/
- Status Page: https://status.paystack.com

---

## Support

For issues with Paystack integration:
1. Check server logs: `backend/logs/` or console output
2. Check Paystack dashboard for transaction status
3. Verify webhook delivery in Paystack dashboard
4. Contact Paystack support: support@paystack.com

For issues with TB Tours implementation:
1. Review the code in `backend/src/payments/paystack.js`
2. Check frontend service in `frontend/src/app/services/paystack.service.ts`
3. Ensure all environment variables are set
4. Check database migrations are applied

---

## Next Steps

1. ✅ Update pricing in data files
2. ✅ Set up Paystack service and routes
3. ✅ Configure environment variables
4. ⏭️ Integrate payment UI in booking component
5. ⏭️ Test with test credentials
6. ⏭️ Set up webhook monitoring
7. ⏭️ Deploy to production
