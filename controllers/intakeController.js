const {
  getAllIntakelogs,
  getAllIntakeLogsByDateRange,
  createIntakeLog,
  deleteIntakeLog,
  updateIntakeLog,
  getAllIntakeLogsByUserId,
  getUserIntakeLogsByDateRange,
} = require("../models/intakeModels");
const { v4: uuidv4 } = require("uuid");

const getAllIntakeLogsController = async (req, res) => {
  try {
    const intakeLogs = await getAllIntakelogs(res.locals.pgPool);
    console.log("Successfully fetched intakes. Total of records:", intakeLogs.length);
    res.status(200).json(intakeLogs);
  } catch (error) {
    console.error("Error fetching intakes:", error);
    res.status(500).json({ error: "Failed to fetch intakes" });
  }
};

const getAllIntakeLogsByDateRangeController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const intakeLogs = await getAllIntakeLogsByDateRange(
      { startDate, endDate },
      res.locals.pgPool
    );
    console.log("Successfully fetched intakes by date range. Total of records:", intakeLogs.length);
    res.status(200).json(intakeLogs);
  } catch (error) {
    console.error("Error fetching intakes by date range:", error);
    res.status(500).json({ error: "Failed to fetch intakes by date range" });
  }
};

const getAllIntakeLogsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const intakeLogs = await getAllIntakeLogsByUserId({ user_id: userId }, res.locals.pgPool);
    console.log(
      `Successfully fetched all intake logs of user ID: ${userId}`,
      intakeLogs
    );
    res.status(200).json(intakeLogs);
  } catch (error) {
    console.error("Error fetching intake logs by user ID:", error);
    res.status(500).json({ error: "Failed to fetch intake logs by user ID" });
  }
};

const getUserIntakeLogsByDateRangeController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { userId } = req.params;
    const intakeLogs = await getUserIntakeLogsByDateRange(
      { startDate, endDate, user_id: userId },
      res.locals.pgPool
    );
    console.log(
      `Successfully fetched all intake logs of user ID: ${userId} by date range. Total of records:`,
      intakeLogs.length
    );
    res.status(200).json(intakeLogs);
  } catch (error) {
    console.error(
      "Error fetching intake logs by user ID and date range:",
      error
    );
    res
      .status(500)
      .json({ error: "Failed to fetch intake logs by user ID and date range" });
  }
};

const createIntakeLogController = async (req, res) => {
  try {
    const { id = uuidv4(), user_id, medication_id, taken_at, note } = req.body;
    const intakeLog = await createIntakeLog(
      { id, user_id, medication_id, taken_at, note },
      res.locals.pgPool
    );
    console.log("Successfully created intake log:", intakeLog);
    res.status(201).json(intakeLog);
  } catch (error) {
    console.error("Error creating intake - ", error);
    res.status(500).json({ error: "Failed to create intake log" });
  }
};

const deleteIntakeLogController = async (req, res) => {
  try {
    const { intakeLogId } = req.params;
    const deletedIntakeLog = await deleteIntakeLog({ intakeLogId }, res.locals.pgPool);
    console.log("Successfully deleted intake:", deletedIntakeLog);
    res.status(200).json(deletedIntakeLog);
  } catch (error) {
    console.error("Error deleting intake - ", error);
    res.status(500).json({ error: "Failed to delete intake" });
  }
};

const updateIntakeLogController = async (req, res) => {
  try {
    const { id, user_id, medication_id, taken_at, note } = req.body;
    const updatedIntake = await updateIntakeLog(
      { id, medication_id, taken_at, note },
      res.locals.pgPool
    );
    console.log("Successfully updated intake:", updatedIntake);
    res.status(200).json(updatedIntake);
  } catch (error) {
    console.error("Error updating intake:", error);
    res.status(500).json({ error: "Failed to update intake" });
  }
};

module.exports = {
  getAllIntakeLogsController,
  getAllIntakeLogsByUserIdController,
  getAllIntakeLogsByDateRangeController,
  getUserIntakeLogsByDateRangeController,
  createIntakeLogController,
  deleteIntakeLogController,
  updateIntakeLogController,
};
