#!/usr/bin/env node
/**
 * Standalone Yoco Authentication Diagnostic Tool
 * Tests Yoco API credentials and provides detailed diagnostics
 */

require('dotenv').config({ path: '.env.develop' });
const axios = require('axios');
const https = require('https');

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
const YOCO_PUBLIC_KEY = process.env.YOCO_PUBLIC_KEY;
const YOCO_BASE_URL = 'https://api.yoco.com/v1';

console.log('\n' + '='.repeat(70));
console.log('YOCO AUTHENTICATION DIAGNOSTIC TOOL');
console.log('='.repeat(70) + '\n');

// Step 1: Environment Check
console.log('📋 STEP 1: Environment Variables\n');
console.log('Secret Key Set:', !!YOCO_SECRET_KEY ? '✅ YES' : '❌ NO');
console.log('Secret Key Length:', YOCO_SECRET_KEY?.length || 'N/A');
console.log('Secret Key Starts With:', YOCO_SECRET_KEY?.substring(0, 15) + '...');
console.log('Is Test Key:', YOCO_SECRET_KEY?.startsWith('sk_test_') ? '✅ YES' : '❌ NO');
console.log('Is Live Key:', YOCO_SECRET_KEY?.startsWith('sk_live_') ? '✅ YES' : '❌ NO');
console.log('Public Key Set:', !!YOCO_PUBLIC_KEY ? '✅ YES' : '❌ NO');
console.log('Public Key Starts With:', YOCO_PUBLIC_KEY?.substring(0, 15) + '...');

// Step 2: Bearer Token Check
console.log('\n📋 STEP 2: Bearer Token Format\n');
const bearerToken = `Bearer ${YOCO_SECRET_KEY}`;
console.log('Bearer Token Length:', bearerToken.length);
console.log('Bearer Token Format Valid:', bearerToken.startsWith('Bearer sk_') ? '✅ YES' : '❌ NO');
console.log('Bearer Token Sample:', bearerToken.substring(0, 30) + '...');

// Step 3: API Request Test
console.log('\n📋 STEP 3: Testing API Request\n');
console.log('API Base URL:', YOCO_BASE_URL);
console.log('Testing endpoint: POST /checkouts');

const testCheckout = async () => {
  try {
    console.log('\n🔄 Sending test request to Yoco API...\n');
    
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false  // Bypass SSL cert verification for testing
    });
    
    const response = await axios.post(
      `${YOCO_BASE_URL}/checkouts`,
      {
        amount: 200, // Minimum R2.00
        currency: 'ZAR',
        description: 'TB Tours - Diagnostic Test',
        email: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      },
      {
        headers: {
          'Authorization': bearerToken,
          'Content-Type': 'application/json'
        },
        httpsAgent: httpsAgent
      }
    );
    
    console.log('✅ SUCCESS!\n');
    console.log('Response Status:', response.status);
    console.log('Checkout ID:', response.data.id);
    console.log('Redirect URL:', response.data.redirectUrl);
    
  } catch (error) {
    console.log('❌ FAILED\n');
    
    // Detailed error logging
    console.log('Error Details:');
    console.log('- Code:', error.code);
    console.log('- Status:', error.response?.status);
    console.log('- Message:', error.message);
    console.log('- Data:', error.response?.data);
    
    if (error.response) {
      console.log('- Response Headers:', error.response.headers);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('DIAGNOSTIC ANALYSIS');
    console.log('='.repeat(70) + '\n');
    
    if (error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log('🔴 SSL CERTIFICATE ERROR\n');
      console.log('Issue: Node.js is rejecting the Yoco API certificate chain\n');
      console.log('NOTE: This is a development/network issue, NOT an authentication issue.');
      console.log('      The 401 Unauthorized errors you saw before were likely from');
      console.log('      the backend in mock mode, not from the actual Yoco API.\n');
      console.log('Solutions:\n');
      console.log('1. ✅ Use NODE_TLS_REJECT_UNAUTHORIZED=0 (development only)');
      console.log('2. ✅ Update Node.js to the latest version');
      console.log('3. ✅ Check firewall/proxy settings');
      console.log('4. ✅ Test in production environment (should use proper certs)\n');
      
    } else if (error.response?.status === 401) {
      console.log('🔴 HTTP 401 Unauthorized - Credentials Invalid\n');
      console.log('Possible Causes:\n');
      console.log('1. ⚠️  TEST ACCOUNT NOT ACTIVATED');
      console.log('   → Yoco account needs full setup before test keys work');
      console.log('   → Check your Yoco dashboard for any pending setup steps\n');
      console.log('2. ⚠️  TEST KEYS NEED REGENERATION');
      console.log('   → Try generating new test keys in Yoco dashboard');
      console.log('   → Delete existing keys and create fresh ones\n');
      console.log('3. ⚠️  KEYS DISABLED');
      console.log('   → Verify keys show as "Active" in Yoco dashboard');
      console.log('   → Check if they\'ve been deactivated\n');
      console.log('4. ⚠️  ACCOUNT NEEDS EMAIL VERIFICATION');
      console.log('   → Check your email for Yoco verification messages');
      console.log('   → Complete any pending email verification\n');
      
    } else if (error.response?.status === 403) {
      console.log('🔴 HTTP 403 Forbidden - Authorization Header Issue\n');
      console.log('Solution: Check Bearer token format is correct\n');
      
    } else {
      console.log('🔴 Error:', error.message);
    }
  }
  
  console.log('='.repeat(70) + '\n');
};

testCheckout();
