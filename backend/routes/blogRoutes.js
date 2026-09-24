const express = require('express');
const router = express.Router();
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/blogController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllPosts)                         // Public: list posts (supports ?status=published)
    .post(protect, admin, hasPermission('cms'), createPost);       // Admin: create

router.route('/:id')
    .get(getPostById)                        // Public: single post
    .put(protect, admin, hasPermission('cms'), updatePost)         // Admin: update
    .delete(protect, admin, hasPermission('cms'), deletePost);     // Admin: delete

module.exports = router;
