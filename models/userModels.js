const { pool } = require('../db');

const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Internal server error');
    }
}

const getUser = async ({id}) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Internal server error');
    }
}

const createUser = async ({name, id, date_of_birth, email, password}) => {
    try {
        const result = await pool.query(
            'INSERT INTO users (id, name, email, date_of_birth, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, name, email, date_of_birth, password]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Internal server error');
    }
}

const getUserCredentialsFromEmail = async (email) => {
    try {
        const result = await pool.query(
            'SELECT id, email, password FROM users WHERE email = $1;', [email]
        );
        if (result.rows.length === 0) {
            throw new Error('Invalid credentials');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user credentials:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getAllUsers,
    getUser, 
    createUser,
    getUserCredentialsFromEmail
}