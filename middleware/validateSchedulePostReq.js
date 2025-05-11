const {query, body, validationResult} = require('express-validator');

const validateSchdulePostReq = [
    query('id')
    .optional()
    .isString()
    .withMessage('Id must be a string'),
    body('id')
    .optional()
    .isString()
    .withMessage('Dosage must be a string'),
    body('medication_id')
        .notEmpty()
        .withMessage('Medication Id is required'),
    body('user_id')
        .notEmpty()
        .withMessage('User Id is required'),
    body('frequency')
        .notEmpty()
        .isString()
        .withMessage('Dosage must be a string'),
    body('time_of_day')
        .notEmpty()
        .withMessage('Time of day is required'),
    body('start_date')
        .notEmpty()
        .isString()
        .withMessage('Start date is required'),
    body('end_date')
        .notEmpty()
        .isString()
        .withMessage('End date is required'),
    body('day_of_week')
        .notEmpty()
        .isString()
        .withMessage('Day of week is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

module.exports = validateSchdulePostReq;