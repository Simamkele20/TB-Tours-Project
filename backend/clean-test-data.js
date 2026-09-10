/**
 * Clean Database Script
 * Properly removes all test data
 */

require("dotenv").config({ path: ".env.develop" });

const { sequelize } = require("./src/db/connect");

async function cleanDatabase() {
  try {
    await sequelize.authenticate();
    console.log("[DB] Connected to database");

    // Disable foreign key constraints for SQLite
    await sequelize.query("PRAGMA foreign_keys = OFF");
    console.log("[DB] Foreign key constraints disabled");

    // Truncate tables in correct order
    console.log("[DB] Clearing bookings...");
    await sequelize.query("DELETE FROM bookings");
    
    console.log("[DB] Clearing users...");
    await sequelize.query("DELETE FROM users");
    
    console.log("[DB] Clearing tours...");
    await sequelize.query("DELETE FROM tours");
    
    console.log("[DB] Clearing destinations...");
    await sequelize.query("DELETE FROM destinations");

    // Re-enable foreign key constraints
    await sequelize.query("PRAGMA foreign_keys = ON");
    console.log("[DB] Foreign key constraints re-enabled");

    console.log("\n✅ Database cleaned successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Failed to clean database:", error.message);
    process.exit(1);
  }
}

cleanDatabase();
