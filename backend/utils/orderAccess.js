const STAFF_ROLES = ['staff', 'operations_manager', 'sales_executive', 'finance_executive'];

// Same actor policy as the protected administrative rental-list route.
function canManageOrders(user) {
    return ['admin', 'super_admin'].includes(user?.role) ||
        (STAFF_ROLES.includes(user?.role) &&
            user.adminPermissions?.some(permission => ['orders', 'notifications'].includes(permission)));
}

module.exports = { canManageOrders };
