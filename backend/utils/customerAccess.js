const User = require('../models/User');
const { hasPermission } = require('../middleware/authMiddleware');

function assertCustomerActor(req, res, permissions = ['users']) {
    hasPermission(...permissions)(req, res, () => {});
}

async function requireCustomerTarget(req, res, permissions = ['users']) {
    assertCustomerActor(req, res, permissions);
    const target = await User.findById(req.params.id);
    if (!target) {
        res.status(404);
        throw new Error('User not found');
    }
    if (target.role !== 'customer') {
        res.status(403);
        throw new Error('Privileged accounts must be managed through Team');
    }
    return target;
}

function requireUnchangedCustomer(target, res) {
    if (!target) {
        res.status(409);
        throw new Error('Customer changed while processing this request');
    }
    return target;
}

module.exports = { assertCustomerActor, requireCustomerTarget, requireUnchangedCustomer };
