const USER_FIELDS = ['_id', 'name', 'email', 'phone', 'avatar', 'role', 'adminPermissions',
    'authProvider', 'isEmailVerified', 'isPhoneVerified', 'isBlocked', 'isActive',
    'blockedReason', 'lastLogin', 'createdAt', 'updatedAt'];
const ADDRESS_FIELDS = ['_id', 'name', 'addressLine', 'city', 'state', 'pincode', 'country',
    'phone', 'isBillingSame', 'isDefault', 'createdAt', 'updatedAt'];
const KYC_FIELDS = ['status', 'documentType', 'submittedAt', 'rejectionReason'];

function pick(source, fields) {
    const result = {};
    for (const field of fields) if (source?.[field] !== undefined) result[field] = source[field];
    return result;
}

// Intentionally no object spreading: new schema fields are private until reviewed.
function userResponse(user) {
    if (!user) return null;
    const result = pick(user, USER_FIELDS);
    if (user.addresses) result.addresses = user.addresses.map(address => pick(address, ADDRESS_FIELDS));
    if (user.kyc) result.kyc = pick(user.kyc, KYC_FIELDS);
    return result;
}

module.exports = { userResponse };
