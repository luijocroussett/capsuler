const {getAllSchedules, getAllSchedulesByUserId, getScheduleById, createSchedule, updateSchedule, deleteSchedule} = require('../models/scheduleModels.js');
const {v4: uuidv4} = require('uuid');

const getAllSchedulesController = async (req, res) => {
    try {
        const schedules = await getAllSchedules(res.locals.pgPool);
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const getAllSchedulesByUserIdController = async (req, res) => {
    try {
        const userId = req.params.user_id || req.body.user_id;
        const schedules = await getAllSchedulesByUserId({user_id: userId}, res.locals.pgPool);
        if (schedules.length < 1) {
            throw new Error('No schedules found for this user');
        }
        console.log('Schedules found for user id:', userId, "Total schedules:", schedules.length);
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules by user ID:', error);
        if (error.message === 'No schedules found for this user', userId) {
            return res.status(404).json({error: 'No schedules found for this user'});
        }
        res.status(500).json({error: 'Internal server error'});
    }
}

const getScheduleByIdController = async (req, res) => {
    try {
        const scheduleId = req.params.id || req.body.id;
        const schedule = await getScheduleById({id: scheduleId}, res.locals.pgPool);
        console.log('Schedule found:', schedule);
        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        if (error.message === 'Schedule not found') {
            return res.status(404).json({error: 'Schedule not found'});
        }
        res.status(500).json({error: 'Internal server error'});
    }
}

const createScheduleController = async (req, res) => {
    try {
        const id = uuidv4(); // Generate a new UUID for the schedule ID
        const {user_id, medication_id, start_date, end_date, frequency, time_of_day, day_of_week} = req.body;
        const newSchedule = await createSchedule({id, user_id, medication_id, start_date, end_date, frequency, time_of_day, day_of_week}, res.locals.pgPool);
        console.log('Schedule created:', newSchedule);
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const updateScheduleController = async (req, res) => {
    try {
        const {id, medication_id, start_date, end_date, frequency, time_of_day, day_of_week} = req.body;
        const updatedSchedule = await updateSchedule({id, medication_id, start_date, end_date, frequency, time_of_day, day_of_week}, res.locals.pgPool);
        if (!updatedSchedule){
            return res.status(404).json({error: 'Schedule not found'});
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        if (error.message === 'Schedule not found') {
            console.error('Error updating schedule:', error);
            res.status(404).json({error: 'Schedule not found'});
        } else {
            console.error('Error updating schedule -', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
}

const deleteScheduleController = async (req, res) => {
    try {
        const scheduleId = req.body.id;
        const deletedSchedule = await deleteSchedule(scheduleId, res.locals.pgPool);
        console.log('Successfully deleted Schedule id:', scheduleId);
        res.status(200).json(deletedSchedule[0]);
    } catch (error) {
        if (error.message === 'Schedule not found') {
            console.error('Error deleting schedule:', error);
            res.status(404).json({error: 'Schedule not found'});
        }
        console.error('Error deleting schedule -', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = {
    getAllSchedulesController,
    getScheduleByIdController,
    createScheduleController,
    updateScheduleController,
    deleteScheduleController,
    getAllSchedulesByUserIdController
}
