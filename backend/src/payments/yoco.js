const axios = require('axios');

const YOCO_BASE_URL = 'https://api.yoco.com/v1';
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
const YOCO_PUBLIC_KEY = process.env.YOCO_PUBLIC_KEY;
const NODE_ENV = process.env.NODE_ENV || 'development';
const USE_YOCO_MOCK = process.env.USE_YOCO_MOCK === 'true'; // Default to false - use real API

// Determine if we should use mock mode:
// - Only if USE_YOCO_MOCK is explicitly set to 'true'
const SHOULD_USE_MOCK = USE_YOCO_MOCK;

if (!YOCO_SECRET_KEY) {
  console.warn('[YOCO] WARNING: YOCO_SECRET_KEY environment variable is not set');
} else {
  console.log('[YOCO] Secret key configured:', YOCO_SECRET_KEY.substring(0, 15) + '...');
}

if (!YOCO_PUBLIC_KEY) {
  console.warn('[YOCO] WARNING: YOCO_PUBLIC_KEY environment variable is not set');
} else {
  console.log('[YOCO] Public key configured:', YOCO_PUBLIC_KEY.substring(0, 15) + '...');
}

if (SHOULD_USE_MOCK) {
  console.log('[YOCO] 🎭 MOCK MODE ENABLED (explicitly set via USE_YOCO_MOCK=true)');
} else {
  console.log('[YOCO] 🌐 REAL API MODE - Using actual Yoco API with your credentials');
}

// Create Authorization header: Yoco uses Bearer token with secret key
console.log('[YOCO] Auth Setup:');
console.log('[YOCO] - Secret key:', YOCO_SECRET_KEY?.substring(0, 20) + '...');
console.log('[YOCO] - Secret key length:', YOCO_SECRET_KEY?.length);
console.log('[YOCO] - Using Bearer token authentication (sk_test_... or sk_live_...)');

const yocoAPI = axios.create({
  baseURL: YOCO_BASE_URL,
  headers: {
    'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  // Allow self-signed certificates for development
  httpsAgent: new (require('https').Agent)({ 
    rejectUnauthorized: false 
  })
});

// Add request interceptor to log headers being sent
yocoAPI.interceptors.request.use(config => {
  const authHeader = config.headers['Authorization'];
  console.log('[YOCO API] Request being sent:');
  console.log('[YOCO API] - URL:', config.baseURL + config.url);
  console.log('[YOCO API] - Method:', config.method);
  console.log('[YOCO API] - Auth header prefix:', authHeader?.substring(0, 15));
  console.log('[YOCO API] - Auth header length:', authHeader?.length);
  console.log('[YOCO API] - Full secret key used:', YOCO_SECRET_KEY);
  console.log('[YOCO API] - Full auth header:', authHeader);
  return config;
}, error => Promise.reject(error));

// Add response interceptor to capture error details
yocoAPI.interceptors.response.use(
  response => response,
  error => {
    console.error('[YOCO API] Response interceptor caught error:');
    console.error('[YOCO API] - Status:', error.response?.status);
    console.error('[YOCO API] - Status text:', error.response?.statusText);
    console.error('[YOCO API] - Error type:', error.response?.data?.type);
    console.error('[YOCO API] - Error detail:', error.response?.data?.detail);
    console.error('[YOCO API] - Error code:', error.response?.data?.code);
    console.error('[YOCO API] - Full response:', JSON.stringify(error.response?.data, null, 2));
    return Promise.reject(error);
  }
);

/**
 * Create a Yoco checkout session
 * @param {Object} checkoutData - Checkout details
 * @param {number} checkoutData.amount - Amount in cents (ZAR)
 * @param {string} checkoutData.currency - Currency code (ZAR)
 * @param {string} checkoutData.email - Customer email
 * @param {string} checkoutData.reference - Unique reference for the booking
 * @param {string} checkoutData.successUrl - URL to redirect after successful payment
 * @param {string} checkoutData.cancelUrl - URL to redirect after cancelled payment
 * @param {Object} checkoutData.metadata - Additional metadata (booking details, customer info, etc.)
 * @returns {Promise<Object>} Response with checkout session details and redirectUrl
 */
async function createCheckout(checkoutData) {
  try {
    console.log('\n[YOCO] ========================================');
    console.log('[YOCO] Creating checkout with data:', {
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      email: checkoutData.email,
      reference: checkoutData.reference
    });
    
    // Log mock mode decision
    console.log('[YOCO] Mock mode check:', {
      SHOULD_USE_MOCK,
      USE_YOCO_MOCK,
      NODE_ENV,
      YOCO_SECRET_KEY_PREFIX: YOCO_SECRET_KEY?.substring(0, 15),
      YOCO_PUBLIC_KEY_PREFIX: YOCO_PUBLIC_KEY?.substring(0, 15)
    });

    // MOCK MODE FOR DEVELOPMENT AND TEST CREDENTIALS
    if (SHOULD_USE_MOCK) {
      console.log('[YOCO] 🎭 MOCK MODE ACTIVE - Returning simulated response');
      const checkoutId = 'cht_test_' + Date.now();
      return {
        success: true,
        data: {
          checkoutId: checkoutId,
          redirectUrl: `https://checkout.yoco.com/${checkoutId}`,
          amount: checkoutData.amount,
          currency: checkoutData.currency || 'ZAR',
          status: 'pending'
        }
      };
    }
    
    console.log('[YOCO] 🌐 LIVE MODE - Calling real Yoco API...');

    // Real Yoco API call with all required fields
    console.log('[YOCO] Calling real Yoco API with request payload:', {
      amount: checkoutData.amount,
      currency: checkoutData.currency || 'ZAR',
      description: checkoutData.reference || 'TB Tours Booking Payment',
      email: checkoutData.email,
      successUrl: checkoutData.successUrl,
      cancelUrl: checkoutData.cancelUrl,
      metadata: checkoutData.metadata
    });

    const response = await yocoAPI.post('/checkouts', {
      amount: checkoutData.amount, // Amount in cents
      currency: checkoutData.currency || 'ZAR',
      description: checkoutData.reference || 'TB Tours Booking Payment',
      email: checkoutData.email,
      successUrl: checkoutData.successUrl,
      cancelUrl: checkoutData.cancelUrl,
      metadata: checkoutData.metadata || {}
    });

    console.log('[YOCO] Checkout session created:', response.data.id);
    console.log('[YOCO] Checkout response:', JSON.stringify(response.data, null, 2));

    return {
      success: true,
      data: {
        checkoutId: response.data.id,
        redirectUrl: response.data.redirectUrl,
        amount: response.data.amount,
        currency: response.data.currency,
        status: response.data.status
      }
    };
  } catch (error) {
    console.error('[YOCO] ❌ CHECKOUT CREATION FAILED');
    console.error('[YOCO] Error message:', error.message);
    console.error('[YOCO] Error status:', error.response?.status);
    console.error('[YOCO] Error response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('[YOCO] Error response headers:', JSON.stringify(error.response?.headers, null, 2));
    console.error('[YOCO] Full error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    });
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create checkout session'
    };
  }
}

/**
 * Get a checkout session details
 * @param {string} checkoutId - Checkout ID
 * @returns {Promise<Object>} Checkout session details
 */
async function getCheckout(checkoutId) {
  try {
    const response = await yocoAPI.get(`/checkouts/${checkoutId}`);
    
    const checkout = response.data;
    
    return {
      success: true,
      data: {
        checkoutId: checkout.id,
        amount: checkout.amount,
        currency: checkout.currency,
        status: checkout.status, // 'pending', 'succeeded', 'failed', 'cancelled'
        payment: checkout.payment,
        metadata: checkout.metadata,
        createdAt: checkout.createdAt,
        updatedAt: checkout.updatedAt
      }
    };
  } catch (error) {
    console.error('[YOCO] Get checkout error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get checkout details'
    };
  }
}

/**
 * Get payment details from a checkout
 * @param {string} checkoutId - Checkout ID
 * @returns {Promise<Object>} Payment details
 */
async function getPayment(checkoutId) {
  try {
    console.log('[YOCO] Getting payment details for checkout:', checkoutId);

    // MOCK MODE FOR DEVELOPMENT AND TEST CREDENTIALS
    if (SHOULD_USE_MOCK) {
      console.log('[YOCO] 🎭 MOCK: Returning simulated payment status (pending)');
      return {
        success: true,
        data: {
          reference: 'TB-' + Math.random().toString(36).substring(7),
          amount: 1800, // in cents (18.00 ZAR)
          paymentStatus: 'pending', // Keep as pending so user can see payment page
          currency: 'ZAR',
          email: 'test@example.com',
          completedAt: new Date().toISOString(),
          metadata: {}
        }
      };
    }

    const checkoutResponse = await yocoAPI.get(`/checkouts/${checkoutId}`);
    const checkout = checkoutResponse.data;

    if (!checkout.payment) {
      return {
        success: false,
        error: 'No payment associated with this checkout'
      };
    }

    // Payment succeeded if checkout status is 'succeeded'
    return {
      success: true,
      data: {
        checkoutId: checkout.id,
        paymentStatus: checkout.status,
        amount: checkout.amount,
        currency: checkout.currency,
        reference: checkout.metadata?.reference,
        email: checkout.metadata?.email,
        createdAt: checkout.createdAt,
        completedAt: checkout.updatedAt,
        metadata: checkout.metadata
      }
    };
  } catch (error) {
    console.error('[YOCO] Get payment error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get payment details'
    };
  }
}

/**
 * Verify webhook signature from Yoco
 * @param {string} body - Raw request body
 * @param {string} signature - Signature from headers (x-yoco-signature)
 * @returns {boolean} True if signature is valid
 */
function verifyWebhookSignature(body, signature) {
  const crypto = require('crypto');
  
  // Yoco uses HMAC SHA256
  const hash = crypto
    .createHmac('sha256', YOCO_SECRET_KEY)
    .update(body)
    .digest('base64');
  
  return hash === signature;
}

/**
 * Handle Yoco webhook event
 * @param {Object} event - Webhook event payload
 * @returns {Promise<Object>} Event handling result
 */
async function handleWebhookEvent(event) {
  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.completed':
        console.log('[YOCO] Checkout completed:', event.data.id);
        return {
          success: true,
          handled: true,
          eventType: 'checkout.completed',
          checkoutId: event.data.id
        };
      
      case 'checkout.payment_failed':
        console.log('[YOCO] Payment failed:', event.data.id);
        return {
          success: true,
          handled: true,
          eventType: 'checkout.payment_failed',
          checkoutId: event.data.id
        };
      
      case 'checkout.expired':
        console.log('[YOCO] Checkout expired:', event.data.id);
        return {
          success: true,
          handled: true,
          eventType: 'checkout.expired',
          checkoutId: event.data.id
        };
      
      default:
        console.log('[YOCO] Unhandled event type:', event.type);
        return {
          success: true,
          handled: false,
          eventType: event.type
        };
    }
  } catch (error) {
    console.error('[YOCO] Webhook event handling error:', error.message);
    return {
      success: false,
      error: 'Failed to handle webhook event'
    };
  }
}

/**
 * Test Yoco API authentication - Diagnostic mode
 * @returns {Promise<Object>} Test result with diagnostics
 */
async function testAuthentication() {
  try {
    // Diagnostic info
    console.log('\n[YOCO TEST] ========================================');
    console.log('[YOCO TEST] DIAGNOSTIC INFORMATION');
    console.log('[YOCO TEST] ========================================');
    console.log('[YOCO TEST] Secret Key Set:', !!YOCO_SECRET_KEY);
    console.log('[YOCO TEST] Secret Key Length:', YOCO_SECRET_KEY?.length);
    console.log('[YOCO TEST] Secret Key Prefix:', YOCO_SECRET_KEY?.substring(0, 15) + '...');
    console.log('[YOCO TEST] Is Test Key:', YOCO_SECRET_KEY?.startsWith('sk_test_'));
    console.log('[YOCO TEST] Is Live Key:', YOCO_SECRET_KEY?.startsWith('sk_live_'));
    console.log('[YOCO TEST] Public Key Set:', !!YOCO_PUBLIC_KEY);
    console.log('[YOCO TEST] Public Key Prefix:', YOCO_PUBLIC_KEY?.substring(0, 15) + '...');
    console.log('[YOCO TEST] Mock Mode:', SHOULD_USE_MOCK);
    console.log('[YOCO TEST] Base URL:', YOCO_BASE_URL);
    console.log('[YOCO TEST] ========================================\n');
    
    // Try creating a test checkout to verify authentication
    const testCheckoutData = {
      amount: 200, // R2.00 minimum for Yoco
      currency: 'ZAR',
      description: 'TB Tours - Authentication test',
      email: 'test@example.com',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    };
    
    console.log('[YOCO TEST] Sending test checkout request...');
    const response = await yocoAPI.post('/checkouts', testCheckoutData);
    
    console.log('[YOCO TEST] ✅ Authentication successful!');
    console.log('[YOCO TEST] Checkout created:', response.data.id);
    return {
      success: true,
      message: 'API credentials are valid - Authentication successful!',
      status: response.status,
      checkoutId: response.data.id,
      diagnostics: {
        keyType: YOCO_SECRET_KEY?.startsWith('sk_test_') ? 'Test Key' : YOCO_SECRET_KEY?.startsWith('sk_live_') ? 'Live Key' : 'Unknown',
        keyLength: YOCO_SECRET_KEY?.length,
        mockMode: SHOULD_USE_MOCK
      }
    };
  } catch (error) {
    console.error('\n[YOCO TEST] ❌ Authentication failed');
    console.error('[YOCO TEST] Error Code:', error.response?.data?.code);
    console.error('[YOCO TEST] Error Detail:', error.response?.data?.detail);
    console.error('[YOCO TEST] HTTP Status:', error.response?.status);
    console.error('[YOCO TEST] Request was to:', error.config?.baseURL + error.config?.url);
    
    // Provide diagnostic suggestions
    let suggestion = '';
    if (error.response?.status === 401) {
      suggestion = 'Your credentials are being rejected by Yoco API. Possible causes:\n' +
        '1. Test account not fully activated - check Yoco dashboard\n' +
        '2. Keys need to be regenerated - try generating new test keys\n' +
        '3. Keys have been disabled - verify they show as Active in dashboard\n' +
        '4. Account needs email verification - check your Yoco account\n' +
        '5. Try using LIVE keys if your domains are verified (they should unlock automatically)';
    } else if (error.response?.status === 403) {
      suggestion = 'Authorization header missing or incorrect. Check Bearer token format.';
    }
    
    console.error('[YOCO TEST] Suggestion:', suggestion);
    console.error('[YOCO TEST] ========================================\n');
    
    return {
      success: false,
      error: error.response?.data?.detail || error.message,
      status: error.response?.status,
      diagnostics: {
        keyType: YOCO_SECRET_KEY?.startsWith('sk_test_') ? 'Test Key' : YOCO_SECRET_KEY?.startsWith('sk_live_') ? 'Live Key' : 'Unknown',
        keyLength: YOCO_SECRET_KEY?.length,
        mockMode: SHOULD_USE_MOCK,
        requestUrl: error.config?.baseURL + error.config?.url
      },
      suggestion
    };
  }
}

module.exports = {
  createCheckout,
  getCheckout,
  getPayment,
  verifyWebhookSignature,
  handleWebhookEvent,
  testAuthentication
};
