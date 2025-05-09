const express = require("express");
const router = express.Router();
const redisClient = require("../redisClient");
const jwt = require("jsonwebtoken");
const validateUserCredentials = require("../middleware/validateUserCredentials");
const { logoutController, loginController } = require("../controllers/authController");

router.post("/logout", logoutController);

router.post(
  "/login",
  validateUserCredentials,
  loginController
);

module.exports = router;
