const path = require('path');
const { sequelize } = require('./src/db/connect');
require('./src/models/User');

async function deleteUser(email) {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    const User = sequelize.models.User;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log(`✗ User with email "${email}" not found`);
      process.exit(1);
    }

    await user.destroy();
    console.log(`✓ User "${email}" deleted successfully`);
    console.log('You can now register again with the same email');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error deleting user:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'princetancu06@gmail.com';
console.log(`Deleting user: ${email}...\n`);
deleteUser(email);
