// Legacy accounts and tokens start at version zero. Once an account version is
// incremented, a legacy token can never regain access by omitting its claim.
const sessionVersion = value => {
    if (value === undefined) return 0;
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid session version');
    return value;
};

const sessionMatches = (user, decoded) => {
    try { return sessionVersion(user.sessionVersion) === sessionVersion(decoded.sessionVersion); }
    catch { return false; }
};

const currentVersionFilter = user => {
    const version = sessionVersion(user.sessionVersion);
    return version === 0
        ? { $or: [{ sessionVersion: 0 }, { sessionVersion: { $exists: false } }] }
        : { sessionVersion: version };
};

module.exports = { sessionVersion, sessionMatches, currentVersionFilter };
