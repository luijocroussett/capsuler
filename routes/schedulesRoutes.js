const express = require('express');
const router = express.Router();
const {getAllSchedulesController, getAllSchedulesByUserIdController, getScheduleByIdController, createScheduleController, updateScheduleController, deleteScheduleController} = require('../controllers/schedulesController');
const validateSchedulePostReq = require('../middleware/validateSchedulePostReq');
const validateSchedulePutReq = require('../middleware/validateSchedulePutReq');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/', authenticateUser, getAllSchedulesController);

router.get('/:id', authenticateUser, getScheduleByIdController);

router.get('/user/:id', authenticateUser, getAllSchedulesByUserIdController);

router.post('/', authenticateUser, validateSchedulePostReq, createScheduleController);

router.put('/', authenticateUser, validateSchedulePutReq, updateScheduleController);

router.delete('/', authenticateUser, deleteScheduleController);

module.exports = router;