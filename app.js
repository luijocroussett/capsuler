const express = require("express");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const medicationsRoutes = require('./routes/medicationsRoutes');
const schedulesRoutes = require('./routes/schedulesRoutes');
const intakeLogsRoutes = require('./routes/intakeLogsRoutes');

const makeApp = (pgPool, redisClient) => {
  const app = express();
  const cors = require("cors");
  const bodyParser = require("body-parser");

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.locals = { ...res.locals, pgPool, redisClient };
    next();
  });

  app.use("/auth", authRoutes);
  app.use("/users", usersRoutes);
  app.use('/medications', medicationsRoutes);
  app.use('/schedules', schedulesRoutes);
  app.use('/intake-logs', intakeLogsRoutes);
  app.get("/", (req, res) => {
    res.send("Welcome to the Pill Project API");
  });
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
};

module.exports = { makeApp };
