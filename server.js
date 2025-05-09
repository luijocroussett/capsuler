require("dotenv").config();
const { pool } = require("./db");
const redisClient = require("./redisClient");
const { makeApp } = require("./app.js");
const PORT = process.env.PORT || 3000;

const app = makeApp(pool, redisClient);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
