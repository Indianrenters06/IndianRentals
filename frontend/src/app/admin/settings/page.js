'use client';

import { useState } from 'react';
import {
    FiUser, FiLock, FiBell, FiGlobe, FiMail, FiShield,
    FiSave, FiRefreshCw
} from 'react-icons/fi';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState({
        // Profile
        name: 'Admin User',
        email: 'admin@indianrentals.com',
        phone: '+91 98765 43210',
        // Notifications
        emailNotifications: true,
        orderNotifications: true,
        userNotifications: false,
        // General
        siteName: 'IndianRentals',
        siteEmail: 'support@indianrentals.com',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
    });

    const handleSave = () => {
        // Save settings logic here
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: FiUser },
        { id: 'security', name: 'Security', icon: FiLock },
        { id: 'notifications', name: 'Notifications', icon: FiBell },
        { id: 'general', name: 'General', icon: FiGlobe },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage your admin panel settings</p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <FiSave className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                                    <div className="space-y-6">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                                A
                                            </div>
                                            <div>
                                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                                    Change Avatar
                                                </button>
                                                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.name}
                                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.email}
                                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={settings.phone}
                                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                    <div className="space-y-6">
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Enter current password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                            Update Password
                                        </button>

                                        {/* Two-Factor Authentication */}
                                        <div className="pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                                                    <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                                    <div className="space-y-6">
                                        {/* Email Notifications */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                                                <p className="text-sm text-gray-600 mt-1">Receive email updates about your account</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.emailNotifications}
                                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        {/* Order Notifications */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Order Notifications</h3>
                                                <p className="text-sm text-gray-600 mt-1">Get notified about new orders and updates</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.orderNotifications}
                                                    onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        {/* User Notifications */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">User Activity Notifications</h3>
                                                <p className="text-sm text-gray-600 mt-1">Receive updates about new user registrations</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.userNotifications}
                                                    onChange={(e) => setSettings({ ...settings, userNotifications: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* General Tab */}
                            {activeTab === 'general' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
                                    <div className="space-y-6">
                                        {/* Site Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Site Name
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.siteName}
                                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Site Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Support Email
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.siteEmail}
                                                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Currency */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Currency
                                            </label>
                                            <select
                                                value={settings.currency}
                                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="INR">Indian Rupee (₹)</option>
                                                <option value="USD">US Dollar ($)</option>
                                                <option value="EUR">Euro (€)</option>
                                                <option value="GBP">British Pound (£)</option>
                                            </select>
                                        </div>

                                        {/* Timezone */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Timezone
                                            </label>
                                            <select
                                                value={settings.timezone}
                                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New_York (EST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
