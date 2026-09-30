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
    // Import models to register them
    const User = require('../models/User');
    const Tour = require('../models/Tour');
    const Booking = require('../models/Booking');
    const Destination = require('../models/Destination');

    // Set up model associations
    User.hasMany(Booking, { foreignKey: 'userId' });
    Booking.belongsTo(User, { foreignKey: 'userId' });

    Tour.hasMany(Booking, { foreignKey: 'tourId' });
    Booking.belongsTo(Tour, { foreignKey: 'tourId' });

    await sequelize.authenticate();
    
    // Determine which database is being used
    let dbType = 'SQLite';
    if (env.databaseUrl) {
      dbType = 'PostgreSQL (remote)';
    } else if (process.env.NODE_ENV === 'production') {
      dbType = `MySQL (${env.mysqlDatabase})`;
    }
    console.log(`[DB] Connected successfully to ${dbType}`);
    
    // Sync models with database
    await sequelize.sync({ alter: false });
    console.log('[DB] Models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('[DB Connection Error]', error.message);
    throw new Error('Database connection failed');
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
