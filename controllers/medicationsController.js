const {
  getAllMedications,
  getMedication,
  createMedication,
  updateMedication,
} = require("../models/medicationsModels");

const getAllMedicationsController = async (req, res) => {
  const pgPool = res.locals.pgPool;
  const user_id = req.query && req.query.user_id ? req.query.user_id : null; 

  try {
    const result = await getAllMedications({ id: user_id }, pgPool);
    console.log("Medication was retrieved successfully");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMedicationController = async (req, res) => {
  const pgPool = res.locals.pgPool;
  const { medicationId } = req.params;

  try {
    const result = await getMedication({ medicationId }, pgPool);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Medication not found" });
    }
  } catch (error) {
    console.error("Error fetching medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createMedicationController = async (req, res) => {
  const pgPool = res.locals.pgPool;
  const { id, user_id, name, description, dosage, status, type, instructions } = req.body;

  try {
    const result = await createMedication(
      { id, name, description, dosage, status, user_id, type, instructions },
      pgPool
    );
    console.log("Medication was created successfully", result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMedicationController = async (req, res) => {
  const pgPool = res.locals.pgPool;
  const { medicationId } = req.params;
  const { name, description, dosage, user_id, status, type, instructions } = req.body;

  try {
    const result = await updateMedication(
      { id: medicationId, name, description, dosage, user_id, status, type, instructions },
      pgPool
    );
    console.log("Medication was updated successfully", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllMedicationsController,
  getMedicationController,
  createMedicationController,
  updateMedicationController,
};
