const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');
const { createNotification } = require('./notificationController');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isApproved: true });
    res.json(testimonials);
});

// @desc    Get all testimonials (Admin)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
const getAdminTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = asyncHandler(async (req, res) => {
    const { name, role, message, rating, image } = req.body;

    const testimonial = new Testimonial({
        name,
        role,
        message,
        rating,
        image
    });

    const createdTestimonial = await testimonial.save();

    await createNotification({
        title: 'New Testimonial Submission',
        message: `A new testimonial from ${name} is awaiting approval.`,
        type: 'user',
        relatedId: createdTestimonial._id
    });

    res.status(201).json(createdTestimonial);
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = asyncHandler(async (req, res) => {
    const { name, role, message, rating, image, isApproved } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
        testimonial.name = name || testimonial.name;
        testimonial.role = role || testimonial.role;
        testimonial.message = message || testimonial.message;
        testimonial.rating = rating || testimonial.rating;
        testimonial.image = image || testimonial.image;
        if (isApproved !== undefined) testimonial.isApproved = isApproved;

        const updatedTestimonial = await testimonial.save();
        res.json(updatedTestimonial);
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
        await testimonial.deleteOne();
        res.json({ message: 'Testimonial removed' });
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

module.exports = {
    getTestimonials,
    getAdminTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
};
