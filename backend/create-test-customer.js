require('dotenv').config({ path: '.env.develop' });
const { sequelize } = require('./src/db/connect');
const User = require('./src/models/User');
const { hashPassword } = require('./src/auth/passwordHash');

const createTestCustomer = async () => {
  try {
    console.log('[CREATE USER] Connecting to database...');
    await sequelize.authenticate();
    console.log('[CREATE USER] Connected successfully');

    // Create test customer user
    const passwordHash = await hashPassword('Test@12345');
    
    const user = await User.create({
      firstName: 'Test',
      lastName: 'Customer',
      email: 'testcustomer@example.com',
      passwordHash: passwordHash,
      role: 'customer',
      verified: true // Pre-verified so they can book immediately
    });

    console.log('[CREATE USER] ✅ Test customer created successfully!');
    console.log('[CREATE USER] Email:', user.email);
    console.log('[CREATE USER] Password: Test@12345');
    console.log('[CREATE USER] User ID:', user.id);
    
    await sequelize.close();
    console.log('[CREATE USER] Database connection closed');
  } catch (error) {
    console.error('[CREATE USER] Error:', error.message);
    process.exit(1);
  }
};

createTestCustomer();
