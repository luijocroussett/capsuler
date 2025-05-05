const { generateToken, verifyToken } = require("../utils/authUtils");
const redisClient = require("../redisClient");

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const isBlackListed = await redisClient.get(`bl_${token}`);

    if (isBlackListed) {
      throw new Error("Token is blacklisted");
    }

    const decoded = await verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.message === "Token is blacklisted") {
      console.error("Token is blacklisted:", err);
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      console.error("Token verification error:", err);
      res.status(403).json({ error: "Forbidden" });
    }
  }
};
