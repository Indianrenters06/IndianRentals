'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiSmileySad } from 'react-icons/pi';

import { getMyOrders } from '../../../services/orderService';

// Exact info icon from Figma "My order" (node 23253:9392), 13.33px.
const InfoIcon = () => (
    <svg width="13.333" height="13.333" viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M6.66667 1.25C5.59535 1.25 4.54809 1.56768 3.65733 2.16287C2.76656 2.75806 2.07229 3.60403 1.66232 4.5938C1.25234 5.58356 1.14508 6.67268 1.35408 7.72341C1.56308 8.77414 2.07897 9.73929 2.83651 10.4968C3.59404 11.2544 4.5592 11.7703 5.60993 11.9793C6.66066 12.1883 7.74977 12.081 8.73954 11.671C9.7293 11.261 10.5753 10.5668 11.1705 9.67601C11.7657 8.78524 12.0833 7.73798 12.0833 6.66667C12.0818 5.23054 11.5106 3.85367 10.4952 2.83818C9.47966 1.82269 8.10279 1.25152 6.66667 1.25ZM6.66667 11.25C5.76017 11.25 4.87403 10.9812 4.1203 10.4776C3.36658 9.97395 2.77912 9.25813 2.43222 8.42063C2.08532 7.58314 1.99455 6.66158 2.1714 5.7725C2.34825 4.88342 2.78477 4.06675 3.42576 3.42576C4.06675 2.78477 4.88342 2.34825 5.7725 2.1714C6.66158 1.99455 7.58314 2.08532 8.42063 2.43222C9.25813 2.77912 9.97395 3.36658 10.4776 4.1203C10.9812 4.87403 11.25 5.76017 11.25 6.66667C11.2486 7.88182 10.7653 9.04681 9.90605 9.90605C9.04681 10.7653 7.88182 11.2486 6.66667 11.25ZM7.5 9.16667C7.5 9.27717 7.4561 9.38316 7.37796 9.4613C7.29982 9.53944 7.19384 9.58333 7.08333 9.58333C6.86232 9.58333 6.65036 9.49554 6.49408 9.33926C6.3378 9.18298 6.25 8.97101 6.25 8.75V6.66667C6.13949 6.66667 6.03351 6.62277 5.95537 6.54463C5.87723 6.46649 5.83333 6.36051 5.83333 6.25C5.83333 6.13949 5.87723 6.03351 5.95537 5.95537C6.03351 5.87723 6.13949 5.83333 6.25 5.83333C6.47101 5.83333 6.68298 5.92113 6.83926 6.07741C6.99554 6.23369 7.08333 6.44565 7.08333 6.66667V8.75C7.19384 8.75 7.29982 8.7939 7.37796 8.87204C7.4561 8.95018 7.5 9.05616 7.5 9.16667ZM5.83333 4.375C5.83333 4.25139 5.86999 4.13055 5.93866 4.02777C6.00734 3.92499 6.10495 3.84488 6.21916 3.79758C6.33336 3.75027 6.45903 3.73789 6.58027 3.76201C6.7015 3.78613 6.81287 3.84565 6.90028 3.93306C6.98768 4.02047 7.04721 4.13183 7.07132 4.25307C7.09544 4.37431 7.08306 4.49997 7.03576 4.61418C6.98845 4.72838 6.90835 4.82599 6.80556 4.89467C6.70278 4.96334 6.58195 5 6.45833 5C6.29257 5 6.1336 4.93415 6.01639 4.81694C5.89918 4.69973 5.83333 4.54076 5.83333 4.375Z" fill="#757575" />
    </svg>
);

// Status pill — Figma "Process-tags" shape (rounded-16, px-8 py-4, 12px semibold), colour per status.
const StatusTag = ({ status }) => {
    const map = {
        'Active': { label: 'Active Order', cls: 'bg-[#edfaff] border-[#0075ff] text-[#0075ff]' },
        'Pending': { label: 'Under Review', cls: 'bg-[#fff3d3] border-[#ff7a00] text-[#ff7a00]' },
        'Under Review': { label: 'Under Review', cls: 'bg-[#fff3d3] border-[#ff7a00] text-[#ff7a00]' },
        'Inactive': { label: 'Inactive Order', cls: 'bg-[#f6f6f6] border-[#afafaf] text-[#757575]' },
        'Failed': { label: 'Order Failed', cls: 'bg-[#fdecec] border-[#ed2115] text-[#ed2115]' },
    };
    const { label, cls } = map[status] || map['Pending'];
    return (
        <span className={`shrink-0 whitespace-nowrap rounded-[16px] border px-2 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] ${cls}`}>
            {label}
        </span>
    );
};

// Bordered chip: "Label value" — Figma "Frame 431/432".
const Chip = ({ label, value, valueColor = 'text-[#333333]' }) => (
    <div className="flex items-center gap-2 rounded-[4px] border border-[#cbcbcb] px-[5px] py-[2px] whitespace-nowrap">
        <span className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">{label}</span>
        <span className={`text-[12px] font-semibold leading-4 tracking-[-0.4px] ${valueColor}`}>{value}</span>
    </div>
);

// One label/value column in the card header — Figma "Frame 422..427".
const HeaderCell = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center gap-1 whitespace-nowrap">
        <span className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575] text-center">{label}</span>
        <span className="text-[12px] font-bold leading-4 tracking-[-0.4px] text-[#333333] text-center">{value}</span>
    </div>
);

export default function MyOrdersPage() {
    const [activeTab, setActiveTab] = useState('All Orders');
    const [viewType, setViewType] = useState('orders'); // 'orders' | 'subscriptions'
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                const mappedOrders = data.map(order => ({
                    id: order._id.substring(order._id.length - 6).toUpperCase(),
                    fullId: order._id,
                    date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
                    deliveryTo: (order.shippingAddress && order.shippingAddress.name) ? order.shippingAddress.name : 'Customer',
                    monthlyRent: order.orderItems && order.orderItems[0] ? order.orderItems[0].price : 0,
                    securityAmount: order.orderItems && order.orderItems[0] ? order.orderItems[0].securityDeposit : 0,
                    partialAmount: order.totalPrice,
                    status: order.isPaid ? (order.isDelivered ? 'Active' : 'Pending') : 'Inactive',
                    productName: order.orderItems && order.orderItems[0] ? order.orderItems[0].name : 'Rental Product',
                    planDuration: '3 months',
                    rentalPeriod: `${new Date(order.createdAt).toLocaleDateString('en-GB')} to ...`,
                    image: order.orderItems && order.orderItems[0] ? order.orderItems[0].image : '/macbook-placeholder.jpg',
                }));
                setOrders(mappedOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const orderTabs = ['All Orders', 'KYC Pending', 'KYC Under Review', 'Active Orders', 'Inactive Orders', 'Order Failed'];
    const subscriptionTabs = ['All Subscriptions', 'Active Subscriptions', 'Inactive Subscriptions'];
    const currentTabs = viewType === 'orders' ? orderTabs : subscriptionTabs;

    const filteredOrders = orders.filter(order => {
        if (viewType === 'orders') {
            if (activeTab === 'All Orders') return true;
            if (activeTab === 'KYC Under Review' && order.status === 'Under Review') return true;
            if (activeTab === 'KYC Pending' && order.status === 'Pending') return true;
            if (activeTab === 'Active Orders' && order.status === 'Active') return true;
            if (activeTab === 'Inactive Orders' && order.status === 'Inactive') return true;
            if (activeTab === 'Order Failed' && order.status === 'Failed') return true;
        } else {
            if (activeTab === 'All Subscriptions') return order.status === 'Active';
            if (activeTab === 'Active Subscriptions' && order.status === 'Active') return true;
            if (activeTab === 'Inactive Subscriptions' && order.status === 'Inactive') return true;
        }
        return false;
    });

    const handleViewChange = (type) => {
        setViewType(type);
        setActiveTab(type === 'orders' ? 'All Orders' : 'All Subscriptions');
    };

    const infoText = viewType === 'subscriptions'
        ? 'Once you order, Your order is automatically made into a subscription. You can extend your current subscription, cancel or renew your old subscription.'
        : activeTab === 'Order Failed'
            ? 'Please note, once the order has been failed your amount will be returned within 24-48 hours of cancellation'
            : 'Please note, once the order has been your amount will be returned within 24-48 hours of cancellation';

    return (
        <div className="flex flex-col gap-3">
            {/* Toggle — Figma "btn-extra" x2 */}
            <div className="flex items-start gap-[10px]">
                {[{ key: 'orders', label: 'My Orders' }, { key: 'subscriptions', label: 'Subscriptions' }].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => handleViewChange(key)}
                        className={`flex w-[180px] items-center justify-center rounded-[59px] py-[7px] text-[18px] font-normal leading-[25px] tracking-[-0.8px] transition-colors ${viewType === key ? 'bg-[#333333] text-[#eeeeee]' : 'bg-[#eeeeee] text-[#333333]'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tabs — Figma "Frame 250" */}
            <div className="w-full py-[10px]">
                <div className="flex items-start gap-[24px] overflow-x-auto scrollbar-hide">
                    {currentTabs.map((tab) => {
                        const active = activeTab === tab;
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)} className="flex flex-col items-start gap-1 shrink-0">
                                <span className={`text-[16px] font-semibold leading-[23px] tracking-[-0.4px] whitespace-nowrap ${active ? 'text-[#0d4e9b]' : 'text-[#1f1f1f]'}`}>
                                    {tab}
                                </span>
                                {active && <span className="h-[2px] w-full rounded-[10px] bg-[#0d4e9b]" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Divider — Figma "Line 13" (measured #afafaf) */}
            <div className="h-px w-full bg-[#afafaf]" />

            {/* Info banner — Figma "Frame 253" */}
            <div className="flex items-center gap-[9px] self-start rounded-[6px] border border-[#e2e2e2] bg-[#f6f6f6] px-[10px] py-[5px]">
                <InfoIcon />
                <p className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">{infoText}</p>
            </div>

            {/* Empty / loading state */}
            {loading ? (
                <p className="text-[14px] font-medium text-[#757575]">Loading your orders…</p>
            ) : filteredOrders.length === 0 ? (
                <div className="flex items-center gap-2 text-[#757575]">
                    <PiSmileySad size={22} />
                    <p className="text-[14px] font-medium">We are unable to find orders.</p>
                </div>
            ) : (
                /* Orders list */
                <div className="flex flex-col gap-3">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="w-full overflow-hidden rounded-[16px] border-[1.5px] border-[#e2e2e2] bg-white pb-4 shadow-[0px_6px_13px_0px_rgba(245,245,245,0.5)]"
                        >
                            {/* Header row */}
                            <div className="flex w-full items-center justify-between gap-4 overflow-x-auto border-b-[1.5px] border-[#e2e2e2] px-4 py-2 scrollbar-hide">
                                <HeaderCell label="Order Date" value={order.date} />
                                <HeaderCell label="Order No." value={order.id} />
                                <HeaderCell label="Delivery to" value={order.deliveryTo} />
                                <HeaderCell label="Monthly Rent" value={`₹${order.monthlyRent}/mo`} />
                                <HeaderCell label="Security Amount" value={`₹${parseFloat(order.securityAmount || 0).toFixed(2)}`} />
                                <HeaderCell label="Partial Amount" value={`₹${order.partialAmount}`} />
                                <StatusTag status={order.status} />
                            </div>

                            {/* Product row */}
                            <div className="mt-[10px] flex w-full items-center justify-between gap-4 px-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative size-[67px] shrink-0 overflow-hidden">
                                        <Image src={order.image} alt={order.productName} fill className="object-cover" sizes="67px" />
                                    </div>
                                    <div className="flex flex-col items-start min-w-0">
                                        <p className="text-[16px] font-semibold leading-[23px] tracking-[-0.4px] text-[#333333] truncate max-w-full" title={order.productName}>
                                            {order.productName}
                                        </p>
                                        <div className="mt-1 flex items-center gap-[20px]">
                                            <Chip label="Plan Duration" value={order.planDuration} />
                                            <div className="h-5 w-px bg-[#cbcbcb]" />
                                            <Chip label="Rental Period" value={order.rentalPeriod} valueColor="text-[#545454]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons — Figma "Frame 428" */}
                                <div className="flex w-[130px] shrink-0 flex-col items-end gap-[6px]">
                                    {viewType === 'subscriptions' ? (
                                        order.status === 'Inactive' ? (
                                            <>
                                                <button className="flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#333333] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-white">Rent Again</button>
                                                <button className="flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]">Invoices</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]">Extend Tenure</button>
                                                <button className="py-1 pl-3 pr-2 text-[14px] font-medium leading-5 tracking-[-0.4px] text-[#333333] underline">Cancel My Order</button>
                                            </>
                                        )
                                    ) : order.status === 'Inactive' ? (
                                        <button className="flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#333333] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-white">Rent Again</button>
                                    ) : order.status === 'Failed' ? (
                                        <button className="flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#333333] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-white">Re-submit KYC</button>
                                    ) : (
                                        <>
                                            <button className="flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]">Invoices</button>
                                            <button className="py-1 pl-3 pr-2 text-[14px] font-medium leading-5 tracking-[-0.4px] text-[#333333] underline">Cancel My Order</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
