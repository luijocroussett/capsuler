const getAllSchedules = async ({ userId }, pool) => {
  const query = `
    SELECT * FROM schedules WHERE user_id = $1
    `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

const getScheduleById = async ({ id }, pool) => {
  const query = `
    SELECT * FROM schedules WHERE id = $1
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const createSchedule = async (
  { id, user_id, medication_id, start_date, end_date, frequency },
  pool
) => {
  const query = `
    INSERT INTO schedules (id, user_id, medication_id, start_date, end_date, frequency)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
        `;
  const result = await pool.query(query, [
    id,
    user_id,
    medication_id,
    start_date,
    end_date,
    frequency,
  ]);
  return result.rows[0];
};

const updateSchedule = async (
  { id, medication_id, start_date, end_date, frequency },
  pool
) => {
  const query = `
    UPDATE schedules 
        SET 
        medication_id = COALESCE($1, medication_id), 
        start_date = COALESCE($2, start_date), 
        end_date = COALESCE($3, end_date), 
        frequency = COALESCE($4, frequency)
        WHERE id = $5 RETURNING *
        `;
  const result = await pool.query(query, [
    medication_id,
    start_date,
    end_date,
    frequency,
    id,
  ]);
  return result.rows[0];
};

const deleteSchedule = async (id, pool) => {
  const query = `
    DELETE FROM schedules WHERE id = $1
    RETURNING *
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
