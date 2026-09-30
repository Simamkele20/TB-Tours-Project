# Paystack Integration Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Angular 17+)                             │
│                         http://localhost:4200                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐        ┌──────────────────┐                       │
│  │  Booking Page      │        │  Payment Callback│                       │
│  │  Component         │───────→│  Component       │                       │
│  │                    │        │                  │                       │
│  │ - Tour Info        │        │ - Verify Payment │                       │
│  │ - Booking Form     │        │ - Show Status    │                       │
│  │ - User Details     │        │ - Navigate       │                       │
│  │ - Submit to API    │        │                  │                       │
│  └────────────────────┘        └──────────────────┘                       │
│           │                              ▲                                │
│           │                              │                                │
│  ┌────────▼────────────────┐    ┌───────┴─────────────┐                 │
│  │ Paystack Service        │    │ HTTP Client         │                 │
│  │                         │    │                     │                 │
│  │ - initializePayment()   │    │ GET /payments/verify│                 │
│  │ - verifyPayment()       │    │                     │                 │
│  │ - requestRefund()       │    └─────────────────────┘                 │
│  └─────────────────────────┘                                             │
│                                                                              │
└──────┬───────────────────────────────────────────────────┬──────────────────┘
       │                                                    │
       │  Environment Config                              │ API Calls
       │  - paystackPublicKey                             │ - POST /api/bookings
       │  - apiUrl                                        │ - GET /api/payments/verify/:ref
       │                                                   │
       ▼                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PAYSTACK PAYMENT GATEWAY                               │
│                   https://checkout.paystack.com                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  Paystack Checkout Page                                      │          │
│  │  - Card Entry                                                │          │
│  │  - 3D Secure (if needed)                                     │          │
│  │  - OTP Verification                                          │          │
│  │  - Payment Processing                                        │          │
│  └──────────────────┬───────────────────────────────────────────┘          │
│                     │                                                       │
│                     │ Redirect with reference parameter                    │
│                     └─────────────────────────────────────────────────────┐ │
│                                                                         ◄──┴─┘
│                                                                              │
│  Post-Payment Webhooks (Optional for real-time updates):                   │
│  - charge.success                                                           │
│  - charge.failed                                                            │
│  - charge.dispute.create                                                   │
│                                                                              │
└──────────────────────────┬───────────────────────────────────────────────────┘
                           │
                           │ Redirect back to Frontend
                           │ /payment-callback?reference=XXXX
                           │
       ┌───────────────────┴────────────────┐
       │                                    │
       ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Node.js/Express)                         │
│                         http://localhost:4000                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  Routes (src/routes/)                                        │          │
│  │                                                              │          │
│  │  bookings.js:                                               │          │
│  │  - POST /api/bookings                                       │          │
│  │    └→ Create booking record                                │          │
│  │    └→ Call Paystack Initialize                            │          │
│  │    └→ Return authorization_url                            │          │
│  │                                                              │          │
│  │  payments.js:                                               │          │
│  │  - GET /api/payments/verify/:reference                     │          │
│  │    └→ Call Paystack Verify                                │          │
│  │    └→ Update booking payment status                        │          │
│  │                                                              │          │
│  │  - POST /api/payments/webhook                              │          │
│  │    └→ Handle Paystack events                               │          │
│  │    └→ Verify webhook signature                            │          │
│  │    └→ Update booking status                               │          │
│  │                                                              │          │
│  └──────────────────────────────────────────────────────────────┘          │
│           │                                     │                          │
│           │                                     │                          │
│  ┌────────▼──────────────────┐    ┌───────────▼────────────┐              │
│  │  Paystack Service Module   │    │  Booking Model         │              │
│  │  (src/payments/paystack.js)│    │  (src/models/Booking.js)             │
│  │                            │    │                        │              │
│  │  - initializePayment()     │    │  Fields:               │              │
│  │  - verifyPayment()         │    │  - id                  │              │
│  │  - getOrCreateCustomer()   │    │  - bookingReference    │              │
│  │  - chargeAuthorization()   │    │  - paymentReference    │              │
│  │  - verifyWebhookSignature()│    │  - transactionId       │              │
│  │                            │    │  - paymentStatus       │              │
│  │  HTTP Calls:               │    │  - paymentDate         │              │
│  │  - POST /transaction/init  │    │  - refundAmount        │              │
│  │  - GET  /transaction/verify│    │  - refundDate          │              │
│  │  - POST /customer          │    │                        │              │
│  │  - POST /transaction/charge│    │  Relationships:        │              │
│  │                            │    │  - belongsTo User      │              │
│  │                            │    │  - belongsTo Tour      │              │
│  │                            │    │                        │              │
│  └────────┬───────────────────┘    └────────────┬───────────┘              │
│           │                                     │                          │
│           │ API Calls                          │ Database                 │
│           │ https://api.paystack.co            │ Queries                  │
│           │                                     │                          │
│           └────────────────┬────────────────────┘                         │
│                            │                                              │
│  Environment Config (src/config/env.js):                                 │
│  - PAYSTACK_SECRET_KEY                                                   │
│  - PAYSTACK_PUBLIC_KEY                                                   │
│  - FRONTEND_URL (for callback)                                           │
│  - Client URLs (CORS whitelist)                                          │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐          │
│  │  Database (MySQL)                                          │          │
│  │                                                            │          │
│  │  Bookings Table:                                          │          │
│  │  ├─ id                                                    │          │
│  │  ├─ userId                                               │          │
│  │  ├─ tourId                                               │          │
│  │  ├─ bookingReference                                     │          │
│  │  ├─ paymentReference (Paystack ref)                      │          │
│  │  ├─ transactionId (Paystack transaction ID)              │          │
│  │  ├─ paymentStatus: 'unpaid'|'pending'|'paid'|'failed'    │          │
│  │  ├─ paymentDate                                          │          │
│  │  ├─ refundAmount                                         │          │
│  │  ├─ refundDate                                           │          │
│  │  └─ status: 'pending'|'confirmed'|'completed'|'cancelled'│          │
│  │                                                            │          │
│  │  Users Table:                                            │          │
│  │  ├─ id                                                    │          │
│  │  ├─ email                                                │          │
│  │  ├─ firstName                                            │          │
│  │  ├─ lastName                                             │          │
│  │  └─ phone                                                │          │
│  │                                                            │          │
│  └────────────────────────────────────────────────────────────┘          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Complete Payment Flow - Detailed Timeline

```
TIME    ACTOR               ACTION                          RESULT
────────────────────────────────────────────────────────────────────────────────
T+0     User (Frontend)     Fills booking form               Form fields populated
        │
        └─→ POST /api/bookings
            ├─ tourId, tourDate, passengers
            └─ Authentication Token

T+1     Backend             1. Validates booking data
        (bookings.js)       2. Creates Booking record
                            3. Generates bookingReference
                            4. Sets payment_status = 'pending'

T+2     Backend             Calls Paystack API:
        (paystack.js)       POST /transaction/initialize
                            ├─ amount (in kobo)
                            ├─ email
                            ├─ metadata (booking details)
                            └─ callback_url (payment-callback)

T+3     Paystack            Returns:
        (API Response)      ├─ authorization_url
                            ├─ access_code
                            └─ reference

T+4     Backend             Saves reference to booking
        (bookings.js)       ├─ bookingReference → paystackReference
                            └─ Returns response with authorization_url

T+5     Frontend            window.location.href = authorization_url
        (Browser)           │
                            └─→ Redirects to Paystack Checkout

T+6     User                Enters payment details:
        (Paystack)          ├─ Card number
                            ├─ Expiry
                            ├─ CVV
                            └─ OTP

T+7     Paystack            1. Validates card
        (Payment Gateway)   2. Processes payment
                            3. Returns to callback_url with reference param

T+8     Frontend            Paystack redirects to:
        (Browser)           /payment-callback?reference=XXXX&status=success

T+9     Frontend            PaymentCallbackComponent loads
        (Component)         └─→ Extracts reference from query params

T+10    Frontend            GET /api/payments/verify/REFERENCE
        (Service)           

T+11    Backend             1. Calls Paystack API:
        (payments.js)          GET /transaction/verify/REFERENCE
                            2. Gets transaction details
                            3. Checks transaction.status

T+12    Paystack            Returns:
        (API Response)      ├─ reference
                            ├─ amount
                            ├─ status ('success' or 'failed')
                            ├─ customer info
                            └─ paid_at

T+13    Backend             If status === 'success':
        (Database)          ├─ Update Booking:
                            │  ├─ payment_status = 'paid'
                            │  ├─ transactionId = transaction.reference
                            │  ├─ paymentDate = transaction.paid_at
                            │  └─ status = 'confirmed'
                            └─ Send confirmation email

T+14    Frontend            Show payment result:
        (Component)         If success:
                            ├─ ✓ Success message
                            ├─ Payment details table
                            └─ Buttons: "My Bookings" / "Home"
                            
                            If failed:
                            ├─ ✗ Error message
                            └─ Buttons: "Retry" / "Home"

T+15    User                Views booking confirmation
                            ├─ Tour details
                            ├─ Payment receipt
                            └─ Booking reference

T+16    Email               Confirmation email sent:
        (Background)        ├─ To: user.email
                            ├─ Booking details
                            ├─ Payment confirmation
                            └─ Tour information

────────────────────────────────────────────────────────────────────────────────
TOTAL FLOW TIME: ~5-30 seconds (depending on payment processing)
```

## Key Components & Their Responsibilities

### 1. Frontend Components

**BookingPageComponent** (`booking-page.component.ts`)
- Displays tour information
- Collects booking details
- Validates form input
- Calls POST /api/bookings
- Redirects to Paystack authorization URL

**PaymentCallbackComponent** (`payment-callback.component.ts`) ⭐ NEW
- Receives redirect from Paystack
- Extracts reference parameter
- Verifies payment with backend
- Displays payment status
- Navigates to My Bookings on success

### 2. Backend Routes

**bookings.js**
- `POST /api/bookings` - Creates booking + initializes payment
  - Validates tour and passenger count
  - Creates database record
  - Calls Paystack initialize
  - Returns authorization URL

**payments.js**
- `GET /api/payments/verify/:reference` - Verifies payment
  - Calls Paystack verify API
  - Updates booking status
  - Returns payment details
  
- `POST /api/payments/webhook` - Handles Paystack webhooks
  - Verifies webhook signature
  - Processes charge.success events
  - Processes charge.failed events

### 3. Services

**PaystackService** (Angular)
- Loads Paystack script
- Detects test mode
- Initializes payments
- Verifies payments
- Handles refunds

**paystack.js** (Node.js)
- Manages Paystack API client
- Payment initialization
- Payment verification
- Customer management
- Webhook verification

### 4. Models

**Booking** Model
- Stores booking details
- Tracks payment status
- Records payment reference
- Manages refund information

## Data Flow Examples

### Successful Payment Flow
```
Booking Form ──→ Backend (Create Booking) ──→ Paystack Init
    ↓
Authorization URL ──→ User Payment ──→ Paystack Verification
    ↓
Callback Component ──→ Verify Payment ──→ Update DB
    ↓
Success Page ──→ My Bookings Updated ──→ Email Sent
```

### Failed Payment Flow
```
User Cancels ──→ Paystack Redirect (cancelled status)
    ↓
Callback Component (Detect cancelled) ──→ Show Retry Option
    ↓
User Retries ──→ Backend Creates New Booking
```

## Security Measures Implemented

1. ✅ Secret keys in backend `.env` only (not exposed to frontend)
2. ✅ Webhook signature verification (ensures requests from Paystack)
3. ✅ User authentication required for payments
4. ✅ Booking ownership verification (users can only verify their own bookings)
5. ✅ CORS protection (whitelist allowed origins)
6. ✅ HTTPS recommended for production
7. ✅ Input validation on all payment endpoints

## Performance Considerations

- **Frontend Bundle**: Paystack script loaded asynchronously
- **Database Queries**: Indexed on bookingId, paystackReference
- **API Calls**: Async/await patterns used throughout
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Webhook Processing**: Non-blocking, asynchronous handling

---

**Integration Complete! All components working together seamlessly.**
