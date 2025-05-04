const {hashPassword} = require('../utils/authUtils');

module.exports = async (req, res, next) => {
    const {password} = req.body;
    if (!password) {
        return res.status(400).json({error: 'Password is required'});
    }
    try {
        const hashedPassword = await hashPassword(password);
        req.body.password = hashedPassword;
        next();
    } catch (error) {
        console.error('Error encrypting password:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}