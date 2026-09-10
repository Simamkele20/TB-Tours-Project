/**
 * Comprehensive Test Data Seeder
 * Creates 20 test users with various bookings
 * Usage: node seed-test-data.js
 */

require("dotenv").config({ path: ".env.develop" });

const { sequelize } = require("./src/db/connect");
const User = require("./src/models/User");
const Tour = require("./src/models/Tour");
const Booking = require("./src/models/Booking");
const { hashPassword } = require("./src/auth/passwordHash");

// Test user names
const testUsers = [
  { firstName: "John", lastName: "Smith", role: "customer", verified: true },
  { firstName: "Sarah", lastName: "Johnson", role: "customer", verified: true },
  { firstName: "Michael", lastName: "Brown", role: "customer", verified: false },
  { firstName: "Emily", lastName: "Davis", role: "customer", verified: true },
  { firstName: "David", lastName: "Wilson", role: "customer", verified: true },
  { firstName: "Jessica", lastName: "Miller", role: "customer", verified: false },
  { firstName: "Robert", lastName: "Moore", role: "customer", verified: true },
  { firstName: "Amanda", lastName: "Taylor", role: "customer", verified: true },
  { firstName: "James", lastName: "Anderson", role: "customer", verified: true },
  { firstName: "Lisa", lastName: "Thomas", role: "customer", verified: false },
  { firstName: "William", lastName: "Jackson", role: "customer", verified: true },
  { firstName: "Karen", lastName: "White", role: "customer", verified: true },
  { firstName: "Richard", lastName: "Harris", role: "customer", verified: true },
  { firstName: "Patricia", lastName: "Martin", role: "customer", verified: false },
  { firstName: "Charles", lastName: "Thompson", role: "customer", verified: true },
  { firstName: "Barbara", lastName: "Garcia", role: "customer", verified: true },
  { firstName: "Thomas", lastName: "Martinez", role: "customer", verified: true },
  { firstName: "Susan", lastName: "Robinson", role: "customer", verified: false },
  { firstName: "Christopher", lastName: "Clark", role: "admin", verified: true },
  { firstName: "Jennifer", lastName: "Rodriguez", role: "admin", verified: true },
];

// Booking statuses and payment statuses combinations
const bookingScenarios = [
  { status: "completed", paymentStatus: "paid", label: "Completed & Paid" },
  { status: "completed", paymentStatus: "paid", label: "Completed & Paid" },
  { status: "confirmed", paymentStatus: "paid", label: "Confirmed & Paid" },
  { status: "confirmed", paymentStatus: "paid", label: "Confirmed & Paid" },
  { status: "confirmed", paymentStatus: "pending", label: "Confirmed & Pending Payment" },
  { status: "pending", paymentStatus: "unpaid", label: "Pending & Unpaid" },
  { status: "pending", paymentStatus: "unpaid", label: "Pending & Unpaid" },
  { status: "cancelled", paymentStatus: "refunded", label: "Cancelled & Refunded" },
  { status: "completed", paymentStatus: "paid", label: "Completed & Paid" },
  { status: "confirmed", paymentStatus: "paid", label: "Confirmed & Paid" },
];

const generateBookingReference = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK-${timestamp}-${random}`;
};

const getRandomDate = (daysOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset + Math.floor(Math.random() * 60) - 30);
  return date;
};

const seedTestData = async () => {
  try {
    console.log("[TEST DATA] Connecting to database...");
    await sequelize.authenticate();
    console.log("[TEST DATA] Connected successfully");

    // Sync database
    await sequelize.sync();
    console.log("[TEST DATA] Tables synced");

    // Get existing tours
    console.log("[TEST DATA] Fetching available tours...");
    const tours = await Tour.findAll();
    if (tours.length === 0) {
      console.error("[ERROR] No tours found. Please run seed-tours.js first");
      process.exit(1);
    }
    console.log(`[TEST DATA] Found ${tours.length} tours`);

    // Create 20 test users
    console.log("[TEST DATA] Creating 20 test users...");
    const createdUsers = [];
    const defaultPassword = await hashPassword("TestPassword123!");

    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i];
      const user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}@tbtours.test`,
        passwordHash: defaultPassword,
        verified: userData.verified,
        role: userData.role,
      });
      createdUsers.push(user);
      console.log(`  ✓ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }

    // Create multiple bookings for each user
    console.log("\n[TEST DATA] Creating test bookings...");
    const bookingsCreated = [];
    let totalBookingCount = 0;

    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      // Each customer gets 1-3 bookings, admins get 0-2
      const userBookingCount = user.role === "admin"
        ? Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < userBookingCount; j++) {
        const scenario = bookingScenarios[Math.floor(Math.random() * bookingScenarios.length)];
        const tour = tours[Math.floor(Math.random() * tours.length)];
        const passengers = Math.floor(Math.random() * 4) + 1;
        const totalPrice = (tour.price || 650) * passengers;

        // Generate booking dates - mix of past, present, and future
        let tourDate;
        if (scenario.status === "completed") {
          // Completed bookings are in the past (1-90 days ago)
          tourDate = getRandomDate(-Math.floor(Math.random() * 90) - 1);
        } else if (scenario.status === "cancelled") {
          // Cancelled bookings are varied dates
          tourDate = getRandomDate(-Math.floor(Math.random() * 60));
        } else if (scenario.status === "confirmed") {
          // Confirmed bookings are mostly in the future (1-60 days)
          tourDate = getRandomDate(Math.floor(Math.random() * 60) + 1);
        } else {
          // Pending bookings are in the near future (1-30 days)
          tourDate = getRandomDate(Math.floor(Math.random() * 30) + 1);
        }

        const booking = await Booking.create({
          userId: user.id,
          tourId: tour.id,
          bookingReference: generateBookingReference(),
          tourDate: tourDate,
          numberOfPassengers: passengers,
          totalPrice: totalPrice,
          status: scenario.status,
          paymentStatus: scenario.paymentStatus,
          specialRequests: Math.random() > 0.7 ? "Please arrange pickup from airport" : null,
        });

        bookingsCreated.push(booking);
        totalBookingCount++;

        console.log(
          `  ✓ Booking ${booking.bookingReference}: ${user.firstName} ${user.lastName} - ` +
          `${tour.title} (${scenario.label}) - ${passengers} passengers - $${totalPrice}`
        );
      }
    }

    console.log("\n[TEST DATA] ====================================");
    console.log(`[TEST DATA] Test data seeding completed!`);
    console.log("[TEST DATA] ====================================");
    console.log(`[TEST DATA] Users created: ${createdUsers.length}`);
    console.log(`[TEST DATA] Bookings created: ${totalBookingCount}`);
    console.log("\n[TEST DATA] Test Login Credentials:");
    console.log("[TEST DATA] ====================================");
    console.log("[TEST DATA] Admin Users:");
    testUsers
      .filter((u) => u.role === "admin")
      .forEach((u) => {
        console.log(`  Email: ${u.firstName.toLowerCase()}.${u.lastName.toLowerCase()}@tbtours.test`);
      });
    console.log("\n[TEST DATA] Customer Users (Sample):");
    testUsers
      .slice(0, 5)
      .forEach((u) => {
        console.log(`  Email: ${u.firstName.toLowerCase()}.${u.lastName.toLowerCase()}@tbtours.test`);
      });
    console.log("[TEST DATA] Password: TestPassword123!");
    console.log("[TEST DATA] ====================================\n");

    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Failed to seed test data:", error);
    process.exit(1);
  }
};

seedTestData();
