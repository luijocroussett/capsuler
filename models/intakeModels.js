const getAllIntakelogs = async (pool) => {
  const query = "SELECT * FROM intake_logs;";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all intake_logs:", error);
    throw new Error("Failed to fetch intake_logs");
  }
};

const getAllIntakeLogsByUserId = async ({ user_id }, pool) => {
  const query = "SELECT * FROM intake_logs WHERE user_id = $1;";
  const values = [user_id];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching intake logs by user ID:", error);
    throw new Error("Failed to fetch intake logs by user ID");
  }
};

const getAllIntakeLogsByDateRange = async ({ startDate, endDate }, pool) => {
  const query = "SELECT * FROM intake_logs WHERE taken_at BETWEEN $1 AND $2;";
  const values = [startDate, endDate];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching intake logs by date range:", error);
    throw new Error("Failed to fetch intake logs by date range");
  }
};

const getUserIntakeLogsByDateRange = async ({ startDate, endDate, user_id }, pool) => {
  const query = "SELECT * FROM intake_logs WHERE taken_at BETWEEN $1 AND $2 AND user_id = $3;";
  const values = [startDate, endDate, user_id];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching intake logs by date range:", error);
    throw new Error("Failed to fetch intake logs by date range");
  }
};

const createIntakeLog = async (
  { id, user_id, medication_id, taken_at, note },
  pool
) => {
  const query = "INSERT INTO intake_logs (id, user_id, medication_id, taken_at, note) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
  const values = [id, user_id, medication_id, taken_at, note];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating intake log:", error);
    throw new Error("Failed to create intake log");
  }
};

const deleteIntakeLog = async ({ intakeLogId }, pool) => {
  const query = "DELETE FROM intake_logs WHERE id = $1 RETURNING *;";
  const values = [intakeLogId];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(`Intake log with id ${intakeLogId} not found`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting intake log:", error);
    throw new Error("Failed to delete intake");
  }
};

const updateIntakeLog = async (
  { id, note = null, medication_id = null, taken_at = null },
  pool
) => {
  const query = `
        UPDATE intake_logs
        SET 
            taken_at = COALESCE($1, taken_at),
            note = COALESCE($2, note),
            medication_id = COALESCE($3, medication_id)
        WHERE id = $4
        RETURNING *;
    `;
  const values = [taken_at, note, medication_id, id];
  try {
    if (note === null && medication_id === null && taken_at === null) {
      throw new Error("No fields to update provided");
    }
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(`Intake log with id ${id} not found`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating intake log:", error);
    throw new Error("Failed to update intake log");
  }
};

module.exports = {
  getAllIntakelogs,
  getAllIntakeLogsByDateRange,
  createIntakeLog,
  deleteIntakeLog,
  updateIntakeLog,
  getAllIntakeLogsByUserId,
  getUserIntakeLogsByDateRange
};