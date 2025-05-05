const {getUserCredentialsFromEmail} = require('../models/userModels');
const {comparePassword} = require('../utils/authUtils');

module.exports = async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }
    try {
        const credentials = await getUserCredentialsFromEmail(email);
        const isValid = await comparePassword(password, credentials.password);
        if (!isValid) {
            return res.status(401).json({error: 'Invalid email or password'});
        }
        req.isValid = isValid
        req.user = {id: credentials.id, email: credentials.email};
        next();
    } catch (error) {
        console.error('Error validating user credentials:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}