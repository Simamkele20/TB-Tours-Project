/**
 * Production Setup Script
 * - Cleans test data from database
 * - Sets admin users (princetancu06@gmail.com + tb-tours.co.za domain)
 * - Prepares database for production
 */

require("dotenv").config({ path: ".env.production" });

const { sequelize } = require("./src/db/connect");
const User = require("./src/models/User");

async function setupProduction() {
  try {
    await sequelize.authenticate();
    console.log("\n[PRODUCTION SETUP] Connected to database");

    // ========================================
    // STEP 1: Clean test data
    // ========================================
    console.log("\n[STEP 1] Cleaning test data...");
    
    // Disable foreign key constraints for SQLite
    await sequelize.query("PRAGMA foreign_keys = OFF");
    console.log("  ✓ Foreign key constraints disabled");

    // Truncate tables in correct order
    console.log("  ✓ Clearing bookings...");
    await sequelize.query("DELETE FROM bookings");
    
    console.log("  ✓ Clearing tours...");
    await sequelize.query("DELETE FROM tours");
    
    console.log("  ✓ Clearing destinations...");
    await sequelize.query("DELETE FROM destinations");

    // Re-enable foreign key constraints
    await sequelize.query("PRAGMA foreign_keys = ON");
    console.log("  ✓ Foreign key constraints re-enabled");
    console.log("  ✓ Test data cleaned successfully!");

    // ========================================
    // STEP 2: Set admin users
    // ========================================
    console.log("\n[STEP 2] Setting admin users...");
    
    // Admin email 1: princetancu06@gmail.com
    const managerEmail = 'princetancu06@gmail.com';
    const manager = await sequelize.models.User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        sequelize.fn('LOWER', managerEmail)
      )
    });

    if (manager) {
      if (manager.role !== 'admin') {
        await manager.update({ role: 'admin' });
        console.log(`  ✓ Set admin: ${manager.email}`);
      } else {
        console.log(`  ✓ Already admin: ${manager.email}`);
      }
    } else {
      console.log(`  ⚠ User not found: ${managerEmail}`);
    }

    // Admin emails 2: All tb-tours.co.za domain
    const tbToursDomain = 'tb-tours.co.za';
    console.log(`  → Setting admin for @${tbToursDomain} domain...`);
    
    const { Op } = require('sequelize');
    const tbToursUsers = await sequelize.models.User.findAll({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        Op.like,
        `%@${tbToursDomain.toLowerCase()}`
      )
    });

    if (tbToursUsers.length > 0) {
      for (const user of tbToursUsers) {
        if (user.role !== 'admin') {
          await user.update({ role: 'admin' });
          console.log(`    ✓ Set admin: ${user.email}`);
        } else {
          console.log(`    ✓ Already admin: ${user.email}`);
        }
      }
    } else {
      console.log(`    ⚠ No users found with @${tbToursDomain} domain`);
    }

    // ========================================
    // STEP 3: Summary
    // ========================================
    console.log("\n[STEP 3] Summary...");
    
    const allUsers = await sequelize.models.User.findAll();
    console.log(`  Total users in database: ${allUsers.length}`);
    
    const adminUsers = allUsers.filter(u => u.role === 'admin');
    console.log(`  Admin users: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log("  Admin list:");
      adminUsers.forEach(user => {
        console.log(`    - ${user.email} (${user.firstName} ${user.lastName})`);
      });
    }

    console.log("\n✅ Production setup completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n[ERROR] Production setup failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setupProduction();
