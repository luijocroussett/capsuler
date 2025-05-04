require('dotenv').config();
const express = require('express');
const app = express();
const usersRoutes = require('./routes/usersRoutes');
// const medicationsRoutes = require('./routes/medicationsRoutes');
// const schedulesRoutes = require('./routes/schedulesRoutes');
// const intakeLogsRoutes = require('./routes/intakeLogsRoutes');

const cors = require('cors');
const bodyParser = require('body-parser'); 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRoutes);
// app.use('/medications', medicationsRoutes);
// app.use('/schedules', schedulesRoutes);
// app.use('/intakeLogs', intakeLogsRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Pill Project API');
});

module.exports = app;