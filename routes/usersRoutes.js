const express = require('express');
const router = express.Router();
const pool = require('../db');
const {v4: uuidv4} = require('uuid');
const validateUserPostReq = require('../middleware/validateUserPostReq');
const encryptPassword = require('../middleware/encryptPassword');

router.get('/', async (req, res) => {
    try {
        console.log(`- ${new Date().toISOString()} - 
            GET request received at /users 
            Fetching all users`);
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
        console.log('Users fetched successfully: 200 OK');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        console.log(`- ${new Date().toISOString()} - 
            GET request received at /users for user ID: ${userId}
            Fetching all users`);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
        console.log('User fetched successfully: 200 OK');
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', validateUserPostReq, encryptPassword, async (req, res) => {
    const { id = uuidv4(), name, email, password, date_of_birth = null } = req.body;
    try {
        console.log(`- ${new Date().toISOString()} - 
            POST request received at /users
            Creating user with id: ${id}, name: ${name}, email: ${email}, password: ${password}, date_of_birth: ${date_of_birth}`);
        const result = await pool.query(
            'INSERT INTO users (id, name, email, password, date_of_birth) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, name, email, password, date_of_birth]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, password, date_of_birth } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3, date_of_birth = $4 WHERE id = $5 RETURNING *',
            [name, email, password, date_of_birth, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;