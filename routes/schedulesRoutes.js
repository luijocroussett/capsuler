const express = require('express');
const router = express.Router();
const { getAllSchedulesController, getScheduleController, createScheduleController, updateScheduleController } = require('../controllers/schedulesController');
const validateSchedulePostReq = require('../middleware/validateSchedulePostReq');
const authenticateUser = require('../middleware/authenticateUser');
const validateSchedulePutReq = require('../middleware/validateSchedulePutReq');

router.get('/', authenticateUser, getAllSchedulesController);

router.get('/:id', authenticateUser, getScheduleController);

router.post('/', authenticateUser, validateSchedulePostReq, createScheduleController);

router.put('/', authenticateUser, validateSchedulePutReq, updateScheduleController);