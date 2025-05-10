const express = require('express');
const router = express.Router();

//controllers
const {
    getAllIntakeLogsController,
    getAllIntakeLogsByUserIdController,
    getAllIntakeLogsByDateRangeController,
    getUserIntakeLogsByDateRangeController,
    createIntakeLogController,
    deleteIntakeLogController,
    updateIntakeLogController,
  } = require('../controllers/intakeController');

//middleware
const validateIntakeLogPostReq = require('../middleware/validateIntakeLogPostReq');
const validateIntakeLogPutReq = require('../middleware/validateIntakeLogPutReq');
const authenticateUser = require('../middleware/authenticateUser');
const { route } = require('./authRoutes');

//routes
// GET /intake-logs - Get all intake logs
router.get('/', authenticateUser, getAllIntakeLogsController);
// POST /intake-logs - Create a new intake logs
router.post('/', authenticateUser, validateIntakeLogPostReq, createIntakeLogController);
// PUT /intake-logs - Update an existing intake logs
router.put('/', authenticateUser, validateIntakeLogPutReq, updateIntakeLogController);
// DELETE /intake-logs/:id - Delete a intake logs by ID
router.delete('/:intakeLogId', authenticateUser, deleteIntakeLogController);
// GET /intake-logs/date-range - Get intake logs by date range
router.get('/date-range', authenticateUser, getAllIntakeLogsByDateRangeController);
// GET /intake-logs/user/:id - Get a specific intake logs by ID
router.get('/user/:userId', authenticateUser, getAllIntakeLogsByUserIdController);
// GET /intake-logs/user/date-range - Get user intake logs by date range
router.get('/user/:userId/date-range', authenticateUser, getUserIntakeLogsByDateRangeController);

module.exports = router;