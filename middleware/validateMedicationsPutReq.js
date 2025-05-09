const { body, validationResult } = require("express-validator");

const validateMedicationsPutReq = [
  body("id").notEmpty().withMessage("Id is required"),
  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
  body("frequency")
    .optional()
    .isString()
    .withMessage("Frequency must be a string"),
  body("dosage").optional().isString().withMessage("Dosage must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateMedicationsPutReq;
