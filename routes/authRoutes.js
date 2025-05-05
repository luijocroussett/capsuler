const express = require("express");
const router = express.Router();
const redisClient = require("../redisClient");
const jwt = require("jsonwebtoken");
const validateUserCredentials = require("../middleware/validateUserCredentials");

router.post("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const { exp } = jwt.decode(token);
  const ttl = exp - Math.floor(Date.now() / 1000);
  if (ttl <= 0) {
    return res.status(401).json({ error: "Token expired" });
  }

  try {
    await redisClient.set(`bl_${token}`, "blacklisted", { EX: ttl });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/login",
  validateUserCredentials,
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Assuming you have a function to validate user credentials
      if (!req.isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      });

      console.log("Login successful:", token);
      res.status(200).json({ email, token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
