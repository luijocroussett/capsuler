const getAllIntakes = async (pool) => {
  const query = `SELECT * FROM intakes;`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all intakes:", error);
    throw new Error("Failed to fetch intakes");
  }
};

const getIntakeByDateRange = async ({ startDate, endDate }, pool) => {
  const query = `
        SELECT * FROM intakes
        WHERE intake_date BETWEEN $1 AND $2;
    `;
  const values = [startDate, endDate];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching intakes by date range:", error);
    throw new Error("Failed to fetch intakes by date range");
  }
};

const createIntake = async (
  { id, user_id, medication_id, intake_date, dosage },
  pool
) => {
  const query = `
        INSERT INTO intakes (id, user_id, medication_id, intake_date, dosage)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
  const values = [id, user_id, medication_id, intake_date, dosage];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating intake:", error);
    throw new Error("Failed to create intake");
  }
};

const deleteIntake = async ({ intakeId }, pool) => {
  const query = `
        DELETE FROM intakes
        WHERE id = $1
        RETURNING *;
    `;
  const values = [intakeId];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(`Intake with id ${intakeId} not found`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting intake:", error);
    throw new Error("Failed to delete intake");
  }
};

const updateIntake = async (
  { id, user_id, medication_id, intake_date, dosage },
  pool
) => {
  const query = `
        UPDATE intakes
        SET user_id = $1, medication_id = $2, intake_date = $3, dosage = $4
        WHERE id = $5
        RETURNING *;
    `;
  const values = [user_id, medication_id, intake_date, dosage, id];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(`Intake with id ${id} not found`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating intake:", error);
    throw new Error("Failed to update intake");
  }
};

module.exports = {
  getAllIntakes,
  getIntakeByDateRange,
  createIntake,
  deleteIntake,
  updateIntake,
};