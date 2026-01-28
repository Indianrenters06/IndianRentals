'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PiInfo, PiSmileySad } from 'react-icons/pi';

export default function MyOrdersPage() {
    const [activeTab, setActiveTab] = useState('All Orders');
    const [viewType, setViewType] = useState('orders'); // 'orders' | 'subscriptions'

    // Dummy Order Data matching the screenshot
    const orders = [
        {
            id: '4479',
            date: '25-Aug-25',
            deliveryTo: 'Harshit Aggarwal',
            monthlyRent: 1100,
            securityAmount: 5000,
            partialAmount: 600,
            status: 'Under Review',
            productName: 'MacBook Pro M4 Pro | 24 GB RAM | 512GB SSD | Silver',
            planDuration: '3 months',
            rentalPeriod: '25th Aug 2025 to 25th Nov 2025',
            image: '/macbook-placeholder.jpg',
        },
        {
            id: '4480',
            date: '26-Aug-25',
            deliveryTo: 'Harshit Aggarwal',
            monthlyRent: 1100,
            securityAmount: 5000,
            partialAmount: 600,
            status: 'Pending',
            productName: 'MacBook Pro M4 Pro | 24 GB RAM | 512GB SSD | Silver',
            planDuration: '3 months',
            rentalPeriod: '26th Aug 2025 to 26th Nov 2025',
            image: '/macbook-placeholder.jpg',
        },
        {
            id: '4481',
            date: '20-Aug-25',
            deliveryTo: 'Harshit Aggarwal',
            monthlyRent: 1100,
            securityAmount: 5000,
            partialAmount: 600,
            status: 'Active', // Maps to 'Active Orders'
            productName: 'MacBook Pro M4 Pro | 24 GB RAM | 512GB SSD | Silver',
            planDuration: '3 months',
            rentalPeriod: '25th Aug 2025 to 25th Nov 2025',
            image: '/macbook-placeholder.jpg',
        },
        {
            id: '4482',
            date: '15-Jan-25',
            deliveryTo: 'Harshit Aggarwal',
            monthlyRent: 1100,
            securityAmount: 5000,
            partialAmount: 600,
            status: 'Inactive', // Maps to 'Inactive Orders'
            productName: 'MacBook Pro M4 Pro | 24 GB RAM | 512GB SSD | Silver',
            planDuration: '3 months',
            rentalPeriod: '15th Jan 2025 to 15th Apr 2025',
            image: '/macbook-placeholder.jpg',
        },
        {
            id: '4483',
            date: '10-Feb-25',
            deliveryTo: 'Harshit Aggarwal',
            monthlyRent: 1100,
            securityAmount: 5000,
            partialAmount: 600,
            status: 'Failed', // Maps to 'Order Failed'
            productName: 'MacBook Pro M4 Pro | 24 GB RAM | 512GB SSD | Silver',
            planDuration: '3 months',
            rentalPeriod: '10th Feb 2025 to 10th May 2025',
            image: '/macbook-placeholder.jpg',
        }
    ];

    const orderTabs = [
        'All Orders',
        'KYC Pending',
        'KYC Under Review',
        'Active Orders',
        'Inactive Orders',
        'Order Failed'
    ];

    const subscriptionTabs = [
        'All Subscriptions',
        'Active Subscriptions',
        'Inactive Subscriptions'
    ];

    const currentTabs = viewType === 'orders' ? orderTabs : subscriptionTabs;

    // Filter logic
    const filteredOrders = orders.filter(order => {
        if (viewType === 'orders') {
            if (activeTab === 'All Orders') return true;
            if (activeTab === 'KYC Under Review' && order.status === 'Under Review') return true;
            if (activeTab === 'KYC Pending' && order.status === 'Pending') return true;
            if (activeTab === 'Active Orders' && order.status === 'Active') return true;
            if (activeTab === 'Inactive Orders' && order.status === 'Inactive') return true;
            if (activeTab === 'Order Failed' && order.status === 'Failed') return true;
        } else {
            // Subscription logic (Currently reusing orders for demo)
            if (activeTab === 'All Subscriptions') return order.status === 'Active'; // Show active ones for demo
            if (activeTab === 'Active Subscriptions' && order.status === 'Active') return true;
            if (activeTab === 'Inactive Subscriptions' && order.status === 'Inactive') return true;
        }
        return false;
    });

    const getStatusStyle = (status) => {
        if (status === 'Active') {
            return 'bg-white text-blue-500 border-blue-500 border';
        }
        if (status === 'Inactive') {
            return 'bg-white text-gray-600 border-gray-600 border';
        }
        if (status === 'Failed') {
            return 'bg-white text-red-500 border-red-500 border';
        }
        return 'bg-orange-50 text-orange-500 border-orange-200 border'; // Default/Pending/Under Review
    };

    const handleViewChange = (type) => {
        setViewType(type);
        setActiveTab(type === 'orders' ? 'All Orders' : 'All Subscriptions');
    };

    return (
        <div className="bg-white min-h-screen rounded-2xl p-6 border border-gray-100 relative">
            {/* Dashed Border Effect (Optional, mimicking the container) */}

            {/* Top Toggle */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => handleViewChange('orders')}
                    className={`px-8 py-2.5 rounded-full text-lg font-medium transition-all ${viewType === 'orders'
                        ? 'bg-[#333] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    My Orders
                </button>
                <button
                    onClick={() => handleViewChange('subscriptions')}
                    className={`px-8 py-2.5 rounded-full text-lg font-medium transition-all ${viewType === 'subscriptions'
                        ? 'bg-[#333] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Subscriptions
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                {currentTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-medium whitespace-nowrap pb-3 border-b-2 transition-colors ${activeTab === tab
                            ? 'border-[#3b82f6] text-[#3b82f6]'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Empty State Message */}
            {filteredOrders.length === 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <PiSmileySad size={24} />
                    </div>
                    <p className="text-gray-600 font-medium text-lg">We are unable to find orders.</p>
                </div>
            )}

            {/* Info Banner */}
            <div className="bg-gray-100 rounded-lg p-3 mb-6 flex items-start gap-2 text-xs text-gray-500">
                <PiInfo size={16} className="mt-0.5 flex-shrink-0" />
                <p>
                    {viewType === 'subscriptions'
                        ? 'Once you order, Your order is automatically made into a subscription. You can extend your current subscription, cancel or renew your old subscription.'
                        : activeTab === 'Order Failed'
                            ? 'Please note, once the order has been failed your amount will be returned within 24-48 hours of cancellation'
                            : 'Please note, once the order has been cancelled your amount will be returned within 24-48 hours of cancellation'
                    }
                </p>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                        {/* Header Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Order Date</p>
                                <p className="font-bold text-gray-800">{order.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Order No.</p>
                                <p className="font-bold text-gray-800">{order.id}</p>
                            </div>
                            <div className="lg:col-span-1">
                                <p className="text-gray-500 text-xs mb-1">Delivery to</p>
                                <p className="font-bold text-gray-800 truncate" title={order.deliveryTo}>{order.deliveryTo}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Monthly Rent</p>
                                <p className="font-bold text-gray-800">₹{order.monthlyRent}/mo</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Security Amount</p>
                                <p className="font-bold text-gray-800">₹{parseFloat(order.securityAmount).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Partial Amount</p>
                                <div className="flex justify-between items-start gap-2">
                                    <p className="font-bold text-gray-800">₹{order.partialAmount}</p>
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-medium whitespace-nowrap ${getStatusStyle(order.status)}`}>
                                        {order.status === 'Active' ? 'Active Order' : order.status === 'Inactive' ? 'Inactive Order' : order.status === 'Failed' ? 'Order Failed' : order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 w-full mb-6"></div>

                        {/* Product Details */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Product Image */}
                            <div className="w-24 h-16 relative bg-white rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                                <Image
                                    src={order.image}
                                    alt={order.productName}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-800 text-base mb-3 leading-tight">
                                    {order.productName}
                                </h3>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <div className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 text-gray-600">
                                        Plan Duration <span className="font-semibold text-gray-800 ml-1">{order.planDuration}</span>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 text-gray-600">
                                        Rental Period <span className="font-semibold text-gray-800 ml-1">{order.rentalPeriod}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 min-w-[140px] items-end justify-center">
                                {viewType === 'subscriptions' ? (
                                    order.status === 'Inactive' ? (
                                        <>
                                            <button className="bg-[#333] hover:bg-black text-white text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm w-full whitespace-nowrap">
                                                Rent Again
                                            </button>
                                            <button className="bg-[#007bff] hover:bg-[#0069d9] text-white text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm w-full">
                                                Invoices
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="bg-[#007bff] hover:bg-[#0069d9] text-white text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm w-full">
                                                Extend Tenure
                                            </button>
                                            <button className="text-gray-800 text-sm font-medium hover:underline text-center w-full">
                                                Cancel My Order
                                            </button>
                                        </>
                                    )
                                ) : order.status === 'Inactive' ? (
                                    <button className="bg-[#333] hover:bg-black text-white text-sm font-medium py-2.5 px-6 rounded-full transition-colors shadow-sm whitespace-nowrap">
                                        Rent Again
                                    </button>
                                ) : order.status === 'Failed' ? (
                                    <button className="bg-[#333] hover:bg-black text-white text-sm font-medium py-2.5 px-6 rounded-full transition-colors shadow-sm whitespace-nowrap">
                                        Re-submit KYC Form
                                    </button>
                                ) : (
                                    <>
                                        <button className="bg-[#007bff] hover:bg-[#0069d9] text-white text-sm font-medium py-2 px-4 rounded-full transition-colors shadow-sm w-full">
                                            Invoices
                                        </button>
                                        <button className="text-gray-800 text-sm font-medium hover:underline text-center w-full">
                                            Cancel My Order
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
