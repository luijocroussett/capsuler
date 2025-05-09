const getAllUsers = async (pgPool) => {
    const result = await pgPool.query('SELECT * FROM users');
    return result.rows;
}

const getUser = async ({id}, pgPool) => {
    const result = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    return result.rows[0];
}

const createUser = async ({name, id, date_of_birth, email, password}, pgPool) => {
    const result = await pgPool.query(
        'INSERT INTO users (id, name, email, date_of_birth, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, name, email, date_of_birth, password]
    );
    return result.rows[0];
}

const getUserCredentialsFromEmail = async ({email}, pgPool) => {
    const result = await pgPool.query(
        'SELECT id, password FROM users WHERE email = $1;', [email]
    );
    if (result.rows.length === 0) {
        throw new Error('User credentials not found');
    }
    return result.rows[0];
}

const updateUser = async ({name=null, id, date_of_birth=null, email=null, password=null}, pgPool) => {
    const result = await pgPool.query( 
        'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), date_of_birth = COALESCE($3, date_of_birth), password = COALESCE($4, password) WHERE id = $5 RETURNING *',
        [name, email, date_of_birth, password, id]
    );
    console.log([name, email, date_of_birth, password, id])
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    return result.rows[0];
}

module.exports = {
    getAllUsers,
    getUser, 
    createUser,
    getUserCredentialsFromEmail,
    updateUser
};
