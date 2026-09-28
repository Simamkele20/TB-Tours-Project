/**
 * Test Paystack Integration
 * Run with: node test-paystack.js
 */

require('dotenv').config();
const paystack = require('./src/payments/paystack');

const testData = {
  amount: 250000, // R2500 in cents
  email: 'test@example.com',
  reference: `TEST-${Date.now()}`,
  metadata: {
    bookingId: 999,
    firstName: 'Test',
    lastName: 'User',
    phone: '+27123456789',
    serviceType: 'Test Payment'
  }
};

async function runTests() {
  console.log('🔧 Testing Paystack Integration...\n');

  // Test 1: Initialize Payment
  console.log('1️⃣  Testing Payment Initialization...');
  console.log(`   Reference: ${testData.reference}`);
  console.log(`   Amount: R${testData.amount / 100}`);
  console.log(`   Email: ${testData.email}\n`);

  const initResult = await paystack.initializePayment(testData);

  if (initResult.success) {
    console.log('✅ Payment Initialization Successful!\n');
    console.log('   Authorization URL:', initResult.data.authorization_url);
    console.log('   Access Code:', initResult.data.access_code);
    console.log('   Reference:', initResult.data.reference);
    console.log('\n📝 Next Steps:');
    console.log('   1. Open the Authorization URL in your browser');
    console.log('   2. Use test card: 4084084084084081');
    console.log('   3. Expiry: Any future date (e.g., 12/25)');
    console.log('   4. CVV: Any 3 digits (e.g., 123)');
    console.log('   5. OTP: Any 6 digits (e.g., 123456)\n');
    console.log('   After payment, save the reference to test verification.');
    console.log(`   Reference to save: ${initResult.data.reference}\n`);
  } else {
    console.log('❌ Payment Initialization Failed!');
    console.log('   Error:', initResult.error);
    console.log('\n🔍 Troubleshooting:');
    console.log('   - Check if PAYSTACK_SECRET_KEY is set correctly');
    console.log('   - Verify internet connection');
    console.log('   - Ensure Paystack service is accessible\n');
  }

  // Test 2: Verify Webhook Signature (mock test)
  console.log('2️⃣  Testing Webhook Signature Verification...');
  const mockBody = JSON.stringify({
    event: 'charge.success',
    data: {
      id: 12345,
      reference: testData.reference,
      status: 'success'
    }
  });

  try {
    const crypto = require('crypto');
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = crypto
      .createHmac('sha512', secret)
      .update(mockBody)
      .digest('hex');

    const isValid = paystack.verifyWebhookSignature(mockBody, signature);
    if (isValid) {
      console.log('✅ Webhook Signature Verification Successful!\n');
    } else {
      console.log('❌ Webhook Signature Verification Failed!\n');
    }
  } catch (error) {
    console.log('❌ Webhook test error:', error.message, '\n');
  }

  // Test 3: Environment Variables Check
  console.log('3️⃣  Checking Environment Variables...');
  const checks = {
    'PAYSTACK_SECRET_KEY': process.env.PAYSTACK_SECRET_KEY ? '✅ Set' : '❌ Missing',
    'PAYSTACK_PUBLIC_KEY': process.env.PAYSTACK_PUBLIC_KEY ? '✅ Set' : '❌ Missing',
    'PAYSTACK_CALLBACK_URL': process.env.PAYSTACK_CALLBACK_URL ? '✅ Set' : '❌ Missing',
    'FRONTEND_URL': process.env.FRONTEND_URL ? '✅ Set' : '❌ Missing'
  };

  Object.entries(checks).forEach(([key, status]) => {
    console.log(`   ${key}: ${status}`);
  });

  console.log('\n🎉 Paystack Integration Test Complete!\n');
  console.log('📚 Next Steps:');
  console.log('   1. Update frontend environment with public key');
  console.log('   2. Create payment confirmation component');
  console.log('   3. Integrate PaystackService in booking component');
  console.log('   4. Set up webhook in Paystack dashboard');
  console.log('   5. Test end-to-end payment flow\n');
}

runTests().catch(error => {
  console.error('Test Error:', error);
  process.exit(1);
});
