const {body, validationResult} = require('express-validator');

const validateIntakeLogPostReq = [
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
    body('taken_at')
        .notEmpty()
        .withMessage('Taken at is required'),
    body('note')
        .optional()
        .isString()
        .withMessage('Dosage must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

module.exports = validateIntakeLogPostReq;