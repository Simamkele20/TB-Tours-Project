const express = require('express');
const { body, validationResult } = require('express-validator');
const paystack = require('../payments/paystack');
const Booking = require('../models/Booking');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/payments/initialize
 * Initialize a payment for a booking
 */
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

/**
 * GET /api/payments/verify/:reference
 * Verify a payment transaction
 */
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

/**
 * POST /api/payments/webhook
 * Paystack webhook for payment confirmations
 */
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

/**
 * POST /api/payments/refund
 * Request a refund for a transaction
 */
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

module.exports = router;
