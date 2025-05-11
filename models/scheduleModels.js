const getAllSchedules = async (pool) => {
  const query = `
    SELECT * FROM schedules;
    `;
  const result = await pool.query(query);
  return result.rows;
};

const getAllSchedulesByUserId = async ({ user_id }, pool) => {
  const query = `
    SELECT * FROM schedules WHERE user_id = $1;
    `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

const getScheduleById = async ({ id }, pool) => {
  const query = `
    SELECT * FROM schedules WHERE id = $1
    `;
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    throw new Error("Schedule not found");
  }
  return result.rows[0];
};

const createSchedule = async (
  { id, user_id, medication_id, start_date, end_date, frequency, time_of_day, day_of_week },
  pool
) => {
  const query = "INSERT INTO schedules (id, user_id, medication_id, start_date, end_date, frequency, time_of_day, day_of_week) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
  const result = await pool.query(query, [
    id,
    user_id,
    medication_id,
    start_date,
    end_date,
    frequency,
    time_of_day,
    day_of_week
  ]);
  return result.rows[0];
};

const updateSchedule = async (
  { 
    medication_id = null,
    start_date = null,
    end_date = null,
    frequency = null,
    time_of_day = null,
    day_of_week = null,
    id, },
  pool
) => {
  const query = `
    UPDATE schedules 
        SET 
        medication_id = COALESCE($1, medication_id), 
        start_date = COALESCE($2, start_date), 
        end_date = COALESCE($3, end_date), 
        frequency = COALESCE($4, frequency),
        time_of_day = COALESCE($5, time_of_day),
        day_of_week = COALESCE($6, day_of_week)
        WHERE id = $7 RETURNING *
        `;
  const result = await pool.query(query, [
    medication_id,
    start_date,
    end_date,
    frequency,
    time_of_day,
    day_of_week,
    id,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

const deleteSchedule = async (id, pool) => {
  const query = `
    DELETE FROM schedules WHERE id = $1
    RETURNING *
    `;
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    throw new Error("Schedule not found");
  }
  return result.rows;
};

module.exports = {
  getAllSchedules,
  getAllSchedulesByUserId, 
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};