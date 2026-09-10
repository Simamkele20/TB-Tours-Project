const { Sequelize } = require('sequelize');
const { env } = require('../config/env');

const sequelize = new Sequelize(env.mysqlDatabase, env.mysqlUser, env.mysqlPassword, {
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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[MySQL] Connected successfully to ' + env.mysqlDatabase);
    
    // Sync models with database
    await sequelize.sync({ alter: false });
    console.log('[MySQL] Models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('[MySQL Connection Error]', error.message);
    throw new Error('Database connection failed');
  }
};

module.exports = { sequelize, connectDB };
