const express = require('express');
const router = express.Router();
const {
    addRentalItems,
    getRentalById,
    updateRentalToPaid,
    getMyRentals,
    getRentals,
    updateRentalStatus
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addRentalItems)
    .get(protect, admin, getRentals);

router.route('/myrentals').get(protect, getMyRentals);

router.route('/:id').get(protect, getRentalById);

router.route('/:id/pay').put(protect, updateRentalToPaid);

router.route('/:id/status').put(protect, admin, updateRentalStatus);

module.exports = router;
