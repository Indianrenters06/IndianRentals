const express = require('express');
const router = express.Router();
const {
    addRentalItems,
    getRentalById,
    updateRentalToPaid,
    getMyRentals,
    getRentals,
    updateRentalStatus,
    cancelMyRental
} = require('../controllers/rentalController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addRentalItems)
    .get(protect, admin, hasPermission('orders', 'notifications'), getRentals);

router.route('/myrentals').get(protect, getMyRentals);

router.route('/:id').get(protect, getRentalById);

router.route('/:id/pay').put(protect, updateRentalToPaid);

router.route('/:id/status').put(protect, admin, hasPermission('orders'), updateRentalStatus);

router.route('/:id/cancel').put(protect, cancelMyRental);

module.exports = router;
