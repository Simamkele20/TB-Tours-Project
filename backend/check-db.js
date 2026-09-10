const { sequelize } = require('./src/db/connect');
require('./src/models/User');

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    const User = sequelize.models.User;
    const users = await User.findAll();
    
    console.log(`\n📋 Total users in database: ${users.length}`);
    console.log('\nUsers:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   - FirstName: ${user.firstName}`);
      console.log(`   - LastName: ${user.lastName}`);
      console.log(`   - Verified: ${user.verified}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Hash: ${user.passwordHash.substring(0, 20)}...`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
