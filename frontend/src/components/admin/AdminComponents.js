// Reusable Admin Panel Components

import { FiX } from 'react-icons/fi';

// Modal Component
export const Modal = ({ show, onClose, title, children, size = 'md' }) => {
    if (!show) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Card Component
export const Card = ({ children, className = '', hover = false }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${hover ? 'hover:shadow-md transition-all duration-300' : ''} ${className}`}>
            {children}
        </div>
    );
};

// Badge Component
export const Badge = ({ children, variant = 'default', size = 'md' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-indigo-100 text-indigo-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
    };

    return (
        <span className={`inline-block font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

// Button Component
export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    onClick,
    type = 'button',
    disabled = false,
    className = ''
}) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

// Input Component
export const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    error,
    icon: Icon,
    ...props
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

// Select Component
export const Select = ({
    label,
    options,
    value,
    onChange,
    required = false,
    error,
    placeholder = 'Select an option'
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

// Textarea Component
export const Textarea = ({
    label,
    placeholder,
    value,
    onChange,
    required = false,
    error,
    rows = 4
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

// Toggle Switch Component
export const Toggle = ({ label, description, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
                {label && <h3 className="font-semibold text-gray-900">{label}</h3>}
                {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={onChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizes[size]}`}></div>
        </div>
    );
};

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="text-center py-12">
            {Icon && (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {action}
        </div>
    );
};

// Table Component
export const Table = ({ columns, data, onRowClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
                        >
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="py-4 px-6">
                                    {column.render ? column.render(row) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Pagination Component
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

// Stats Card Component
export const StatsCard = ({ title, value, change, trend, icon: Icon }) => {
    return (
        <Card hover>
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                        {change && (
                            <div className="flex items-center gap-1">
                                <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {change}
                                </span>
                                <span className="text-xs text-gray-500">from last month</span>
                            </div>
                        )}
                    </div>
                    {Icon && (
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Icon className="w-6 h-6 text-indigo-600" />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
