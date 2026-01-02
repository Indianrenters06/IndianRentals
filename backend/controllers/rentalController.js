const asyncHandler = require('express-async-handler');
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const { RENTAL_STATUS } = require('../config/constants');

// @desc    Create new rental order
// @route   POST /api/rentals
// @access  Private
const addRentalItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        rentalPeriod,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const rental = new Rental({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            rentalPeriod,
        });

        const createdRental = await rental.save();
        res.status(201).json(createdRental);
    }
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (rental) {
        // Allow admin or the user who made the order to view it
        if (req.user.isAdmin || rental.user._id.equals(req.user._id)) {
            res.json(rental);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this rental');
        }
    } else {
        res.status(404);
        throw new Error('Rental not found');
    }
});

// @desc    Update rental to paid
// @route   PUT /api/rentals/:id/pay
// @access  Private
const updateRentalToPaid = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (rental) {
        rental.isPaid = true;
        rental.paidAt = Date.now();
        rental.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedRental = await rental.save();
        res.json(updatedRental);
    } else {
        res.status(404);
        throw new Error('Rental not found');
    }
});

// @desc    Get logged in user rentals
// @route   GET /api/rentals/myrentals
// @access  Private
const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ user: req.user._id });
    res.json(rentals);
});

// @desc    Get all rentals
// @route   GET /api/rentals
// @access  Private/Admin
const getRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({}).populate('user', 'id name');
    res.json(rentals);
});

// @desc    Update rental status (Admin)
// @route   PUT /api/rentals/:id/status
// @access  Private/Admin
const updateRentalStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);

    if (rental) {
        rental.status = status;

        // Auto update booleans based on status
        if (status === RENTAL_STATUS.DELIVERED || status === RENTAL_STATUS.ACTIVE) {
            rental.isDelivered = true;
            rental.deliveredAt = Date.now();
        }
        if (status === RENTAL_STATUS.RETURNED) {
            rental.isReturned = true;
            rental.returnedAt = Date.now();
        }

        const updatedRental = await rental.save();
        res.json(updatedRental);
    } else {
        res.status(404);
        throw new Error('Rental not found');
    }
});

module.exports = {
    addRentalItems,
    getRentalById,
    updateRentalToPaid,
    getMyRentals,
    getRentals,
    updateRentalStatus,
};
