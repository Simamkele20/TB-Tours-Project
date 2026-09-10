const { verifyToken } = require("../auth/jwt");

const authMiddleware = (secret) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    const decoded = verifyToken(token, secret);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user to request
    req.user = decoded;
    next();
  };
};

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
