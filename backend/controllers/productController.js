const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { PAGE_SIZE } = require('../config/constants');

// @desc    Fetch all products with advanced filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.pageNumber) || 1;
    const limit = Number(req.query.limit) || PAGE_SIZE;

    // Base query object
    const query = {};

    // Keyword Search (searches name, description, brand, etc.)
    if (req.query.keyword) {
        query.$or = [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
        ];
    }

    // Filter by Categories (e.g., ?category=Electronics,Furniture)
    if (req.query.category) {
        const categories = req.query.category.split(',');
        query.category = { $in: categories };
    }

    // Filter by Brand (e.g., ?brand=Dell,HP)
    if (req.query.brand) {
        const brands = req.query.brand.split(',');
        query.brand = { $in: brands };
    }

    // Filter by Price Range (e.g., ?minPrice=100&maxPrice=5000)
    if (req.query.minPrice || req.query.maxPrice) {
        query.rentalPrice = {};
        if (req.query.minPrice) query.rentalPrice.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.rentalPrice.$lte = Number(req.query.maxPrice);
    }

    // Filter by Minimum Rating (e.g., ?rating=4)
    if (req.query.rating) {
        query.rating = { $gte: Number(req.query.rating) };
    }

    // Filter by Location (Exact Match for City/State)
    if (req.query.city) {
        query.city = { $regex: req.query.city, $options: 'i' };
    }
    if (req.query.state) {
        query.state = { $regex: req.query.state, $options: 'i' };
    }

    // Filter by Subcategory ID (e.g., ?subcategory=<ObjectId>)
    if (req.query.subcategory) {
        query.subcategory = req.query.subcategory;
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('subcategory', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / limit) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('subcategory', 'name slug');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        subcategory,
        brand,
        images,
        rentalPrice,
        securityDeposit,
        stock,
        condition,
        city,
        state,
    } = req.body;

    // Check if category exists, if not create it
    if (category) {
        const categoryExists = await Category.findOne({ name: category, parent: null });
        if (!categoryExists) {
            await Category.create({
                name: category,
                description: `${category} category`,
                isActive: true,
                parent: null,
            });
        }
    }

    const product = new Product({
        name,
        description,
        category,
        subcategory: subcategory || null,
        brand,
        images,
        rentalPrice,
        securityDeposit,
        stock,
        condition,
        city,
        state,
    });

    const createdProduct = await product.save();
    await createdProduct.populate('subcategory', 'name slug');
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        subcategory,
        brand,
        images,
        rentalPrice,
        securityDeposit,
        stock,
        condition,
        isActive,
        city,
        state,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // If category is being updated, check if it exists or create it
        if (category && category !== product.category) {
            const categoryExists = await Category.findOne({ name: category, parent: null });
            if (!categoryExists) {
                await Category.create({
                    name: category,
                    description: `${category} category`,
                    isActive: true,
                    parent: null,
                });
            }
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        // Allow setting subcategory to null (pass empty string to clear it)
        product.subcategory = subcategory === '' ? null : (subcategory || product.subcategory);
        product.brand = brand || product.brand;

        if (images) {
            product.images = images;
        } else if (req.body.image) {
            product.images = [req.body.image];
        }

        product.rentalPrice = rentalPrice || product.rentalPrice;
        product.securityDeposit = securityDeposit || product.securityDeposit;
        product.stock = stock || product.stock;
        product.condition = condition || product.condition;
        product.city = city || product.city;
        product.state = state || product.state;
        product.isActive = isActive !== undefined ? isActive : product.isActive;

        const updatedProduct = await product.save();
        await updatedProduct.populate('subcategory', 'name slug');
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};
