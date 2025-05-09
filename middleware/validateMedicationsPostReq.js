const {body, validationResult} = require('express-validator');

const validateMedicationPostReq = [
    body('id')
        .notEmpty()
        .withMessage('Id is required'),
    body('user_id')
        .notEmpty()
        .withMessage('User Id is required'),
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('dosage')
        .notEmpty()
        .withMessage('Dosage is required')
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

module.exports = validateMedicationPostReq;