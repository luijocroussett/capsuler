const getMedication = async ({ medicationId }, pgPool) => {
  const query = `SELECT * FROM medications WHERE id = $1;`;
  const values = [medicationId];
  const result = await pgPool.query(query, values);
  if (result.rows.length === 0) {
    throw new Error(`Medication with id ${medicationId} not found`);
  }
  return result.rows[0];
};

const getAllMedications = async ({id}, pgPool) => {
  let query = `SELECT * FROM medications`;
  let result;
  if (id) {
    console.log("user_id was included in request", id);
    query += ` WHERE user_id = $1`;
    result = await pgPool.query(query, [id]);
  } else {
    console.log("user_id was not included in request", id);
    result = await pgPool.query(query);
  }
  return result.rows;
};

const createMedication = async (
  { id, name, description, dosage, status, type, user_id, instructions },
  pgPool
) => {
  const query = `
    INSERT INTO medications (id, name, description, dosage, status, type, user_id, instructions)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [id, name, description, dosage, status, type, user_id, instructions];

  const result = await pgPool.query(query, values);
  if (result.rows.length === 0) {
    throw new Error("Failed to create medication");
  }
  return result.rows[0];
};

const updateMedication = async (
  { id, name, description, dosage, user_id, status, type, instructions },
  pgPool
) => {
  const query = `
        UPDATE medications
        SET 
            name = COALESCE($1, name), 
            description = COALESCE($2, description), 
            dosage = COALESCE($3, dosage), 
            status = COALESCE($4, status),
            type = COALESCE($5, type),
            user_id = COALESCE($6, user_id),
            instructions = COALESCE($7, instructions)
        WHERE id = $8
        RETURNING *;
    `;
  const values = [name, description, dosage, status, type, user_id, instructions, id];

  const result = await pgPool.query(query, values);
  if (result.rows.length === 0) {
    throw new Error(`Medication with id ${id} not found`);
  }
  return result.rows[0];
};

module.exports = {
  getMedication,
  getAllMedications,
  createMedication,
  updateMedication,

};
