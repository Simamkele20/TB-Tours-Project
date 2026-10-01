#!/usr/bin/env node

/**
 * Database Setup Assistant
 * Guides user through cleaning DB and setting admin users
 * Supports both development and production environments
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  TB Tours - Production Database Setup          ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  // Check environment files
  const envProduction = path.join(__dirname, '.env.production');
  const envDevelop = path.join(__dirname, '.env.develop');
  const envMain = path.join(__dirname, '.env');

  let selectedEnv = '.env.develop';

  console.log('Available environments:');
  console.log('1. Development (.env.develop)');
  console.log('2. Production (.env.production)\n');

  const choice = await question('Select environment to clean [1/2]: ');

  if (choice === '2') {
    if (!fs.existsSync(envProduction)) {
      console.error('❌ .env.production not found');
      rl.close();
      process.exit(1);
    }
    selectedEnv = '.env.production';
  } else {
    if (!fs.existsSync(envDevelop)) {
      console.error('❌ .env.develop not found');
      rl.close();
      process.exit(1);
    }
    selectedEnv = '.env.develop';
  }

  console.log(`\n✓ Selected: ${selectedEnv}\n`);

  // Confirm destructive operation
  console.log('⚠️  WARNING: This will DELETE all test data from the database:');
  console.log('   • All bookings');
  console.log('   • All tours');
  console.log('   • All destinations');
  console.log('   • User data WILL be preserved\n');

  const confirm = await question('Continue? (yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Cancelled.');
    rl.close();
    process.exit(0);
  }

  // Load and run setup
  require('dotenv').config({ path: selectedEnv });

  const { sequelize } = require('./src/db/connect');
  const { Op } = require('sequelize');

  try {
    await sequelize.authenticate();
    console.log('\n✓ Connected to database\n');

    // ========================================
    // STEP 1: Clean test data
    // ========================================
    console.log('📊 STEP 1: Cleaning test data...\n');
    
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    const bookingResult = await sequelize.query('DELETE FROM bookings');
    console.log('  ✓ Cleared bookings');
    
    const tourResult = await sequelize.query('DELETE FROM tours');
    console.log('  ✓ Cleared tours');
    
    const destResult = await sequelize.query('DELETE FROM destinations');
    console.log('  ✓ Cleared destinations');

    await sequelize.query('PRAGMA foreign_keys = ON');
    console.log('  ✓ Foreign key constraints re-enabled\n');

    // ========================================
    // STEP 2: Set admin users
    // ========================================
    console.log('👤 STEP 2: Setting admin users...\n');
    
    // Set princetancu06@gmail.com as admin
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
      console.log('    → Register this user first to set as admin');
    }

    // Set tb-tours.co.za domain users as admin
    const tbToursDomain = 'tb-tours.co.za';
    console.log(`  → Finding users with @${tbToursDomain} domain...`);
    
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
    console.log('\n📋 SUMMARY\n');
    
    const allUsers = await sequelize.models.User.findAll({
      attributes: ['email', 'firstName', 'lastName', 'role', 'verified']
    });
    
    const adminUsers = allUsers.filter(u => u.role === 'admin');
    const customerUsers = allUsers.filter(u => u.role === 'customer');

    console.log(`Total users: ${allUsers.length}`);
    console.log(`  • Admin users: ${adminUsers.length}`);
    console.log(`  • Customer users: ${customerUsers.length}\n`);

    if (adminUsers.length > 0) {
      console.log('Admin Users:');
      adminUsers.forEach(user => {
        const verified = user.verified ? '✓' : '✗';
        console.log(`  [${verified}] ${user.email} (${user.firstName} ${user.lastName})`);
      });
      console.log();
    }

    console.log('✅ Setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Login with admin user to verify access');
    console.log('3. Check admin dashboard is accessible\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
