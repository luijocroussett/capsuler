const { generateToken, verifyToken } = require("../utils/authUtils");

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const redisClient = res.locals.redisClient;

  console.log("request received", req.method, req.baseUrl, req.url == "/" ? "" : req.url);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or invalid format");
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
    console.log("Token verified successfully");
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
