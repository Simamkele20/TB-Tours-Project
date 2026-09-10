const { sequelize } = require('./src/db/connect');
const { hashPassword } = require('./src/auth/passwordHash');
require('./src/models/User');

async function addUser(email, password, firstName, lastName) {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    const User = sequelize.models.User;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', email))
    });
    
    if (existingUser) {
      console.log(`✗ User with email "${email}" already exists`);
      process.exit(1);
    }

    // Hash the password
    const passwordHash = await hashPassword(password);
    
    // Determine role based on email domain
    const normalizedEmail = email.toLowerCase();
    const role = normalizedEmail.endsWith('@tb-tours.co.za') ? 'admin' : 'customer';
    
    // Create the user
    const newUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      verified: true,
      role: role
    });

    console.log(`✓ User created successfully`);
    console.log(`  - Email: ${newUser.email}`);
    console.log(`  - Name: ${newUser.firstName} ${newUser.lastName}`);
    console.log(`  - Role: ${newUser.role}`);
    console.log(`  - Verified: ${newUser.verified}`);
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'admin@gmail.com';
const password = process.argv[3] || 'Admin!!12';
const firstName = process.argv[4] || 'Test';
const lastName = process.argv[5] || 'User';

console.log(`Adding user: ${email}...\n`);
addUser(email, password, firstName, lastName);
