function requireActiveAccount(user, res) {
    if (!user || user.isBlocked === true || user.isActive === false) {
        const status = user ? 403 : 401;
        res.status(status);
        const error = new Error(user ? 'Account access is disabled. Please contact support.' : 'Not authorized');
        error.statusCode = status;
        throw error;
    }
}
module.exports = { requireActiveAccount };
