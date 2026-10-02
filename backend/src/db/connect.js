const { Sequelize } = require('sequelize');
const path = require('path');
const { env } = require('../config/env');

// Database selection logic:
// 1. DATABASE_URL (PostgreSQL on Render) - Production
// 2. MySQL credentials - Fallback production
// 3. SQLite - Development

let sequelize;

if (env.databaseUrl) {
  // Production with PostgreSQL (Render deployment)
  sequelize = new Sequelize(env.databaseUrl, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
  });
} else if (process.env.NODE_ENV === 'production') {
  // Production: Use MySQL fallback
  sequelize = new Sequelize(env.mysqlDatabase, env.mysqlUser, env.mysqlPassword, {
    host: env.mysqlHost,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Development: Use SQLite
  const dbPath = path.join(__dirname, '../../data', 'tb-tours.db');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log, // Enable logging to see queries
  });
}

const connectDB = async () => {
  try {
    // Determine which database is being used (for logging)
    let dbType = 'SQLite';
    if (env.databaseUrl) {
      dbType = 'PostgreSQL (remote)';
    } else if (process.env.NODE_ENV === 'production') {
      dbType = `MySQL (${env.mysqlDatabase})`;
    }
    console.log(`[DB] Attempting to connect to ${dbType}...`);
    
    // Import models to register them
    console.log('[DB] Loading models...');
    const User = require('../models/User');
    const Tour = require('../models/Tour');
    const Booking = require('../models/Booking');
    const Destination = require('../models/Destination');
    console.log('[DB] Models loaded successfully');

    // Set up model associations
    User.hasMany(Booking, { foreignKey: 'userId' });
    Booking.belongsTo(User, { foreignKey: 'userId' });

    Tour.hasMany(Booking, { foreignKey: 'tourId' });
    Booking.belongsTo(Tour, { foreignKey: 'tourId' });
    console.log('[DB] Model associations set up');

    console.log('[DB] Authenticating database connection...');
    await sequelize.authenticate();
    console.log(`[DB] Connected successfully to ${dbType}`);
    
    // Sync models with database
    console.log('[DB] Synchronizing models...');
    // Use alter: true for PostgreSQL (production), alter: false for SQLite (dev) due to limitations
    const alterSchema = env.databaseUrl ? true : false;
    await sequelize.sync({ alter: alterSchema });
    console.log('[DB] Models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('[DB Connection Error]', error.message);
    console.error('[DB Connection Error Stack]', error.stack);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await sequelize.close();
    console.log('[MySQL] Disconnected');
  } catch (error) {
    console.error('[MySQL Disconnect Error]', error.message);
  }
};

module.exports = { sequelize, connectDB, disconnectDB };
