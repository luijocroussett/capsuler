const {oneOf, query, body, validationResult} = require('express-validator');

const validateSchedulePostReq = [
    oneOf([
      query('id').isString().withMessage('Id must be a string'),
      body('id').isString().withMessage('Dosage must be a string'),
    ], "id must be provided as either query or body"),
    oneOf([
      body('medication_id')
          .isString()
          .withMessage('Medication Id must be a string'),
      body('user_id')
          .isString()
          .withMessage('User Id must be a string'),
      body('frequency')
          .isString()
          .withMessage('Dosage must be a string'),
      body('time_of_day')
          .isString()
          .withMessage('Time of day must be a string'),
      body('start_date')
          .isString()
          .withMessage('Start date must be a string'),
      body('end_date')
          .isString()
          .withMessage('End date must be a string'),
      body('day_of_week')
          .isString()
          .withMessage('Day of week must be a string'),
    ], "One attribute to update must be provided"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

module.exports = validateSchedulePostReq;