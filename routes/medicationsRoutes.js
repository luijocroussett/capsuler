const express = require('express');
const router = express.Router();

//controllers
const { getAllMedicationsController, getMedicationController, createMedicationController, updateMedicationController } = require('../controllers/medicationsController');

//middleware
const validateMedicationsPostReq = require('../middleware/validateMedicationsPostReq');
const validateMedicationsPutReq = require('../middleware/validateMedicationsPutReq');
const authenticateUser = require('../middleware/authenticateUser');

//routes
// GET /medications - Get all medications
router.get('/', authenticateUser, getAllMedicationsController);
// GET /medications/:id - Get a specific medication by ID
router.get('/:medicationId', authenticateUser, getMedicationController);
// POST /medications - Create a new medication
router.post('/', authenticateUser, validateMedicationsPostReq, createMedicationController);
// PUT /medications - Update an existing medication
router.put('/:medicationId', authenticateUser, validateMedicationsPutReq, updateMedicationController);

module.exports = router;