# Paystack Integration - Testing Checklist

**Date:** September 28, 2024  
**Test Keys Configured:** ✅ YES

## Pre-Testing Verification

- [x] Backend `.env.develop` has PAYSTACK_SECRET_KEY
- [x] Backend `.env.develop` has PAYSTACK_PUBLIC_KEY  
- [x] Frontend environment.ts has paystackPublicKey
- [x] FRONTEND_URL set to http://localhost:4200
- [x] USE_MOCK_PAYMENT set to true (for testing without real API calls)

## Testing Steps

### Phase 1: Environment & Startup

- [ ] **Step 1.1:** Open terminal and navigate to backend
  ```bash
  cd backend
  ```

- [ ] **Step 1.2:** Start backend server
  ```bash
  npm start
  ```
  **Expected:** "TB Tours API is running on port 4000"

- [ ] **Step 1.3:** Open new terminal, navigate to frontend
  ```bash
  cd frontend
  ```

- [ ] **Step 1.4:** Start frontend application
  ```bash
  npm start
  ```
  **Expected:** Browser opens to http://localhost:4200

- [ ] **Step 1.5:** Check browser console (F12)
  **Expected:** No critical errors, Paystack warning if test mode

### Phase 2: Authentication

- [ ] **Step 2.1:** Click **Login** on homepage

- [ ] **Step 2.2:** Register new account
  - Email: `test@example.com`
  - Password: `TestPassword123!`
  - First Name: `Test`
  - Last Name: `User`
  **Expected:** Registration succeeds or login works

- [ ] **Step 2.3:** Verify logged in
  **Expected:** Navigation shows user is authenticated

### Phase 3: Booking Flow

- [ ] **Step 3.1:** Navigate to **Tours** page
  **Expected:** Tours list displays with pricing

- [ ] **Step 3.2:** Click on any tour
  **Expected:** Tour detail page loads

- [ ] **Step 3.3:** Click **BOOK NOW** or similar button
  **Expected:** Booking form displays

### Phase 4: Booking Form

- [ ] **Step 4.1:** Fill in booking form:
  - **Tour Date:** Select a future date
  - **Number of Passengers:** Enter 1-4
  - **Special Requests:** (optional) "Test booking"
  - **Accommodation:** (optional) "Standard room"
  
  **Expected:** Form validates and allows submission

- [ ] **Step 4.2:** Click **Pay & Confirm Booking**
  **Expected:** Button shows "Redirecting to Paystack..."

### Phase 5: Payment Processing

- [ ] **Step 5.1:** Payment initialization (backend)
  **Expected:** Backend creates booking record
  - Check backend console: `[BOOKING] Booking created: XXX`

- [ ] **Step 5.2:** Paystack modal/redirect appears
  **Expected:** See payment form or mock payment page

- [ ] **Step 5.3:** Enter test payment details
  - **Card Number:** 4084 0840 8408 4081
  - **Expiry:** 12/25 (or any future date)
  - **CVV:** 123 (or any 3 digits)
  - **OTP:** 123456 (or any 6 digits)

- [ ] **Step 5.4:** Complete payment
  **Expected:** Page shows "Processing..." temporarily

### Phase 6: Payment Verification (THE KEY TEST)

- [ ] **Step 6.1:** Redirected to payment callback page
  **Expected:** See one of these states:
  - ✅ "Payment Successful!" with green checkmark
  - ❌ "Payment Failed" with error message
  - ⊘ "Payment Cancelled" if user cancelled

- [ ] **Step 6.2:** Verify payment details display
  **Expected:** See:
  - Reference number
  - Amount (R...)
  - Status ("success")
  - Payment date/time

- [ ] **Step 6.3:** Check backend verification
  **Expected:** Backend console shows:
  ```
  ✅ Payment verification response: success
  ```

### Phase 7: Booking Confirmation

- [ ] **Step 7.1:** Click **View My Bookings**
  **Expected:** Redirected to My Bookings page

- [ ] **Step 7.2:** Find the booking just created
  **Expected:** 
  - Booking appears in list
  - Status shows "Confirmed" or "Paid"
  - Tour details display
  - Payment amount shown

- [ ] **Step 7.3:** Click on booking for details
  **Expected:** Full booking details page with:
  - Booking reference
  - Payment reference
  - Payment status: "paid"
  - Payment date

### Phase 8: Database Verification

- [ ] **Step 8.1:** Connect to MySQL database
  ```bash
  mysql -u tbtoursuser -p pdfsyzbe_tbtours
  # Password: TBtours!!12
  ```

- [ ] **Step 8.2:** Query bookings table
  ```sql
  SELECT bookingReference, paymentStatus, paymentDate, transactionId 
  FROM bookings 
  ORDER BY createdAt DESC LIMIT 1;
  ```
  **Expected:** Latest booking shows:
  - paymentStatus: "paid"
  - paymentDate: (filled with timestamp)
  - transactionId: (filled with transaction reference)

### Phase 9: Email Verification (Optional)

- [ ] **Step 9.1:** Check email for confirmation
  **Expected:** Email received from tours@sandbox...mailgun.org with:
  - Booking confirmation
  - Payment details
  - Tour information

## Common Issues During Testing

### Issue 1: "Payment failed to initialize"
- ✅ Check backend logs for errors
- ✅ Verify PAYSTACK_SECRET_KEY is correct
- ✅ Check internet connection
- ✅ Verify backend server is running

### Issue 2: "Payment callback not showing"
- ✅ Check browser URL (should be http://localhost:4200/payment-callback?reference=...)
- ✅ Check browser console for errors (F12)
- ✅ Wait a few seconds for backend verification
- ✅ Verify FRONTEND_URL in backend .env

### Issue 3: "Booking not appearing in My Bookings"
- ✅ Refresh page (F5)
- ✅ Check backend logs for database errors
- ✅ Verify payment verification was successful
- ✅ Check database directly

### Issue 4: "Mock payment showing but backend verification fails"
- ✅ Check if USE_MOCK_PAYMENT=true in .env
- ✅ Verify PAYSTACK_SECRET_KEY is set
- ✅ Check backend logs for "verifyPayment" calls
- ✅ Restart backend if recently changed .env

## Success Criteria

✅ **Test is SUCCESSFUL if all these pass:**

1. ✅ Can log in/register
2. ✅ Can view tours and bookings
3. ✅ Can fill and submit booking form
4. ✅ Redirects to Paystack (or mock)
5. ✅ Can complete payment
6. ✅ Callback page shows and verifies payment
7. ✅ Booking appears in My Bookings with "paid" status
8. ✅ Database shows payment_status = "paid"
9. ✅ No critical errors in backend console
10. ✅ No critical errors in browser console (F12)

## Testing Summary Report

After completing all tests, fill out:

```
Date Tested: _______________
Tester: _______________

Phase 1 (Startup): ✅ ❌
Phase 2 (Auth): ✅ ❌
Phase 3 (Booking): ✅ ❌
Phase 4 (Form): ✅ ❌
Phase 5 (Payment): ✅ ❌
Phase 6 (Callback): ✅ ❌
Phase 7 (Confirmation): ✅ ❌
Phase 8 (Database): ✅ ❌
Phase 9 (Email): ✅ ❌ N/A

Overall Status: ✅ READY FOR PRODUCTION
                ❌ NEEDS FIXES

Issues Found: _______________
_____________________________
_____________________________

Notes:
_____________________________
_____________________________
```

## Next Steps After Testing

### If All Tests Pass ✅
1. Celebrate! 🎉
2. Ready for production deployment
3. When going live, get LIVE Paystack keys
4. Update environment with live keys
5. Configure webhook in Paystack dashboard
6. Deploy to production

### If Tests Fail ❌
1. Check specific phase that failed
2. Review corresponding troubleshooting section
3. Check backend logs for error messages
4. Verify all environment variables are set
5. Restart backend and try again
6. See PAYSTACK_INTEGRATION_COMPLETE.md for detailed debugging

## Performance Metrics to Check

During testing, monitor:

- **Payment Initialization Time:** Should be <2 seconds
- **Payment Verification Time:** Should be <3 seconds
- **Total Flow Time:** Should be <30 seconds
- **Browser Console:** No warnings or errors
- **Backend Console:** No red error messages

## Test Data to Use

### User Account
- Email: test@example.com
- Password: TestPassword123!

### Test Payment
- Card: 4084 0840 8408 4081
- Expiry: 12/25
- CVV: 123
- OTP: 123456

### Test Booking
- Tour: Any available
- Date: Any future date
- Passengers: 1-4
- Amount: Varies by tour

## Debugging Commands

```bash
# View backend logs in real-time
tail -f backend.log

# Check if servers are running
lsof -i :4000  # Backend
lsof -i :4200  # Frontend

# Check environment variables
cat backend/.env.develop | grep PAYSTACK

# Test Paystack keys with curl (if needed)
curl -H "Authorization: Bearer sk_test_541aa6f7e18303a349dd93ee7ef0bc149e92a669" \
     https://api.paystack.co/balance
```

## Support Resources

- **Quick Start:** PAYSTACK_QUICK_START.md
- **Complete Guide:** PAYSTACK_INTEGRATION_COMPLETE.md
- **Architecture:** PAYSTACK_ARCHITECTURE.md
- **Paystack Docs:** https://paystack.com/docs/api/
- **Browser Console:** F12 (Check for errors)
- **Backend Logs:** Terminal output

---

**Ready to test? Start with Phase 1 above!**

Good luck! 🚀
