/**
 * Generate a random 6-digit verification code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate expiry time based on minutes
 */
const getCodeExpiry = (minutesFromNow = 15) => {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
};

module.exports = { generateVerificationCode, getCodeExpiry };
