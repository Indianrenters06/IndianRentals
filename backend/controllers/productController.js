const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            brand,
            images,
            rentalPrice,
            securityDeposit,
            stock,
            condition
        } = req.body;

        // Check if category exists, if not create it
        if (category) {
            const categoryExists = await Category.findOne({ name: category });
            if (!categoryExists) {
                await Category.create({
                    name: category,
                    description: `${category} category`,
                    isActive: true
                });
            }
        }

        const product = new Product({
            name,
            description,
            category,
            brand,
            images,
            rentalPrice,
            securityDeposit,
            stock,
            condition
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message || 'Invalid product data' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            brand,
            images,
            rentalPrice,
            securityDeposit,
            stock,
            condition,
            isActive
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // If category is being updated, check if it exists or create it
            if (category && category !== product.category) {
                const categoryExists = await Category.findOne({ name: category });
                if (!categoryExists) {
                    await Category.create({
                        name: category,
                        description: `${category} category`,
                        isActive: true
                    });
                }
            }

            product.name = name || product.name;
            product.description = description || product.description;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.images = images || product.images;
            product.rentalPrice = rentalPrice || product.rentalPrice;
            product.securityDeposit = securityDeposit || product.securityDeposit;
            product.stock = stock || product.stock;
            product.condition = condition || product.condition;
            product.isActive = isActive !== undefined ? isActive : product.isActive;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid product data' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
