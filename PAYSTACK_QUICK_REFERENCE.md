# Paystack Integration - Quick Reference Card

## 🚀 Start Testing NOW (Copy-Paste Ready)

### Terminal 1: Start Backend
```bash
cd backend
npm start
```
**Expected Output:** 
```
🚀 TB Tours API running on http://localhost:4000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```
**Expected Output:**
```
✔ Compiled successfully
Local: http://localhost:4200
```

---

## 📋 Testing Credentials

| Field | Value |
|-------|-------|
| **Test Email** | test@example.com |
| **Test Password** | TestPassword123! |
| **Card Number** | 4084 0840 8408 4081 |
| **Expiry** | 12/25 (any future date) |
| **CVV** | 123 (any 3 digits) |
| **OTP** | 123456 (any 6 digits) |

---

## 🎯 Complete Flow (5-10 minutes)

```
1. START SERVERS
   └─> Backend: npm start (Terminal 1)
   └─> Frontend: npm start (Terminal 2)

2. OPEN BROWSER
   └─> http://localhost:4200

3. LOGIN/REGISTER
   └─> Click Login
   └─> Use test credentials above

4. BOOK A TOUR
   └─> Go to Tours
   └─> Pick a tour
   └─> Fill booking form
   └─> Click "Pay & Confirm Booking"

5. COMPLETE PAYMENT
   └─> Card: 4084 0840 8408 4081
   └─> Expiry: 12/25
   └─> CVV: 123
   └─> OTP: 123456

6. CHECK RESULTS
   └─> Payment callback page should show SUCCESS ✅
   └─> Click "View My Bookings"
   └─> See booking with "paid" status

7. VERIFY IN DATABASE
   └─> Payment status should be "paid"
   └─> Transaction ID should be filled
```

---

## ✅ Success Checklist

After completing flow above, verify:

- [ ] Backend started without errors
- [ ] Frontend started without errors
- [ ] Can log in with test account
- [ ] Tours page loads
- [ ] Booking form submits
- [ ] Paystack payment modal appears
- [ ] Can enter test card details
- [ ] Payment processes successfully
- [ ] Callback shows "Payment Successful!"
- [ ] Payment details display correctly
- [ ] Booking appears in My Bookings
- [ ] Booking shows "paid" status in database

---

## 🔍 Quick Debugging

| Problem | Solution |
|---------|----------|
| Backend won't start | Check port 4000 not in use: `lsof -i :4000` |
| Frontend won't start | Clear cache: `rm -rf node_modules && npm install` |
| Payment won't initialize | Check PAYSTACK_SECRET_KEY in backend/.env.develop |
| Callback not showing | Check browser URL has `?reference=` parameter |
| Database verification fails | Connect via MySQL Workbench or CLI |

---

## 📊 Key Files & Ports

| Component | Port | File |
|-----------|------|------|
| **Backend** | 4000 | `backend/.env.develop` |
| **Frontend** | 4200 | `frontend/src/environments/environment.ts` |
| **Database** | 3306 | MySQL (localhost) |
| **Paystack API** | 443 | api.paystack.co |

---

## 🔐 Your Test Keys (Already Configured)

```
Secret Key:  sk_test_541aa6f7e18303a349dd93ee7ef0bc149e92a669
Public Key:  pk_test_39961bd3d5a124c5636be980de3a124489f922d5
```

⚠️ **Never commit these to git. They're only for testing.**

---

## 📱 Test Payment Flow (What Happens Behind Scenes)

```
User Books Tour
    ↓
Backend: Create booking + Initialize Paystack
    ↓
Frontend: Redirect to Paystack checkout (or mock for testing)
    ↓
User: Enter card details + OTP
    ↓
Paystack: Process payment + Redirect back
    ↓
Frontend: Verify payment with backend
    ↓
Backend: Query Paystack + Update database
    ↓
Frontend: Show success/failure page
    ↓
User: See confirmation & booking in My Bookings
```

---

## 🧪 Mock vs. Real Testing

### Current Setup: MOCK MODE (USE_MOCK_PAYMENT=true)
- No real Paystack API calls
- Payment instantly succeeds
- Good for rapid testing
- No network dependency

### Real Paystack (Change USE_MOCK_PAYMENT=false)
- Calls actual Paystack API
- Requires internet connection
- Must use valid test cards
- More realistic testing

---

## 📞 Need Help?

| Issue | Where to Look |
|-------|---|
| Payment flow diagram | PAYSTACK_ARCHITECTURE.md |
| Detailed setup steps | PAYSTACK_INTEGRATION_COMPLETE.md |
| Quick start guide | PAYSTACK_QUICK_START.md |
| Full testing checklist | PAYSTACK_TESTING_CHECKLIST.md |
| Backend logs | Terminal running `npm start` |
| Browser errors | F12 → Console tab |
| Database check | MySQL Workbench or terminal |

---

## 🎬 Video Walkthrough Steps (Self-Guide)

1. **Open 2 terminals side-by-side**
   - Left: `cd backend && npm start`
   - Right: `cd frontend && npm start`

2. **Wait for both to start** (~30 seconds total)

3. **Browser opens automatically** to http://localhost:4200

4. **Follow the flow:**
   - Register new user
   - Browse tours
   - Click book tour
   - Fill form
   - Click pay
   - Enter test card
   - See success page ✅

5. **Verify success:**
   - Check My Bookings
   - See "paid" status
   - No errors in console

---

## 💡 Pro Tips

✅ Keep both terminals visible while testing  
✅ Check browser console (F12) for errors  
✅ Check backend terminal for logs  
✅ Test on same machine to avoid network issues  
✅ Use incognito mode if auth issues occur  
✅ Clear browser cache if seeing old data  
✅ Mock mode is perfect for rapid testing  

---

## 🚨 If Something Goes Wrong

1. **Check backend logs** - Terminal 1 shows all errors
2. **Check browser console** - F12 shows frontend errors
3. **Verify environment** - Paystack keys configured?
4. **Restart services** - Stop and start again
5. **Check ports** - Is 4000/4200 already in use?
6. **Review docs** - See PAYSTACK_INTEGRATION_COMPLETE.md

---

**You're ready! Start the servers and test now! 🚀**

Total time to verify everything works: **~15 minutes**
