const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// @desc    Fetch all TOP-LEVEL categories (no parent) with their subcategories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const parents = await Category.find({ parent: null, isActive: true }).lean();

    // Attach subcategories to each parent
    const result = await Promise.all(
        parents.map(async (parent) => {
            const subcategories = await Category.find({ parent: parent._id, isActive: true }).lean();
            return { ...parent, subcategories };
        })
    );

    res.json(result);
});

// @desc    Fetch subcategories for a given parent category
// @route   GET /api/categories/:id/subcategories
// @access  Public
const getSubcategories = asyncHandler(async (req, res) => {
    const parent = await Category.findById(req.params.id);
    if (!parent) {
        res.status(404);
        throw new Error('Category not found');
    }

    const subcategories = await Category.find({ parent: req.params.id, isActive: true });
    res.json(subcategories);
});

// @desc    Get full category tree (all parents + their children)
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = asyncHandler(async (req, res) => {
    const allCategories = await Category.find({ isActive: true }).lean();

    const parents = allCategories.filter((c) => !c.parent);
    const children = allCategories.filter((c) => c.parent);

    const tree = parents.map((parent) => ({
        ...parent,
        subcategories: children.filter(
            (child) => child.parent.toString() === parent._id.toString()
        ),
    }));

    res.json(tree);
});

// ============================================================
// ADMIN ROUTES
// ============================================================

// @desc    Fetch all categories including inactive (for admin)
// @route   GET /api/categories/admin
// @access  Private/Admin
const getAdminCategories = asyncHandler(async (req, res) => {
    const parents = await Category.find({ parent: null }).lean();

    const result = await Promise.all(
        parents.map(async (parent) => {
            const subcategories = await Category.find({ parent: parent._id }).lean();
            return { ...parent, subcategories };
        })
    );

    res.json(result);
});

// @desc    Create a top-level category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;

    // For top-level categories parent must be null
    const categoryExists = await Category.findOne({ name, parent: null });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        name,
        description,
        image,
        parent: null,
    });

    res.status(201).json(category);
});

// @desc    Create a subcategory under a parent category
// @route   POST /api/categories/:id/subcategories
// @access  Private/Admin
const createSubcategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;

    const parent = await Category.findById(req.params.id);
    if (!parent) {
        res.status(404);
        throw new Error('Parent category not found');
    }

    // Subcategory name must be unique within the same parent
    const exists = await Category.findOne({ name, parent: parent._id });
    if (exists) {
        res.status(400);
        throw new Error(`Subcategory "${name}" already exists under "${parent.name}"`);
    }

    const subcategory = await Category.create({
        name,
        description,
        image,
        parent: parent._id,
    });

    res.status(201).json(subcategory);
});

// @desc    Update a category or subcategory
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.description = description !== undefined ? description : category.description;
        category.image = image !== undefined ? image : category.image;
        category.isActive = isActive !== undefined ? isActive : category.isActive;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Delete a category (and its subcategories if it's a parent)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // If deleting a parent, also delete all its subcategories
    if (!category.parent) {
        await Category.deleteMany({ parent: category._id });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
});

module.exports = {
    // Public
    getCategories,
    getSubcategories,
    getCategoryTree,
    // Admin
    getAdminCategories,
    createCategory,
    createSubcategory,
    updateCategory,
    deleteCategory,
};
