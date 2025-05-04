const bcrypt = require('bcrypt');
const salt = 10;

const hashPassword = async (plainTextPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
}

const comparePassword = async (plainTextPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Error comparing password');
    }
}

module.exports = {
    hashPassword,
    comparePassword
};
