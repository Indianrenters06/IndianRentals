'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome, FiUsers, FiPackage, FiShoppingCart, FiFileText,
    FiCreditCard, FiCalendar, FiSettings, FiChevronRight,
    FiSearch, FiBell, FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiShield
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
        { name: 'Users', icon: FiUsers, path: '/admin/users' },
        { name: 'Products', icon: FiPackage, path: '/admin/products', hasSubmenu: true },
        { name: 'Rentals', icon: FiShoppingCart, path: '/admin/rentals' },
        { name: 'KYC', icon: FiShield, path: '/admin/kyc' },
        { name: 'Invoices', icon: FiFileText, path: '/admin/invoices', hasSubmenu: true },
        { name: 'Payments', icon: FiCreditCard, path: '/admin/payments', hasSubmenu: true },
        { name: 'Calendar', icon: FiCalendar, path: '/admin/calendar', hasSubmenu: true },
        { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
    ];

    const projects = [
        { name: 'Product Management', active: true },
        { name: 'User Analytics', active: false },
        { name: 'Revenue Tracking', active: false },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">IndianRentals</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                                        {sidebarOpen && (
                                            <span className="font-medium text-sm">{item.name}</span>
                                        )}
                                    </div>
                                    {sidebarOpen && item.hasSubmenu && (
                                        <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Projects Section */}
                    {sidebarOpen && (
                        <div className="mt-8">
                            <div className="px-3 mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Projects
                                </h3>
                            </div>
                            <div className="space-y-1">
                                {projects.map((project, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${project.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className="text-sm text-gray-700">{project.name}</span>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    ··· More
                                </button>
                            </div>
                        </div>
                    )}
                </nav>

                {/* User Profile */}
                <div className="border-t border-gray-200 p-4">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                A
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">Admin</p>
                                <p className="text-xs text-gray-500">admin@example.com</p>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <FiLogOut className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                A
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {darkMode ? <FiSun className="w-5 h-5 text-gray-600" /> : <FiMoon className="w-5 h-5 text-gray-600" />}
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiBell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Avatars */}
                        <div className="flex items-center -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-white"></div>
                        </div>

                        {/* Invite Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            <FiUsers className="w-4 h-4" />
                            Invite
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
