const PAGE_SIZE = 10;
const RENTAL_STATUS = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    ACTIVE: 'Active',
    RETURNED: 'Returned',
    CANCELLED: 'Cancelled',
};

const KYC_STATUS = {
    NOT_SUBMITTED: 'not_submitted',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

module.exports = {
    PAGE_SIZE,
    RENTAL_STATUS,
    KYC_STATUS,
};
