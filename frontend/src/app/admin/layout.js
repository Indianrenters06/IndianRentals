import React from 'react';
import Link from 'next/link';
import { FaUser, FaBox, FaClipboardList, FaUsers, FaSignOutAlt, FaHome } from 'react-icons/fa';

/**
 * Admin Layout Component
 * Provides a sidebar and main content area for admin pages.
 * Includes navigation links and logout functionality.
 */
const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-wider">Admin Panel</h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-1">
                        <li>
                            <Link href="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                                <FaHome className="mr-3" /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/kyc" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                                <FaClipboardList className="mr-3" /> KYC Requests
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/products" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                                <FaBox className="mr-3" /> Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/orders" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                                <FaClipboardList className="mr-3" /> Orders
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                                <FaUsers className="mr-3" /> Users
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center px-6 py-2 w-full text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors duration-200 rounded">
                        <FaSignOutAlt className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10 p-4 flex justify-end items-center">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 font-medium">Hello, Admin</span>
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="text-gray-500" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
