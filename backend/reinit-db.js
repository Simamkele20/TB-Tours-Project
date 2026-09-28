const { sequelize } = require('./src/db/connect');
require('./src/models/User');

async function reinitializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    console.log('🔄 Dropping existing tables...');
    await sequelize.drop();
    console.log('✓ Tables dropped');

    console.log('🔄 Creating new tables with correct schema...');
    await sequelize.sync();
    console.log('✓ Database reinitialized successfully');
    
    console.log('\n✅ Database ready! You can now register a new account.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reinitializing database:', error.message);
    process.exit(1);
  }
}

console.log('Reinitializing database with correct schema...\n');
reinitializeDatabase();
