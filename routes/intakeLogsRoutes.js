const express = require('express');
const router = express.Router();

//controllers
const { getAllIntakeLogsController, getIntakeLogController, createIntakeLogController, updateIntakeLogController } = require('../controllers/intakeLogsController');

//middleware
const validateIntakeLogPostReq = require('../middleware/validateIntakeLogPostReq');
const validateIntakeLogPutReq = require('../middleware/validateIntakeLogPutReq');
const authenticateUser = require('../middleware/authenticateUser');

//routes
// GET /medications - Get all medications
router.get('/', authenticateUser, getAllMedicationsController);
// GET /medications/:id - Get a specific medication by ID
router.get('/:id', authenticateUser, getMedicationController);
// POST /medications - Create a new medication
router.post('/', authenticateUser, validateMedicationPostReq, createMedicationController);
// PUT /medications - Update an existing medication
router.put('/', authenticateUser, validateMedicationPutReq, updateMedicationController);