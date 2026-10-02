const jwt = require('jsonwebtoken');
const { requireActiveAccount } = require('./accountAccess');
const { sessionVersion } = require('./sessionVersion');

const generateToken = (res, user) => {
    requireActiveAccount(user, res);
    if (!user._id) throw new Error('A verified account is required to issue a session');
    const token = jwt.sign({ id: user._id, sessionVersion: sessionVersion(user.sessionVersion) }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as HTTP-Only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token; // Return it in case we also want to send it in JSON
};

module.exports = generateToken;
