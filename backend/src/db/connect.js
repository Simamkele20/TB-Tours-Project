const mongoose = require("mongoose");
const { env } = require("../config/env");

const maskMongoUri = (value) => {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    const host = parsed.hostname || "unknown-host";
    const dbName = parsed.pathname ? parsed.pathname.replace(/^\//, "") : "unknown-db";
    return `${parsed.protocol}//***:***@${host}/${dbName}`;
  } catch (_error) {
    return "[invalid MONGODB_URI]";
  }
};

const getModels = () => ({
  User: require("../models/User"),
  Booking: require("../models/Booking"),
  Tour: require("../models/Tour"),
  Destination: require("../models/Destination"),
});

const clearCollectionByTableName = async (tableName) => {
  const normalized = String(tableName || "").toLowerCase();
  const tableToModel = {
    users: getModels().User,
    bookings: getModels().Booking,
    tours: getModels().Tour,
    destinations: getModels().Destination,
  };

  const model = tableToModel[normalized];
  if (!model) {
    throw new Error(`Unsupported table in query: ${tableName}`);
  }

  const result = await model.deleteMany({});
  return [{ deletedCount: result.deletedCount }, null];
};

const sequelize = {
  // Compatibility shim for scripts that still call Sequelize-like APIs.
  get models() {
    return getModels();
  },
  async authenticate() {
    if (mongoose.connection.readyState === 1) return true;
    await connectDB();
    return true;
  },
  async sync() {
    // Mongoose manages schema at runtime; keep this as a no-op for compatibility.
    return true;
  },
  async close() {
    return mongoose.disconnect();
  },
  async query(statement) {
    const sql = String(statement || "").trim().replace(/;$/, "");
    const normalized = sql.toUpperCase();

    if (normalized.startsWith("PRAGMA FOREIGN_KEYS")) {
      return [[], null];
    }

    const deleteMatch = normalized.match(/^DELETE\s+FROM\s+([A-Z_][A-Z0-9_]*)$/);
    if (deleteMatch) {
      return clearCollectionByTableName(deleteMatch[1]);
    }

    throw new Error(`Unsupported raw query in MongoDB mode: ${statement}`);
  },
  transaction: async () => ({
    async commit() {},
    async rollback() {},
  }),
};

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (!env.mongoUri) {
      throw new Error("Missing MONGODB_URI. Set a MongoDB connection string in environment variables.");
    }

    console.log("[DB] Attempting to connect to MongoDB...");

    await mongoose.connect(env.mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[DB] Connected successfully to MongoDB (${mongoose.connection.name})`);
    return mongoose.connection;
  } catch (error) {
    console.error("[DB Connection Error]", error.message);
    console.error("[DB Connection Error Stack]", error.stack);
    console.error("[DB Connection Error] URI:", maskMongoUri(env.mongoUri));

    if (String(error.message || "").includes("ECONNREFUSED")) {
      console.error("[DB Connection Hint] MongoDB is not reachable at the configured host/port.");
      console.error("[DB Connection Hint] Start local MongoDB or set MONGODB_URI to your Atlas connection string.");
    }

    if (String(error.message || "").includes("ENOTFOUND")) {
      console.error("[DB Connection Hint] DNS resolution failed for your MongoDB host. Verify host/network/VPN settings.");
    }

    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("[DB] MongoDB disconnected");
  } catch (error) {
    console.error("[DB Disconnect Error]", error.message);
  }
};

module.exports = { sequelize, connectDB, disconnectDB };
