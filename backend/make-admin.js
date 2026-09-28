const { sequelize } = require('./src/db/connect');
const User = require('./src/models/User').default || require('./src/models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Update all users to admin for testing
    await sequelize.models.User.update({ role: 'admin' }, { where: {} });
    
    // Get all users
    const users = await sequelize.models.User.findAll();
    console.log('Users:');
    users.forEach(user => {
      console.log(`  - ${user.email}: ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
