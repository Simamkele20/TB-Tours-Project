const { sequelize } = require('./src/db/connect');
const User = require('./src/models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected');
    
    // Make all users admin
    await User.update({ role: 'admin' }, { where: {} });
    
    const users = await User.findAll();
    console.log('Users updated:');
    users.forEach(u => console.log(`  ${u.email}: ${u.role}`));
    
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
