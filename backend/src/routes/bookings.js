const express = require("express");
const axios = require("axios");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Destination = require("../models/Destination");
const { sequelize } = require("../db/connect");
const { env } = require("../config/env");

const bookingRouter = express.Router();

// Paystack API configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_fake";
const PAYSTACK_API = "https://api.paystack.co";

const paystackAPI = axios.create({
  baseURL: PAYSTACK_API,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Generate unique booking reference
 */
const generateBookingReference = () => {
  return `TBT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * GET /api/tours
 * Get all active tours
 */
bookingRouter.get("/tours", async (req, res) => {
  try {
    const tours = await Tour.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["itinerary", "included", "excluded"],
      },
    });

    return res.json({
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (error) {
    console.error("[GET TOURS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve tours" });
  }
});

/**
 * GET /api/tours/:id
 * Get single tour details
 */
bookingRouter.get("/tours/:id", async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    return res.json({
      message: "Tour retrieved successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[GET TOUR DETAIL ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve tour" });
  }
});

/**
 * POST /api/tours
 * Create a new tour (admin only)
 */
bookingRouter.post("/tours", authMiddleware(env.jwtSecret), adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      price,
      pricePerPerson,
      duration,
      tourType,
      maxPassengers,
      image,
      highlights,
      included,
      excluded,
      itinerary,
      bestTime,
      customizeInfo,
      pleaseNote,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !description) {
      return res.status(400).json({
        error: "Missing required fields: title, slug, description",
      });
    }

    // Check if slug already exists
    const existingTour = await Tour.findOne({ where: { slug } });
    if (existingTour) {
      return res.status(409).json({ error: "Tour slug already exists" });
    }

    const tour = await Tour.create({
      title,
      slug,
      description,
      shortDescription,
      price: price || 0,
      pricePerPerson,
      duration,
      tourType,
      maxPassengers,
      image,
      highlights: highlights || [],
      included: included || [],
      excluded: excluded || [],
      itinerary: itinerary || [],
      bestTime,
      customizeInfo,
      pleaseNote,
      isActive: true,
    });

    return res.status(201).json({
      message: "Tour created successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[CREATE TOUR ERROR]", error);
    return res.status(500).json({ error: "Failed to create tour" });
  }
});

/**
 * PUT /api/tours/:id
 * Update a tour (admin only)
 */
bookingRouter.put("/tours/:id", authMiddleware(env.jwtSecret), adminMiddleware, async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Update fields
    const {
      title,
      slug,
      description,
      shortDescription,
      price,
      pricePerPerson,
      duration,
      tourType,
      maxPassengers,
      image,
      highlights,
      included,
      excluded,
      itinerary,
      bestTime,
      customizeInfo,
      pleaseNote,
      isActive,
    } = req.body;

    // Check if slug is being changed and if new slug exists
    if (slug && slug !== tour.slug) {
      const existingTour = await Tour.findOne({ where: { slug } });
      if (existingTour) {
        return res.status(409).json({ error: "Tour slug already exists" });
      }
    }

    // Update tour
    await tour.update({
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(shortDescription && { shortDescription }),
      ...(price !== undefined && { price }),
      ...(pricePerPerson !== undefined && { pricePerPerson }),
      ...(duration && { duration }),
      ...(tourType && { tourType }),
      ...(maxPassengers !== undefined && { maxPassengers }),
      ...(image && { image }),
      ...(highlights && { highlights }),
      ...(included && { included }),
      ...(excluded && { excluded }),
      ...(itinerary && { itinerary }),
      ...(bestTime && { bestTime }),
      ...(customizeInfo && { customizeInfo }),
      ...(pleaseNote && { pleaseNote }),
      ...(isActive !== undefined && { isActive }),
    });

    return res.json({
      message: "Tour updated successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[UPDATE TOUR ERROR]", error);
    return res.status(500).json({ error: "Failed to update tour" });
  }
});

/**
 * DELETE /api/tours/:id
 * Delete a tour (admin only)
 */
bookingRouter.delete("/tours/:id", authMiddleware(env.jwtSecret), adminMiddleware, async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Soft delete by marking as inactive
    await tour.update({ isActive: false });

    return res.json({
      message: "Tour deleted successfully",
      data: tour,
    });
  } catch (error) {
    console.error("[DELETE TOUR ERROR]", error);
    return res.status(500).json({ error: "Failed to delete tour" });
  }
});

/**
 * GET /api/destinations
 * Get all active destinations
 */
bookingRouter.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Destinations retrieved successfully",
      data: destinations,
    });
  } catch (error) {
    console.error("[GET DESTINATIONS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve destinations" });
  }
});

/**
 * GET /api/destinations/:id
 * Get single destination details
 */
bookingRouter.get("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    return res.json({
      message: "Destination retrieved successfully",
      data: destination,
    });
  } catch (error) {
    console.error("[GET DESTINATION ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve destination" });
  }
});

/**
 * POST /api/destinations
 * Create a new destination (admin only)
 */
bookingRouter.post("/destinations", authMiddleware(env.jwtSecret), adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      duration,
      image,
      highlights,
      included,
      excluded,
      itinerary,
      bestTime,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !description) {
      return res.status(400).json({
        error: "Missing required fields: title, slug, description",
      });
    }

    // Check if slug already exists
    const existingDest = await Destination.findOne({ where: { slug } });
    if (existingDest) {
      return res.status(409).json({ error: "Destination slug already exists" });
    }

    const destination = await Destination.create({
      title,
      slug,
      description,
      shortDescription,
      duration,
      image,
      highlights: highlights || [],
      included: included || [],
      excluded: excluded || [],
      itinerary: itinerary || [],
      bestTime,
      isActive: true,
    });

    return res.status(201).json({
      message: "Destination created successfully",
      data: destination,
    });
  } catch (error) {
    console.error("[CREATE DESTINATION ERROR]", error);
    return res.status(500).json({ error: "Failed to create destination" });
  }
});

/**
 * PUT /api/destinations/:id
 * Update a destination (admin only)
 */
bookingRouter.put("/destinations/:id", authMiddleware(env.jwtSecret), adminMiddleware, async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const {
      title,
      slug,
      description,
      shortDescription,
      duration,
      image,
      highlights,
      included,
      excluded,
      itinerary,
      bestTime,
      isActive,
    } = req.body;

    // Check if slug is being changed and if new slug exists
    if (slug && slug !== destination.slug) {
      const existingDest = await Destination.findOne({ where: { slug } });
      if (existingDest) {
        return res.status(409).json({ error: "Destination slug already exists" });
      }
    }

    // Update destination
    await destination.update({
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(shortDescription && { shortDescription }),
      ...(duration && { duration }),
      ...(image && { image }),
      ...(highlights && { highlights }),
      ...(included && { included }),
      ...(excluded && { excluded }),
      ...(itinerary && { itinerary }),
      ...(bestTime && { bestTime }),
      ...(isActive !== undefined && { isActive }),
    });

    return res.json({
      message: "Destination updated successfully",
      data: destination,
    });
  } catch (error) {
    console.error("[UPDATE DESTINATION ERROR]", error);
    return res.status(500).json({ error: "Failed to update destination" });
  }
});

/**
 * DELETE /api/destinations/:id
 * Delete a destination (admin only)
 */
bookingRouter.delete("/destinations/:id", authMiddleware(env.jwtSecret), adminMiddleware, async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Soft delete by marking as inactive
    await destination.update({ isActive: false });

    return res.json({
      message: "Destination deleted successfully",
      data: destination,
    });
  } catch (error) {
    console.error("[DELETE DESTINATION ERROR]", error);
    return res.status(500).json({ error: "Failed to delete destination" });
  }
});

/**
 * POST /api/bookings
 * Create new booking and initialize Paystack payment
 */
bookingRouter.post("/bookings", authMiddleware(env.jwtSecret), async (req, res) => {
  console.log('[BOOKING] Request received');
  const transaction = await sequelize.transaction();
  try {
    const {
      tourId,
      tourDate,
      numberOfPassengers,
      specialRequests,
      accommodationPreferences,
      passengerDetails,
    } = req.body;

    console.log('[BOOKING] Request body:', { tourId, tourDate, numberOfPassengers });

    // Validation
    if (!tourId || !tourDate || !numberOfPassengers) {
      console.log('[BOOKING] Validation failed');
      return res.status(400).json({
        error: "Missing required fields: tourId, tourDate, numberOfPassengers",
      });
    }

    // Get tour
    console.log('[BOOKING] Fetching tour ID:', tourId);
    const tour = await Tour.findByPk(tourId);
    if (!tour) {
      console.log('[BOOKING] Tour not found');
      return res.status(404).json({ error: "Tour not found" });
    }

    // Calculate total price
    const totalPrice = tour.pricePerPerson
      ? parseFloat(tour.pricePerPerson) * numberOfPassengers
      : parseFloat(tour.price);

    console.log('[BOOKING] Total price:', totalPrice);

    // Create booking with pending payment status
    console.log('[BOOKING] Creating booking record...');
    const booking = await Booking.create(
      {
        userId: req.user.id,
        tourId,
        bookingReference: generateBookingReference(),
        tourDate: new Date(tourDate),
        numberOfPassengers,
        totalPrice,
        status: "pending",
        paymentStatus: "pending",
        paystackReference: null,
        specialRequests,
        accommodationPreferences,
        passengerDetails,
      },
      { transaction }
    );

    console.log('[BOOKING] Booking created:', booking.id);

    await transaction.commit();

    console.log(
      `[BOOKING CREATED] Reference: ${booking.bookingReference}, User: ${req.user.email}, Amount: R${totalPrice}`
    );

    return res.status(201).json({
      success: true,
      message: "Booking created, proceed to payment",
      data: {
        booking,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        totalPrice
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("[CREATE BOOKING ERROR]", error.message);
    return res.status(500).json({ error: "Failed to create booking" });
  }
});

/**
 * POST /api/plan-bookings
 * Create booking for Plan packages (doesn't require tourId)
 */
bookingRouter.post("/plan-bookings", authMiddleware(env.jwtSecret), async (req, res) => {
  console.log('[PLAN BOOKING] Request received');
  const transaction = await sequelize.transaction();
  try {
    const {
      packageName,
      packagePrice,
      preferredDate,
      numberOfPassengers,
      vehicle,
      specialRequests,
      accommodation,
      type
    } = req.body;

    console.log('[PLAN BOOKING] Request body:', { packageName, packagePrice, numberOfPassengers, preferredDate });

    // Validation
    if (!packageName || !preferredDate || !numberOfPassengers) {
      console.log('[PLAN BOOKING] Validation failed');
      return res.status(400).json({
        error: "Missing required fields: packageName, preferredDate, numberOfPassengers",
      });
    }

    // Parse price (remove R or currency symbols if present)
    let totalPrice = parseFloat(String(packagePrice).replace(/[^\d.]/g, '')) || 0;
    if (totalPrice === 0) {
      totalPrice = 0; // Contact for pricing
    }

    console.log('[PLAN BOOKING] Total price:', totalPrice);

    // Create plan booking
    console.log('[PLAN BOOKING] Creating booking record...');
    const booking = await Booking.create(
      {
        userId: req.user.id,
        tourId: null, // No specific tour for plan packages
        bookingReference: generateBookingReference(),
        tourDate: new Date(preferredDate),
        numberOfPassengers,
        totalPrice,
        status: "pending",
        paymentStatus: "unpaid",
        specialRequests,
        accommodationPreferences: { vehicle, accommodation },
        notes: `Plan Package: ${packageName}`,
      },
      { transaction }
    );

    console.log('[PLAN BOOKING] Booking created:', booking.id);

    await transaction.commit();

    console.log(
      `[PLAN BOOKING CREATED] Reference: ${booking.bookingReference}, User: ${req.user.email}, Package: ${packageName}, Amount: R${totalPrice}`
    );

    return res.status(201).json({
      success: true,
      message: "Plan booking created, proceed to payment",
      data: {
        booking,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        totalPrice
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("[CREATE PLAN BOOKING ERROR]", error.message);
    return res.status(500).json({ error: "Failed to create plan booking" });
  }
});

/**
 * POST /api/bookings/:id/confirm-payment
 * Confirm booking after successful Paystack payment
 */
bookingRouter.post(
  "/bookings/:id/confirm-payment",
  authMiddleware,
  async (req, res) => {
    try {
      const booking = await Booking.findByPk(req.params.id);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Verify user owns booking
      if (booking.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Verify payment with Paystack
      if (!booking.paystackReference) {
        return res
          .status(400)
          .json({ error: "No Paystack reference found for this booking" });
      }

      try {
        const verifyResponse = await paystackAPI.get(
          `/transaction/verify/${booking.paystackReference}`
        );

        if (!verifyResponse.data.status || !verifyResponse.data.data) {
          return res.status(400).json({
            error: "Payment verification failed",
          });
        }

        const paymentData = verifyResponse.data.data;

        if (paymentData.status !== "success") {
          return res.status(400).json({
            error: `Payment not completed. Status: ${paymentData.status}`,
          });
        }

        // Update booking status
        booking.status = "confirmed";
        booking.paymentStatus = "paid";
        booking.confirmationEmailSent = true;
        await booking.save();

        console.log(
          `[BOOKING CONFIRMED] Reference: ${booking.bookingReference}, Paystack Status: ${paymentData.status}`
        );

        return res.json({
          message: "Booking confirmed successfully",
          data: booking,
        });
      } catch (verifyError) {
        console.error("[PAYSTACK VERIFY ERROR]", verifyError.message);
        return res.status(500).json({
          error: "Failed to verify payment: " + verifyError.message,
        });
      }
    } catch (error) {
      console.error("[CONFIRM PAYMENT ERROR]", error);
      return res.status(500).json({ error: "Failed to confirm payment" });
    }
  }
);

/**
 * GET /api/bookings
 * Get current user's bookings
 */
bookingRouter.get("/bookings", authMiddleware(env.jwtSecret), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Tour,
          attributes: ["id", "title", "duration", "image", "price"],
        },
      ],
      order: [["tourDate", "DESC"]],
    });

    return res.json({
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("[GET BOOKINGS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});

/**
 * GET /api/bookings/:id
 * Get booking details
 */
bookingRouter.get("/bookings/:id", authMiddleware(env.jwtSecret), async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Tour,
          attributes: [
            "id",
            "title",
            "duration",
            "image",
            "price",
            "description",
            "highlights",
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Verify user owns booking
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("[GET BOOKING DETAIL ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve booking" });
  }
});

/**
 * PUT /api/bookings/:id
 * Update booking (before confirmation only)
 */
bookingRouter.put("/bookings/:id", authMiddleware(env.jwtSecret), async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Verify user owns booking
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Can only update if pending
    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Can only update pending bookings" });
    }

    const { specialRequests, accommodationPreferences, passengerDetails } =
      req.body;

    booking.specialRequests = specialRequests || booking.specialRequests;
    booking.accommodationPreferences =
      accommodationPreferences || booking.accommodationPreferences;
    booking.passengerDetails = passengerDetails || booking.passengerDetails;

    await booking.save();

    console.log(
      `[BOOKING UPDATED] Reference: ${booking.bookingReference}, User: ${req.user.email}`
    );

    return res.json({
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("[UPDATE BOOKING ERROR]", error);
    return res.status(500).json({ error: "Failed to update booking" });
  }
});

/**
 * POST /api/bookings/:id/cancel
 * Cancel booking and refund payment
 */
bookingRouter.post("/bookings/:id/cancel", authMiddleware(env.jwtSecret), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Verify user owns booking
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Can't cancel completed or already cancelled bookings
    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({
        error: `Cannot cancel a ${booking.status} booking`,
      });
    }

    const { cancellationReason } = req.body;

    // Refund if paid
    if (booking.paymentStatus === "paid" && booking.paystackReference) {
      try {
        // Verify payment status first
        const verifyResponse = await paystackAPI.get(
          `/transaction/verify/${booking.paystackReference}`
        );

        if (
          verifyResponse.data.status &&
          verifyResponse.data.data.status === "success"
        ) {
          // Create refund
          const refundResponse = await paystackAPI.post("/refund", {
            transaction: booking.paystackReference,
          });

          if (refundResponse.data.status) {
            booking.paymentStatus = "refunded";
            console.log(
              `[REFUND PROCESSED] Reference: ${booking.bookingReference}, Amount: R${booking.totalPrice}`
            );
          }
        }
      } catch (refundError) {
        console.error("[REFUND ERROR]", refundError.message);
        // Continue with cancellation even if refund fails
      }
    }

    // Update booking status
    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason;
    booking.cancellationDate = new Date();

    await booking.save({ transaction });
    await transaction.commit();

    console.log(
      `[BOOKING CANCELLED] Reference: ${booking.bookingReference}, User: ${req.user.email}`
    );

    return res.json({
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("[CANCEL BOOKING ERROR]", error);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
});

module.exports = bookingRouter;
