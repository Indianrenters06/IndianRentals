const express = require('express');
const router = express.Router();
const {
    addRentalItems,
    addStagedRental,
    quoteRental,
    getRentalById,
    getMyRentals,
    getRentals,
    updateRentalStatus,
    cancelMyRental
} = require('../controllers/rentalController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addRentalItems)
    .get(protect, admin, hasPermission('orders', 'notifications'), getRentals);

const { getStagedRental, finalizeStagedRental, adjustFinalQuote } = require('../controllers/stagedCheckoutController');
router.post('/staged', protect, addStagedRental);
router.get('/:id/staged', protect, getStagedRental);
router.post('/:id/staged/finalize', protect, finalizeStagedRental);
router.put('/:id/staged/final-quote', protect, admin, hasPermission('orders'), adjustFinalQuote);

router.route('/myrentals').get(protect, getMyRentals);
router.post('/quote', protect, quoteRental);

router.route('/:id').get(protect, getRentalById);

router.route('/:id/status').put(protect, admin, hasPermission('orders'), updateRentalStatus);

router.route('/:id/cancel').put(protect, cancelMyRental);

module.exports = router;
