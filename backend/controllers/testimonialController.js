const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');
const { testimonialFields } = require('../lib/testimonialFields');
const { createNotification } = require('./notificationController');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
});

// @desc    Get all testimonials (Admin)
// @route   GET /api/testimonials/all
// @access  Private/Admin
const getAdminTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = asyncHandler(async (req, res) => {
    const canManage = ['admin', 'super_admin'].includes(req.user.role)
        || (['staff', 'operations_manager', 'sales_executive', 'finance_executive'].includes(req.user.role)
            && req.user.adminPermissions?.includes('cms'));
    let fields;
    try { fields = testimonialFields(req.body, { canManage }); }
    catch (error) { res.status(error.statusCode || 400); throw error; }
    const testimonial = new Testimonial(fields);

    const createdTestimonial = await testimonial.save();

    if (!createdTestimonial.isApproved) await createNotification({
        title: 'New Testimonial Submission',
        message: `A new testimonial from ${createdTestimonial.name} is awaiting approval.`,
        type: 'user',
        relatedId: createdTestimonial._id
    }).catch(error => console.warn('Testimonial saved, but its admin notification could not be delivered:', error.message));

    res.status(201).json(createdTestimonial);
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = asyncHandler(async (req, res) => {
    let fields;
    try { fields = testimonialFields(req.body, { partial: true, canManage: true }); }
    catch (error) { res.status(error.statusCode || 400); throw error; }

    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
        Object.assign(testimonial, fields);
        if (testimonial.source !== 'google') testimonial.sourceUrl = '';

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
