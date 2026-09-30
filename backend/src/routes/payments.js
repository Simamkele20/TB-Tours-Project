const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');

const router = express.Router();

// ========================================
// YOCO PAYMENT GATEWAY INTEGRATION
// Active payment gateway for TB Tours
// ========================================

const yoco = require('../payments/yoco');

/**
 * POST /api/payments/yoco/checkout
 * Create a Yoco checkout session for a booking
 */
router.post(
  '/yoco/checkout',
  [
    body('bookingId').notEmpty().withMessage('bookingId is required'),
    body('email').isEmail().withMessage('email must be a valid email address'),
    body('amount').notEmpty().withMessage('amount is required'),
    body('firstName').notEmpty().trim().withMessage('firstName is required'),
    body('lastName').notEmpty().trim().withMessage('lastName is required')
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

/**
 * GET /api/payments/yoco/test
 * Test Yoco API authentication
 */
router.get('/yoco/test', async (req, res) => {
  try {
    console.log('[YOCO TEST] Testing credentials...');
    const result = await yoco.testAuthentication();
    
    if (result.success) {
      return res.json({
        success: true,
        message: result.message,
        status: result.status
      });
    } else {
      return res.status(401).json({
        success: false,
        error: result.error,
        status: result.status,
        suggestion: result.suggestion
      });
    }
  } catch (error) {
    console.error('[YOCO TEST] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Test request failed',
      message: error.message
    });
  }
});

module.exports = router;
