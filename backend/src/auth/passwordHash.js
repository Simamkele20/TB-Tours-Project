const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
};

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error(`Failed to compare password: ${error.message}`);
  }
};

module.exports = { hashPassword, comparePassword };
