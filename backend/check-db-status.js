#!/usr/bin/env node

/**
 * Database Status Checker
 * Shows current database state without making changes
 */

const fs = require('fs');
const path = require('path');

// Check which .env file to use
let envFile = '.env.develop';
if (fs.existsSync(path.join(__dirname, '.env.production'))) {
  envFile = '.env.production';
}

require('dotenv').config({ path: envFile });

const { sequelize } = require('./src/db/connect');

async function checkDatabase() {
  try {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  TB Tours - Database Status Report             ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    console.log(`Environment: ${envFile}\n`);

    await sequelize.authenticate();
    console.log('✓ Database connection successful\n');

    // Get statistics
    const User = sequelize.models.User;
    const Booking = sequelize.models.Booking;
    const Tour = sequelize.models.Tour;
    const Destination = sequelize.models.Destination;

    const userCount = await User.count();
    const bookingCount = await Booking.count();
    const tourCount = await Tour.count();
    const destCount = await Destination.count();

    console.log('📊 Database Statistics:');
    console.log(`  • Users: ${userCount}`);
    console.log(`  • Bookings: ${bookingCount}`);
    console.log(`  • Tours: ${tourCount}`);
    console.log(`  • Destinations: ${destCount}\n`);

    // List all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'verified', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    if (users.length > 0) {
      console.log('👥 Users in Database:');
      console.log('┌─────┬────────────────────────────────┬──────────────────┬─────────┬──────────┐');
      console.log('│ ID  │ Email                          │ Name             │ Role    │ Verified │');
      console.log('├─────┼────────────────────────────────┼──────────────────┼─────────┼──────────┤');
      
      users.forEach(user => {
        const email = (user.email || '').padEnd(30);
        const name = `${user.firstName} ${user.lastName}`.substring(0, 16).padEnd(16);
        const role = (user.role || 'customer').padEnd(7);
        const verified = user.verified ? '✓' : '✗';
        console.log(`│ ${String(user.id).padEnd(3)} │ ${email} │ ${name} │ ${role} │ ${verified.padEnd(8)} │`);
      });
      
      console.log('└─────┴────────────────────────────────┴──────────────────┴─────────┴──────────┘\n');

      // Admin Summary
      const adminUsers = users.filter(u => u.role === 'admin');
      console.log('🔐 Admin Users:');
      if (adminUsers.length > 0) {
        adminUsers.forEach(user => {
          const verified = user.verified ? '✓ Verified' : '✗ Not Verified';
          console.log(`  • ${user.email} (${verified})`);
        });
      } else {
        console.log('  ⚠ No admin users found\n');
        console.log('  Recommended action: Run setup script to set admin users');
      }
      console.log();

      // Check for test data
      if (bookingCount > 0 || tourCount > 0 || destCount > 0) {
        console.log('⚠️  Test Data Detected:');
        if (bookingCount > 0) console.log(`  • ${bookingCount} booking(s)`);
        if (tourCount > 0) console.log(`  • ${tourCount} tour(s)`);
        if (destCount > 0) console.log(`  • ${destCount} destination(s)`);
        console.log('\n  Recommended action: Run cleanup script to remove test data\n');
      } else {
        console.log('✓ Database is clean (no test data)\n');
      }
    } else {
      console.log('⚠ No users in database\n');
      console.log('Recommended action: Register users before running setup\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
