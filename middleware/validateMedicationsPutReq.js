const { body, validationResult } = require("express-validator");

const validateMedicationsPutReq = [
  body("id").notEmpty().withMessage("Id is required"),
  body("medication_id")
    .optional()
    .isString()
    .withMessage("Medication id must be a string"),
  body("taken_at")
    .optional()
    .isString()
    .withMessage("taken_at must be a string"),
  body("note").optional().isString().withMessage("Note must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateMedicationsPutReq;
