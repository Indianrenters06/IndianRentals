'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter,
    FiDownload, FiUpload, FiEye, FiMoreVertical, FiX, FiPackage
} from 'react-icons/fi';

// Memoized ProductModal to prevent re-renders
const ProductModal = React.memo(({ show, onClose, onSubmit, title, isEdit = false, formData, onInputChange }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={onSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => onInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="e.g., MacBook Pro 14-inch M4"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                required
                                rows="4"
                                value={formData.description}
                                onChange={(e) => onInputChange('description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Detailed product description..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => onInputChange('category', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select Category</option>
                                <option value="Apple">Apple</option>
                                <option value="IT Products">IT Products</option>
                                <option value="DSLR">DSLR</option>
                                <option value="AV Products">AV Products</option>
                                <option value="Office Equipment">Office Equipment</option>
                            </select>
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => onInputChange('brand', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="e.g., Apple, Canon, HP"
                            />
                        </div>

                        {/* Rental Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Rental Price (₹/month) *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.rentalPrice}
                                onChange={(e) => onInputChange('rentalPrice', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="5000"
                            />
                        </div>

                        {/* Security Deposit */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Security Deposit (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.securityDeposit}
                                onChange={(e) => onInputChange('securityDeposit', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="10000"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => onInputChange('stock', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="10"
                            />
                        </div>

                        {/* Condition */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Condition *
                            </label>
                            <select
                                required
                                value={formData.condition}
                                onChange={(e) => onInputChange('condition', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="New">New</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => onInputChange('city', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Mumbai"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                State *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.state}
                                onChange={(e) => onInputChange('state', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Maharashtra"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {isEdit ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

ProductModal.displayName = 'ProductModal';

export default function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        brand: '',
        rentalPrice: '',
        securityDeposit: '',
        stock: '',
        condition: 'Good',
        city: '',
        state: '',
        images: []
    });

    // Helper function to handle input changes - memoized to prevent re-renders
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        console.log('🚀 handleAddProduct called!', e);
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            console.log('📦 Adding product:', formData);
            console.log('🔑 Token present:', !!token);

            const response = await fetch('http://localhost:5000/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchProducts();
                setShowAddModal(false);
                resetForm();
                alert('Product added successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to add product'}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert(`Failed to add product: ${error.message}. Check console for details.`);
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            const response = await fetch(`http://localhost:5000/api/admin/products/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchProducts();
                setShowEditModal(false);
                resetForm();
                alert('Product updated successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to update product'}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchProducts();
                alert('Product deleted successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to delete product'}`);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            brand: product.brand || '',
            rentalPrice: product.rentalPrice,
            securityDeposit: product.securityDeposit,
            stock: product.stock,
            condition: product.condition,
            city: product.city,
            state: product.state,
            images: product.images || []
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            brand: '',
            rentalPrice: '',
            securityDeposit: '',
            stock: '',
            condition: 'Good',
            city: '',
            state: '',
            images: []
        });
        setSelectedProduct(null);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage your rental inventory</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                <FiDownload className="w-4 h-4" />
                                Export
                            </button>
                            <button
                                onClick={() => {
                                    console.log('➕ Add Product button clicked');
                                    setShowAddModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1 max-w-md relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            <option value="Apple">Apple</option>
                            <option value="IT Products">IT Products</option>
                            <option value="DSLR">DSLR</option>
                            <option value="AV Products">AV Products</option>
                            <option value="Office Equipment">Office Equipment</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price/Month</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Condition</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FiPackage className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.brand || 'No brand'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-gray-900">₹{product.rentalPrice?.toLocaleString()}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${product.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-700">{product.condition}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">
                                                <p>{product.city}</p>
                                                <p className="text-xs text-gray-500">{product.state}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <ProductModal
                show={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    resetForm();
                }}
                onSubmit={handleAddProduct}
                title="Add New Product"
                formData={formData}
                onInputChange={handleInputChange}
            />

            {/* Edit Product Modal */}
            <ProductModal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    resetForm();
                }}
                onSubmit={handleEditProduct}
                title="Edit Product"
                isEdit={true}
                formData={formData}
                onInputChange={handleInputChange}
            />
        </div>
    );
}
