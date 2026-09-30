/**
 * ⚠️ DEPRECATED: Paystack Integration
 * 
 * This module is NO LONGER IN USE.
 * All payment processing has been migrated to Yoco.
 * 
 * File kept for historical reference only.
 * Do not use or modify.
 * 
 * See: backend/src/payments/yoco.js for current payment gateway implementation
 * See: backend/src/routes/payments.js for active payment endpoints
 */

// This file is deprecated and should not be used
throw new Error('Paystack module is deprecated. Use Yoco payment gateway instead. See backend/src/payments/yoco.js');
const axios = require('axios');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.warn('WARNING: PAYSTACK_SECRET_KEY environment variable is not set');
}

const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Initialize a payment transaction with Paystack
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in cents (ZAR)
 * @param {string} paymentData.email - Customer email
 * @param {string} paymentData.reference - Unique reference for the booking
 * @param {Object} paymentData.metadata - Additional metadata (booking details, customer info, etc.)
 * @returns {Promise<Object>} Response with authorization_url and access_code
 * /
async function initializePayment(paymentData) {
  try {
    const response = await paystackAPI.post('/transaction/initialize', {
      amount: paymentData.amount, // Amount in cents
      email: paymentData.email,
      reference: paymentData.reference,
      metadata: paymentData.metadata || {},
      callback_url: process.env.PAYSTACK_CALLBACK_URL || `${process.env.FRONTEND_URL}/payment-callback`
    });

    return {
      success: true,
      data: {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference
      }
    };
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to initialize payment'
    };
  }
}

/**
 * Verify a payment transaction
 * @param {string} reference - Payment reference to verify
 * @returns {Promise<Object>} Transaction details
 * /
async function verifyPayment(reference) {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    
    const transaction = response.data.data;
    
    return {
      success: true,
      data: {
        reference: transaction.reference,
        amount: transaction.amount,
        status: transaction.status, // 'success', 'pending', 'failed', etc.
        customer: transaction.customer,
        metadata: transaction.metadata,
        authorization: transaction.authorization,
        paid_at: transaction.paid_at,
        created_at: transaction.created_at
      }
    };
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to verify payment'
    };
  }
}

/**
 * Create a payment plan for recurring payments
 * @param {Object} planData - Plan details
 * @param {string} planData.name - Plan name
 * @param {number} planData.amount - Amount in cents
 * @param {string} planData.interval - Billing interval (monthly, quarterly, biannually, annually)
 * @returns {Promise<Object>} Created plan details
 * /
async function createPaymentPlan(planData) {
  try {
    const response = await paystackAPI.post('/plan', {
      name: planData.name,
      amount: planData.amount,
      interval: planData.interval,
      plan_code: planData.plan_code
    });

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Paystack plan creation error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create payment plan'
    };
  }
}

/**
 * Get customer by email or create new
 * @param {string} email - Customer email
 * @param {Object} customerData - Optional customer details
 * @returns {Promise<Object>} Customer details
 * /
async function getOrCreateCustomer(email, customerData = {}) {
  try {
    const response = await paystackAPI.post('/customer', {
      email: email,
      first_name: customerData.firstName || '',
      last_name: customerData.lastName || '',
      phone: customerData.phone || ''
    });

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    // Customer might already exist, which is okay
    if (error.response?.status === 400 && error.response?.data?.message?.includes('exist')) {
      return {
        success: true,
        data: { email }
      };
    }
    console.error('Paystack customer creation error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create customer'
    };
  }
}

/**
 * Authorize a transaction on customer authorization
 * @param {string} authorizationCode - Customer authorization code
 * @param {Object} chargeData - Charge details
 * @returns {Promise<Object>} Charge response
 * /
async function chargeAuthorization(authorizationCode, chargeData) {
  try {
    const response = await paystackAPI.post('/transaction/charge_authorization', {
      authorization_code: authorizationCode,
      email: chargeData.email,
      amount: chargeData.amount,
      metadata: chargeData.metadata || {}
    });

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Paystack charge error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to charge authorization'
    };
  }
}

/**
 * Get transaction details
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} Transaction details
 * /
async function getTransaction(reference) {
  try {
    const response = await paystackAPI.get(`/transaction/${reference}`);

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Paystack get transaction error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get transaction'
    };
  }
}

/**
 * Verify webhook signature from Paystack
 * @param {string} body - Raw request body
 * @param {string} signature - Signature from headers
 * @returns {boolean} True if signature is valid
 * /
function verifyWebhookSignature(body, signature) {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');
  
  return hash === signature;
}

module.exports = {
  initializePayment,
  verifyPayment,
  createPaymentPlan,
  getOrCreateCustomer,
  chargeAuthorization,
  getTransaction,
  verifyWebhookSignature
};
*/
