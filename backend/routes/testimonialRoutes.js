const express = require('express');
const router = express.Router();
const {
    getTestimonials,
    getAdminTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} = require('../controllers/testimonialController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTestimonials)
    .post(protect, createTestimonial);

router.route('/all').get(protect, admin, hasPermission('cms'), getAdminTestimonials);

router.route('/:id')
    .put(protect, admin, hasPermission('cms'), updateTestimonial)
    .delete(protect, admin, hasPermission('cms'), deleteTestimonial);

module.exports = router;
