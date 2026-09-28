const { sequelize } = require('./src/db/connect');
require('./src/models/User');

async function setAdmin(email) {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    const User = sequelize.models.User;
    const normalizedEmail = email.toLowerCase();
    
    const user = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', normalizedEmail))
    });
    
    if (!user) {
      console.log(`✗ User with email "${email}" not found`);
      process.exit(1);
    }

    await user.update({ role: 'admin' });
    console.log(`✓ User "${normalizedEmail}" is now an admin`);
    console.log(`  - Role: ${user.role}`);
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'princetancu06@gmail.com';
console.log(`Setting admin role for: ${email}...\n`);
setAdmin(email);
