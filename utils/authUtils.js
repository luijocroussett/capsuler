const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION || '1h';

const hashPassword = async (plainTextPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
}

const comparePassword = async (plainTextPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Error comparing password');
    }
}

const generateToken = (userId) => {
    try {
        const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiration });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Error verifying token');
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};
