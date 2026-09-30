const express = require('express');
const { body, validationResult } = require('express-validator');
// const paystack = require('../payments/paystack'); // COMMENTED OUT - Switching to Yoco
const Booking = require('../models/Booking');
const User = require('../models/User');

const router = express.Router();

// ========================================
// PAYSTACK INTEGRATION DISABLED
// Migration in progress to Yoco payment gateway
// ========================================

/*
// PAYSTACK ENDPOINTS - ALL COMMENTED OUT

// POST /api/payments/initialize
// Initialize a payment for a booking
router.post(
  '/initialize',
  [
    body('bookingId').isNumeric().notEmpty(),
    body('email').isEmail(),
    body('amount').isNumeric().notEmpty(),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('phone').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { bookingId, email, amount, firstName, lastName, phone } = req.body;

      // Verify booking exists and belongs to user
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Create or get customer
      const customerResult = await paystack.getOrCreateCustomer(email, {
        firstName,
        lastName,
        phone
      });

      if (!customerResult.success) {
        return res.status(400).json({
          success: false,
          error: customerResult.error
        });
      }

      // Initialize payment
      const reference = `BK-${bookingId}-${Date.now()}`;
      const paymentResult = await paystack.initializePayment({
        amount: Math.round(amount * 100), // Convert to cents
        email,
        reference,
        metadata: {
          bookingId,
          firstName,
          lastName,
          phone,
          serviceType: booking.serviceType,
          tourDate: booking.tourDate
        }
      });

      if (!paymentResult.success) {
        return res.status(400).json({
          success: false,
          error: paymentResult.error
        });
      }

      // Update booking with payment reference
      await booking.update({
        paymentReference: reference,
        paymentStatus: 'pending'
      });

      return res.json({
        success: true,
        data: {
          authorization_url: paymentResult.data.authorization_url,
          access_code: paymentResult.data.access_code,
          reference: paymentResult.data.reference
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize payment'
      });
    }
  }
);

// GET /api/payments/verify/:reference
// Verify a payment transaction
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    console.log('[VERIFY PAYMENT] Reference:', reference);

    // Check if this is a mock payment (testing mode)
    let transaction;
    if (reference.startsWith('MOCK-')) {
      console.log('[VERIFY PAYMENT] Mock payment detected - simulating success');
      // Extract booking reference from mock reference format: MOCK-{bookingReference}
      const bookingRef = reference.replace('MOCK-', '');
      
      // For mock mode, create a simulated successful transaction
      transaction = {
        reference: reference,
        status: 'success',
        paid_at: new Date().toISOString(),
        amount: 65000, // Default amount in kobo (R650)
        metadata: {
          bookingId: null
        }
      };
    } else {
      // Call real Paystack API for actual payments
      const verifyResult = await paystack.verifyPayment(reference);

      if (!verifyResult.success) {
        return res.status(400).json({
          success: false,
          error: verifyResult.error
        });
      }

      transaction = verifyResult.data;
    }

    // Update booking status - find by bookingId from metadata or by payment reference
    let booking = null;
    if (transaction.metadata && transaction.metadata.bookingId) {
      booking = await Booking.findByPk(transaction.metadata.bookingId);
    } else if (reference.startsWith('MOCK-')) {
      // For mock payments, find by payment reference
      booking = await Booking.findOne({
        where: { paystackReference: reference }
      });
      console.log('[VERIFY PAYMENT] Found booking by mock reference:', booking ? booking.id : 'NOT FOUND');
    }

    if (booking) {
      console.log('[VERIFY PAYMENT] Updating booking status to paid');
      await booking.update({
        paymentStatus: transaction.status === 'success' ? 'paid' : 'failed',
        transactionId: transaction.reference,
        paymentDate: transaction.paid_at || new Date()
      });

      // Update user if not exists
      if (transaction.status === 'success') {
        // For mock payments, use booking owner's email
        const email = transaction.metadata?.email || booking.User?.email;
        if (email) {
          const [user] = await User.findOrCreate({
            where: { email: email },
            defaults: {
              email: email
            }
          });

          // Associate booking with user
          await booking.update({ UserId: user.id });
        }
      }
    } else {
      console.log('[VERIFY PAYMENT] No booking found for reference:', reference);
    }

    return res.json({
      success: true,
      data: {
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert back to ZAR
        status: transaction.status,
        paidAt: transaction.paid_at
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
});

// POST /api/payments/webhook
// Paystack webhook for payment confirmations
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const body = req.body;

    // Verify webhook signature
    if (!paystack.verifyWebhookSignature(body, signature)) {
      console.warn('Invalid webhook signature');
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }

    const event = JSON.parse(body.toString());

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const transaction = event.data;

      if (transaction.metadata && transaction.metadata.bookingId) {
        const booking = await Booking.findByPk(transaction.metadata.bookingId);

        if (booking) {
          await booking.update({
            paymentStatus: 'completed',
            transactionId: transaction.reference,
            paymentDate: new Date()
          });

          // Create/update user
          const [user] = await User.findOrCreate({
            where: { email: transaction.customer.email },
            defaults: {
              firstName: transaction.metadata.firstName,
              lastName: transaction.metadata.lastName,
              phone: transaction.metadata.phone,
              email: transaction.customer.email
            }
          });

          await booking.update({ UserId: user.id });

          console.log(`Payment successful for booking ${transaction.metadata.bookingId}`);
        }
      }
    }

    // Handle charge.failed event
    if (event.event === 'charge.failed') {
      const transaction = event.data;

      if (transaction.metadata && transaction.metadata.bookingId) {
        const booking = await Booking.findByPk(transaction.metadata.bookingId);

        if (booking) {
          await booking.update({
            paymentStatus: 'failed'
          });
          console.log(`Payment failed for booking ${transaction.metadata.bookingId}`);
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

// POST /api/payments/refund
// Request a refund for a transaction
router.post(
  '/refund',
  [
    body('reference').notEmpty(),
    body('amount').isNumeric().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { reference, amount } = req.body;

      // Note: Paystack refunds are handled through the Paystack dashboard
      // This endpoint logs refund requests for your backend to process

      const booking = await Booking.findOne({
        where: { paymentReference: reference }
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Update booking status
      await booking.update({
        paymentStatus: 'refund_requested',
        refundAmount: amount
      });

      console.log(`Refund requested for booking ${booking.id}: ZAR ${amount}`);

      return res.json({
        success: true,
        message: 'Refund request submitted. Admin will process this manually.',
        bookingId: booking.id
      });
    } catch (error) {
      console.error('Refund request error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process refund request'
      });
    }
  }
);

*/

// ========================================
// YOCO PAYMENT GATEWAY INTEGRATION
// ========================================

const yoco = require('../payments/yoco');

/**
 * POST /api/payments/yoco/checkout
 * Create a Yoco checkout session for a booking
 */
router.post(
  '/yoco/checkout',
  [
    body('bookingId').trim().not().isEmpty().withMessage('bookingId is required'),
    body('email').trim().isEmail().withMessage('email must be a valid email address'),
    body('amount').trim().not().isEmpty().withMessage('amount is required'),
    body('firstName').trim().not().isEmpty().withMessage('firstName is required'),
    body('lastName').trim().not().isEmpty().withMessage('lastName is required')
  ],
  async (req, res) => {
    console.log('\n========================================');
    console.log('[YOCO CHECKOUT] Received request');
    console.log('Request body:', req.body);
    try {
      console.log('[YOCO CHECKOUT] Request body:', req.body);
      console.log('[YOCO CHECKOUT] Data types:', {
        bookingId: typeof req.body.bookingId,
        email: typeof req.body.email,
        amount: typeof req.body.amount,
        firstName: typeof req.body.firstName,
        lastName: typeof req.body.lastName
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('[YOCO CHECKOUT] Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: errors.array().map(e => `${e.param}: ${e.msg}`).join('; ')
        });
      }

      const { bookingId, email, amount, firstName, lastName } = req.body;

      // Convert types
      const bookingIdNum = Number(bookingId);
      const amountNum = Number(amount);

      if (isNaN(bookingIdNum) || bookingIdNum <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: 'bookingId must be a positive number'
        });
      }

      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: 'amount must be a positive number'
        });
      }

      // Verify booking exists
      const booking = await Booking.findByPk(bookingIdNum);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Create Yoco checkout session
      const reference = `BK-${bookingIdNum}-${Date.now()}`;
      const checkoutResult = await yoco.createCheckout({
        amount: Math.round(amountNum * 100), // Convert to cents
        currency: 'ZAR',
        email,
        reference,
        successUrl: `${process.env.FRONTEND_URL}/payment-success?checkoutId={checkoutId}`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment-cancelled`,
        metadata: {
          bookingId: bookingIdNum,
          firstName,
          lastName,
          email,
          serviceType: booking.serviceType,
          tourDate: booking.tourDate
        }
      });

      if (!checkoutResult.success) {
        return res.status(400).json({
          success: false,
          error: checkoutResult.error
        });
      }

      // Update booking with payment reference
      await booking.update({
        paymentReference: reference,
        paymentStatus: 'pending'
      });

      return res.json({
        success: true,
        data: {
          checkoutId: checkoutResult.data.checkoutId,
          redirectUrl: checkoutResult.data.redirectUrl,
          amount: checkoutResult.data.amount,
          currency: checkoutResult.data.currency
        }
      });
    } catch (error) {
      console.error('[YOCO] Checkout creation error:', error.message);
      console.error('[YOCO] Error stack:', error.stack);
      if (error.response) {
        console.error('[YOCO] Yoco API error:', JSON.stringify(error.response.data, null, 2));
      }
      res.status(500).json({
        success: false,
        error: 'Failed to create checkout session',
        debug: error.message
      });
    }
  }
);

/**
 * GET /api/payments/yoco/checkout/:checkoutId
 * Get checkout status and payment details
 */
router.get('/yoco/checkout/:checkoutId', async (req, res) => {
  try {
    const { checkoutId } = req.params;

    const paymentResult = await yoco.getPayment(checkoutId);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: paymentResult.error
      });
    }

    const paymentData = paymentResult.data;

    // Find booking if reference is available
    let booking = null;
    if (paymentData.reference) {
      booking = await Booking.findOne({
        where: { paymentReference: paymentData.reference }
      });
    }

    // Update booking status if payment succeeded
    if (booking && paymentData.paymentStatus === 'succeeded') {
      await booking.update({
        paymentStatus: 'paid',
        transactionId: checkoutId,
        paymentDate: new Date()
      });

      // Create/update user
      const [user] = await User.findOrCreate({
        where: { email: paymentData.email },
        defaults: {
          firstName: paymentData.metadata?.firstName,
          lastName: paymentData.metadata?.lastName,
          email: paymentData.email
        }
      });

      await booking.update({ UserId: user.id });
    } else if (booking && paymentData.paymentStatus === 'failed') {
      await booking.update({
        paymentStatus: 'failed'
      });
    }

    return res.json({
      success: true,
      data: {
        reference: paymentData.reference,
        amount: paymentData.amount / 100, // Convert from cents to ZAR
        status: paymentData.paymentStatus,
        paidAt: paymentData.completedAt,
        email: paymentData.email,
        checkoutId: paymentData.checkoutId
      }
    });
  } catch (error) {
    console.error('[YOCO] Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status'
    });
  }
});

/**
 * POST /api/payments/yoco/webhook
 * Yoco webhook for payment events
 */
router.post('/yoco/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-yoco-signature'];
    const body = req.body;

    // Verify webhook signature
    if (!yoco.verifyWebhookSignature(body, signature)) {
      console.warn('[YOCO] Invalid webhook signature');
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }

    const event = JSON.parse(body.toString());
    
    console.log('[YOCO] Webhook event received:', event.type);

    // Handle webhook event
    if (event.type === 'checkout.completed') {
      const checkoutId = event.data.id;
      
      // Get payment details
      const paymentResult = await yoco.getPayment(checkoutId);

      if (paymentResult.success) {
        const paymentData = paymentResult.data;

        // Find and update booking
        if (paymentData.reference) {
          const booking = await Booking.findOne({
            where: { paymentReference: paymentData.reference }
          });

          if (booking) {
            await booking.update({
              paymentStatus: 'paid',
              transactionId: checkoutId,
              paymentDate: new Date()
            });

            // Create/update user
            const [user] = await User.findOrCreate({
              where: { email: paymentData.email },
              defaults: {
                firstName: paymentData.metadata?.firstName,
                lastName: paymentData.metadata?.lastName,
                email: paymentData.email
              }
            });

            await booking.update({ UserId: user.id });

            console.log(`[YOCO] Payment successful for booking ${booking.id}`);
          }
        }
      }
    } else if (event.type === 'checkout.payment_failed') {
      const checkoutId = event.data.id;
      
      // Get payment details
      const paymentResult = await yoco.getPayment(checkoutId);

      if (paymentResult.success) {
        const paymentData = paymentResult.data;

        // Find and update booking
        if (paymentData.reference) {
          const booking = await Booking.findOne({
            where: { paymentReference: paymentData.reference }
          });

          if (booking) {
            await booking.update({
              paymentStatus: 'failed'
            });

            console.log(`[YOCO] Payment failed for booking ${booking.id}`);
          }
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[YOCO] Webhook error:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

module.exports = router;
