const { Sequelize } = require('sequelize');
const { env } = require('../config/env');

// Support both PostgreSQL (Render) and MySQL (local development)
let sequelize;

if (env.databaseUrl) {
  // Use PostgreSQL via DATABASE_URL (Render production)
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
} else {
  // Use MySQL (local development)
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
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    const dbType = env.databaseUrl ? 'PostgreSQL' : 'MySQL';
    const dbName = env.databaseUrl ? 'remote' : env.mysqlDatabase;
    console.log(`[DB] Connected successfully to ${dbType} (${dbName})`);
    
    // Sync models with database
    await sequelize.sync({ alter: false });
    console.log('[DB] Models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('[DB Connection Error]', error.message);
    throw new Error('Database connection failed');
  }
};

module.exports = { sequelize, connectDB };
