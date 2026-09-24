const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/BlogPost');
const sanitizeHtml = require('../utils/sanitizeHtml');

// ── @desc   Get all blog posts
// ── @route  GET /api/blog
// ── @access Public
const getAllPosts = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const posts = await BlogPost.find(filter).sort({ createdAt: -1 }).lean();
    res.json(posts);
});

// ── @desc   Get single blog post by id
// ── @route  GET /api/blog/:id
// ── @access Public
const getPostById = asyncHandler(async (req, res) => {
    let post;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        post = await BlogPost.findById(req.params.id);
    } else {
        post = await BlogPost.findOne({ slug: req.params.id });
    }

    if (!post) {
        res.status(404);
        throw new Error('Blog post not found');
    }
    // Also cleans posts saved before sanitising on write existed.
    const out = post.toJSON();
    out.content = sanitizeHtml(out.content);
    res.json(out);
});

// ── @desc   Create blog post
// ── @route  POST /api/blog
// ── @access Private/Admin
const createPost = asyncHandler(async (req, res) => {
    const { title, excerpt, content, coverImage, author, tags, status } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Title is required');
    }

    const post = await BlogPost.create({ title, excerpt, content: sanitizeHtml(content), coverImage, author, tags, status });
    res.status(201).json(post);
});

// ── @desc   Update blog post
// ── @route  PUT /api/blog/:id
// ── @access Private/Admin
const updatePost = asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Blog post not found');
    }

    const fields = ['title', 'excerpt', 'content', 'coverImage', 'author', 'tags', 'status'];
    fields.forEach((f) => {
        if (req.body[f] !== undefined) post[f] = req.body[f];
    });
    post.content = sanitizeHtml(post.content);

    const updated = await post.save();
    res.json(updated);
});

// ── @desc   Delete blog post
// ── @route  DELETE /api/blog/:id
// ── @access Private/Admin
const deletePost = asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error('Blog post not found');
    }
    await post.deleteOne();
    res.json({ message: 'Blog post deleted' });
});

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
