const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const { sequelize } = require("../db/connect");
const { Op } = require("sequelize");

const adminRouter = express.Router();

/**
 * Middleware to check if user is admin
 */
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Authorization failed" });
  }
};

/**
 * GET /api/admin/users
 * Get all users (paginated)
 */
adminRouter.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        id: {
          [Op.ne]: req.user.id, // Exclude current logged-in user
        },
      },
      offset,
      limit,
      attributes: { exclude: ["passwordHash"] },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Users retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[ADMIN GET USERS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
});

/**
 * GET /api/admin/users/:id
 * Get single user details
 */
adminRouter.get("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("[ADMIN GET USER ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve user" });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user
 */
adminRouter.delete("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deleting yourself
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await user.destroy();
    console.log(`[ADMIN] User ${user.email} deleted by admin ${req.user.email}`);

    return res.json({
      message: "User deleted successfully",
      data: { email: user.email },
    });
  } catch (error) {
    console.error("[ADMIN DELETE USER ERROR]", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user details (role, etc)
 */
adminRouter.put("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { role, verified } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent changing your own role
    if (req.user.id === parseInt(req.params.id) && role && role !== user.role) {
      return res.status(400).json({ error: "Cannot change your own role" });
    }

    if (role) user.role = role;
    if (typeof verified === "boolean") user.verified = verified;

    await user.save();
    console.log(`[ADMIN] User ${user.email} updated by admin ${req.user.email}`);

    return res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("[ADMIN UPDATE USER ERROR]", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
});

/**
 * GET /api/admin/analytics
 * Get dashboard analytics
 */
adminRouter.get("/analytics", authMiddleware, adminOnly, async (req, res) => {
  try {
    // Exclude current user from all counts
    const whereClause = {
      id: {
        [Op.ne]: req.user.id,
      },
    };

    const totalUsers = await User.count({ where: whereClause });
    const verifiedUsers = await User.count({
      where: { ...whereClause, verified: true },
    });
    const unverifiedUsers = await User.count({
      where: { ...whereClause, verified: false },
    });
    const adminCount = await User.count({
      where: { ...whereClause, role: "admin" },
    });
    const customerCount = await User.count({
      where: { ...whereClause, role: "customer" },
    });

    // Users registered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usersToday = await User.count({
      where: {
        ...whereClause,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    // Users registered this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const usersThisMonth = await User.count({
      where: {
        ...whereClause,
        createdAt: {
          [Op.gte]: thisMonth,
        },
      },
    });

    return res.json({
      message: "Analytics retrieved successfully",
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          admins: adminCount,
          customers: customerCount,
        },
        registrations: {
          today: usersToday,
          thisMonth: usersThisMonth,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN ANALYTICS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve analytics" });
  }
});

/**
 * GET /api/admin/stats
 * Get quick statistics
 */
adminRouter.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) as customer_count
      FROM users
    `, { type: sequelize.QueryTypes.SELECT });

    return res.json({
      message: "Stats retrieved successfully",
      data: stats[0] || {},
    });
  } catch (error) {
    console.error("[ADMIN STATS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve stats" });
  }
});

/**
 * GET /api/admin/bookings
 * Get all bookings (paginated, with filters)
 */
adminRouter.get("/bookings", authMiddleware, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status; // Filter by status
    const paymentStatus = req.query.paymentStatus; // Filter by payment status

    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const { count, rows } = await Booking.findAndCountAll({
      where,
      offset,
      limit,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Tour,
          attributes: ["id", "title", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Bookings retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[ADMIN GET BOOKINGS ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});

/**
 * GET /api/admin/bookings/:id
 * Get booking details
 */
adminRouter.get("/bookings/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "verified"],
        },
        {
          model: Tour,
          attributes: [
            "id",
            "title",
            "price",
            "duration",
            "description",
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.json({
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("[ADMIN GET BOOKING DETAIL ERROR]", error);
    return res.status(500).json({ error: "Failed to retrieve booking" });
  }
});

/**
 * PUT /api/admin/bookings/:id
 * Update booking status
 */
adminRouter.put(
  "/bookings/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { status, notes } = req.body;
      const booking = await Booking.findByPk(req.params.id);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (status) {
        booking.status = status;
      }
      if (notes) {
        booking.notes = notes;
      }

      await booking.save();

      console.log(
        `[ADMIN] Booking ${booking.bookingReference} updated by admin ${req.user.email}`
      );

      return res.json({
        message: "Booking updated successfully",
        data: booking,
      });
    } catch (error) {
      console.error("[ADMIN UPDATE BOOKING ERROR]", error);
      return res.status(500).json({ error: "Failed to update booking" });
    }
  }
);

/**
 * GET /api/admin/bookings-analytics
 * Get booking analytics and stats
 */
adminRouter.get(
  "/bookings-analytics",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const totalBookings = await Booking.count();
      const pendingBookings = await Booking.count({
        where: { status: "pending" },
      });
      const confirmedBookings = await Booking.count({
        where: { status: "confirmed" },
      });
      const completedBookings = await Booking.count({
        where: { status: "completed" },
      });
      const cancelledBookings = await Booking.count({
        where: { status: "cancelled" },
      });

      const paidBookings = await Booking.count({
        where: { paymentStatus: "paid" },
      });
      const unpaidBookings = await Booking.count({
        where: { paymentStatus: "unpaid" },
      });

      // Total revenue
      const revenueResult = await sequelize.query(`
        SELECT SUM(totalPrice) as totalRevenue 
        FROM bookings 
        WHERE paymentStatus = 'paid'
      `, { type: sequelize.QueryTypes.SELECT });

      const totalRevenue = revenueResult[0]?.totalRevenue || 0;

      // Bookings this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      const bookingsThisMonth = await Booking.count({
        where: {
          createdAt: {
            [Op.gte]: thisMonth,
          },
        },
      });

      // Top tours
      const topTours = await sequelize.query(`
        SELECT 
          t.id, 
          t.title, 
          COUNT(b.id) as bookingCount, 
          SUM(b.totalPrice) as totalRevenue
        FROM tours t
        LEFT JOIN bookings b ON t.id = b.tourId
        GROUP BY t.id, t.title
        ORDER BY bookingCount DESC
        LIMIT 5
      `, { type: sequelize.QueryTypes.SELECT });

      return res.json({
        message: "Booking analytics retrieved successfully",
        data: {
          bookings: {
            total: totalBookings,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
          },
          payment: {
            paid: paidBookings,
            unpaid: unpaidBookings,
            totalRevenue: parseFloat(totalRevenue),
          },
          thisMonth: bookingsThisMonth,
          topTours,
        },
      });
    } catch (error) {
      console.error("[ADMIN BOOKINGS ANALYTICS ERROR]", error);
      return res
        .status(500)
        .json({ error: "Failed to retrieve booking analytics" });
    }
  }
);

module.exports = adminRouter;
