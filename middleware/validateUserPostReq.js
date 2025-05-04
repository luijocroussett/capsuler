const {body, validationResult} = require('express-validator');

const validateUserPostReq = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({min: 2})
        .withMessage('Name must be at least 2 characters long'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    body('date_of_birth')
        .optional()
        .isDate()
        .withMessage('Invalid date format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

module.exports = validateUserPostReq;