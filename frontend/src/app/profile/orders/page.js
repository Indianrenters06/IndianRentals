'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiSmileySad } from 'react-icons/pi';

import { getMyOrders, cancelOrder } from '../../../services/orderService';
import { getKYCStatus } from '../../../services/kycService';
import InfoIcon from '../../../components/common/InfoIcon';

// Status pill — Figma "Process-tags" shape (rounded-16, px-8 py-4, 12px semibold), colour per status.
const StatusTag = ({ status }) => {
    const map = {
        'Active': { label: 'Active Order', cls: 'bg-[#edfaff] border-[#0689ff] text-[#0689ff]' },
        'KYC Pending': { label: 'In Process', cls: 'bg-[#fff3d3] border-[#ff7a00] text-[#ff7a00]' },
        'Under Review': { label: 'Under Review', cls: 'bg-[#fff3d3] border-[#ff7a00] text-[#ff7a00]' },
        'Inactive': { label: 'Inactive Order', cls: 'bg-[#f6f6f6] border-[#545454] text-[#545454]' },
        'Failed': { label: 'Order Failed', cls: 'bg-[#fdecec] border-[#ed2115] text-[#ed2115]' },
    };
    const { label, cls } = map[status] || map['Under Review'];
    return (
        <span className={`shrink-0 whitespace-nowrap rounded-[16px] border px-2 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] ${cls}`}>
            {label}
        </span>
    );
};

// Rental.status (backend enum) → the status vocabulary the Figma card is drawn for.
const STATUS_MAP = {
    Pending: 'Under Review',
    Approved: 'Under Review',
    Shipped: 'Under Review',
    Delivered: 'Active',
    Active: 'Active',
    Returned: 'Inactive',
    // Figma reserves "Order Failed" for KYC rejection ("Re-submit KYC Form"),
    // so a customer cancellation belongs under Inactive Orders.
    Cancelled: 'Inactive',
};

// Figma splits every not-yet-delivered order by the customer's KYC state rather than the
// rental's: no documents yet -> "In Process", submitted -> "Under Review", rejected -> "Order Failed".
const deriveStatus = (rental, kycStatus) => {
    const fromRental = STATUS_MAP[rental.status] || 'Under Review';
    if (fromRental !== 'Under Review') return fromRental; // already Active / Inactive
    if (kycStatus === 'rejected') return 'Failed';
    if (kycStatus === 'approved' || kycStatus === 'pending' || kycStatus === 'review') return 'Under Review';
    return 'KYC Pending'; // no record, not submitted, or incomplete
};

const ordinalSuffix = (day) => (day > 3 && day < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th');

// "25th Aug 2025" — Figma baselines the ordinal at 7.74px against the 12px date, it is not raised.
const OrdinalDate = ({ value }) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    const day = d.getDate();
    return (
        <>
            {day}
            <span className="text-[7.74px] font-semibold">{ordinalSuffix(day)}</span>
            {` ${d.toLocaleDateString('en-GB', { month: 'short' })} ${d.getFullYear()}`}
        </>
    );
};

// Bordered chip: "Label value" — Figma "Frame 431/432".
const Chip = ({ label, value, valueColor = 'text-[#333333]' }) => (
    <div className="flex items-center gap-2 rounded-[4px] border border-[#cbcbcb] px-[5px] py-[2px] whitespace-nowrap">
        <span className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">{label}</span>
        <span className={`text-[12px] font-semibold leading-4 tracking-[-0.4px] ${valueColor}`}>{value}</span>
    </div>
);

// Card actions — Figma "Blue-Secondary-btn", the black pill, and "Secondary-Black-Btn".
const invoicesBtn = 'flex h-[24px] w-full items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]';
// The Active Orders screen (node 23280:9781) sizes the same button 127x32 rather than full-width x 24.
const invoicesBtnActive = 'flex h-[32px] w-[127px] items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]';
// Filled "Secondary-Black-Btn" (node 23280:9849) — hugs its label, 14px medium, so 28px tall.
const rentAgainBtn = 'flex items-center justify-center rounded-[28px] bg-[#333333] py-1 pl-3 pr-2 text-[14px] font-medium leading-5 tracking-[-0.4px] text-white';
// Figma style "Typography/text-sm/Link" is weight 700.
const cancelLink = 'py-1 pl-3 pr-2 text-[14px] font-bold leading-5 tracking-[-0.4px] text-[#333333] underline';

// The design has no per-order invoice document, only the My Invoices list — so open it scoped to this order.
const invoiceHref = (order) => `/profile/invoices?order=${encodeURIComponent(order.id)}`;
const rentAgainHref = (order) => (order.productId ? `/products/${order.productId}` : '/products');

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
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [data, kyc] = await Promise.all([getMyOrders(), getKYCStatus()]);
                const kycStatus = String(kyc?.status || '').toLowerCase();
                // shippingAddress carries no name, so "Delivery to" comes from the signed-in user.
                const stored = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
                const userName = stored ? JSON.parse(stored).name : null;
                const mappedOrders = data.map(order => ({
                    id: order._id.substring(order._id.length - 6).toUpperCase(),
                    fullId: order._id,
                    date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
                    deliveryTo: userName || 'Customer',
                    monthlyRent: order.orderItems && order.orderItems[0] ? order.orderItems[0].price : 0,
                    securityAmount: order.orderItems && order.orderItems[0] ? order.orderItems[0].securityDeposit : 0,
                    partialAmount: order.totalPrice,
                    status: deriveStatus(order, kycStatus),
                    productName: order.orderItems && order.orderItems[0] ? order.orderItems[0].name : 'Rental Product',
                    productId: order.orderItems && order.orderItems[0] ? order.orderItems[0].product : null,
                    planDuration: order.rentalPeriod?.durationMonths ? `${order.rentalPeriod.durationMonths} months` : '3 months',
                    rentalStart: order.rentalPeriod?.startDate,
                    rentalEnd: order.rentalPeriod?.endDate,
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
            if (activeTab === 'KYC Pending' && order.status === 'KYC Pending') return true;
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

    const handleCancelConfirm = async () => {
        if (!cancelTarget) return;
        setCancelling(true);
        setCancelError('');
        try {
            await cancelOrder(cancelTarget.fullId);
            setOrders(prev => prev.map(o => (
                o.fullId === cancelTarget.fullId ? { ...o, status: 'Inactive' } : o
            )));
            setCancelTarget(null);
        } catch (err) {
            setCancelError(err?.response?.data?.message || 'Could not cancel this order. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    const handleViewChange = (type) => {
        setViewType(type);
        setActiveTab(type === 'orders' ? 'All Orders' : 'All Subscriptions');
    };

    // Figma varies one word per tab: "…has been failed…" (Order Failed), "…has been cancelled…" (Active Orders).
    const infoText = viewType === 'subscriptions'
        ? 'Once you order, Your order is automatically made into a subscription. You can extend your current subscription, cancel or renew your old subscription.'
        : activeTab === 'Order Failed'
            ? 'Please note, once the order has been failed your amount will be returned within 24-48 hours of cancellation'
            : (activeTab === 'Active Orders' || activeTab === 'Inactive Orders')
                ? 'Please note, once the order has been cancelled your amount will be returned within 24-48 hours of cancellation'
                : 'Please note, once the order has been your amount will be returned within 24-48 hours of cancellation';

    return (
        <div className="flex flex-col gap-3">
            {/* Toggle — My Orders / Subscriptions */}
            <div className="flex items-start gap-[10px]">
                {[{ key: 'orders', label: 'My Orders' }, { key: 'subscriptions', label: 'Subscriptions' }].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => handleViewChange(key)}
                        className={`flex flex-1 items-center justify-center rounded-[59px] py-[7px] text-[14px] lg:text-[18px] font-normal leading-[20px] lg:leading-[25px] tracking-[-0.8px] transition-colors ${viewType === key ? 'bg-[#333333] text-[#eeeeee]' : 'bg-[#eeeeee] text-[#333333]'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tabs — Figma exact: 12px font, flex-wrap, gap-x-6 gap-y-2 */}
            <div className="flex flex-wrap items-start gap-x-6 gap-y-2 py-[10px]">
                {currentTabs.map((tab) => {
                    const active = activeTab === tab;
                    return (
                        <button key={tab} onClick={() => setActiveTab(tab)} className="flex flex-col items-start gap-1 shrink-0">
                            <span className={`text-[12px] lg:text-[16px] font-semibold leading-[18px] lg:leading-[23px] tracking-[-0.4px] whitespace-nowrap ${active ? 'text-[#0d4e9b]' : 'text-[#1f1f1f]'}`}>
                                {tab}
                            </span>
                            {active && <span className="h-[2px] w-full rounded-[10px] bg-[#0d4e9b]" />}
                        </button>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#afafaf]" />

            {/* Info banner */}
            <div className="flex items-center gap-[9px] self-start rounded-[6px] border border-[#e2e2e2] bg-[#f6f6f6] px-[10px] py-[5px]">
                <InfoIcon />
                <p className="text-[8px] lg:text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">{infoText}</p>
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
                <div className="flex flex-col gap-3">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="w-full overflow-hidden rounded-[16px] border-[1.5px] border-[#e2e2e2] bg-white shadow-[0px_6px_13px_0px_rgba(245,245,245,0.5)]"
                        >
                            {/* ── MOBILE CARD: Figma exact layout ── */}
                            <div className="lg:hidden">
                                {/* Header: all 6 fields flex-wrap, label 8px / value 10px */}
                                <div className="border-b-[1.5px] border-[#e2e2e2] px-4 py-2 flex flex-col gap-[10px]">
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-start">
                                        {[
                                            { label: 'Order Date', value: order.date },
                                            { label: 'Order No.', value: order.id },
                                            { label: 'Delivery to', value: order.deliveryTo },
                                            { label: 'Monthly Rent', value: `₹${order.monthlyRent}/mo` },
                                            { label: 'Security Amount', value: `₹${parseFloat(order.securityAmount || 0).toFixed(2)}` },
                                            { label: 'Partial Amount', value: `₹${order.partialAmount}` },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex flex-col gap-[2px] items-start justify-center">
                                                <p className="text-[8px] font-semibold text-[#757575] tracking-[-0.4px]">{label}</p>
                                                <p className="text-[10px] font-semibold text-[#333333] tracking-[-0.4px]">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Status tag below fields */}
                                    <StatusTag status={order.status} />
                                </div>

                                {/* Product section: image above name, chips stacked vertically */}
                                <div className="px-4 py-3 flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        {/* Product image */}
                                        <div className="relative w-[67px] h-[67px] shrink-0 overflow-hidden">
                                            <Image src={order.image} alt={order.productName} fill className="object-cover" sizes="67px" />
                                        </div>
                                        {/* Product name */}
                                        <p className="text-[12px] font-semibold text-[#333333] tracking-[-0.4px]" title={order.productName}>
                                            {order.productName}
                                        </p>
                                        {/* Chips: label on top, value below (stacked vertically) */}
                                        <div className="flex flex-wrap gap-1">
                                            <div className="border border-[#cbcbcb] rounded-[4px] px-[5px] py-[2px] flex flex-col gap-0">
                                                <p className="text-[8px] font-semibold text-[#757575] tracking-[-0.4px]">Plan Duration</p>
                                                <p className="text-[8px] font-semibold text-[#333333] tracking-[-0.4px]">{order.planDuration}</p>
                                            </div>
                                            <div className="border border-[#cbcbcb] rounded-[4px] px-[5px] py-[2px] flex flex-col gap-0">
                                                <p className="text-[8px] font-semibold text-[#757575] tracking-[-0.4px]">Rental Period</p>
                                                <p className="text-[8px] font-semibold text-[#545454] tracking-[-0.4px]">
                                                    <OrdinalDate value={order.rentalStart} /> to <OrdinalDate value={order.rentalEnd} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons — full width */}
                                    <div className="flex flex-col gap-1">
                                        {viewType === 'subscriptions' ? (
                                            order.status === 'Inactive' ? (
                                                <>
                                                    <Link href={rentAgainHref(order)} className={invoicesBtn}>Rent Again</Link>
                                                    <Link href={invoiceHref(order)} className={invoicesBtn}>Invoices</Link>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={invoicesBtn}>Extend Tenure</button>
                                                    <button onClick={() => { setCancelError(''); setCancelTarget(order); }} className="text-center py-1 text-[10px] font-bold text-[#333333] underline tracking-[-0.4px]">Cancel My Order</button>
                                                </>
                                            )
                                        ) : order.status === 'Inactive' ? (
                                            <Link href={rentAgainHref(order)} className={invoicesBtn}>Rent Again</Link>
                                        ) : order.status === 'Failed' ? (
                                            <Link href="/profile/kyc" className={invoicesBtn}>Re-submit KYC Form</Link>
                                        ) : order.status === 'KYC Pending' ? (
                                            <button onClick={() => { setCancelError(''); setCancelTarget(order); }} className="text-center py-1 text-[10px] font-bold text-[#333333] underline tracking-[-0.4px]">Cancel My Order</button>
                                        ) : (
                                            <>
                                                <Link href={invoiceHref(order)} className={invoicesBtn}>Invoices</Link>
                                                <button onClick={() => { setCancelError(''); setCancelTarget(order); }} className="text-center py-1 text-[10px] font-bold text-[#333333] underline tracking-[-0.4px]">Cancel My Order</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── DESKTOP CARD: original horizontal layout ── */}
                            <div className="hidden lg:block pb-4">
                                <div className="flex w-full items-center justify-between gap-4 overflow-x-auto border-b-[1.5px] border-[#e2e2e2] px-4 py-2 scrollbar-hide">
                                    <div className="flex shrink-0 items-center gap-[53px]">
                                        <HeaderCell label="Order Date" value={order.date} />
                                        <HeaderCell label="Order No." value={order.id} />
                                        <HeaderCell label="Delivery to" value={order.deliveryTo} />
                                        <HeaderCell label="Monthly Rent" value={`₹${order.monthlyRent}/mo`} />
                                        <HeaderCell label="Security Amount" value={`₹${parseFloat(order.securityAmount || 0).toFixed(2)}`} />
                                        <HeaderCell label="Partial Amount" value={`₹${order.partialAmount}`} />
                                    </div>
                                    <StatusTag status={order.status} />
                                </div>
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
                                                <Chip
                                                    label="Rental Period"
                                                    value={<><OrdinalDate value={order.rentalStart} /> to <OrdinalDate value={order.rentalEnd} /></>}
                                                    valueColor="text-[#545454]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-[130px] shrink-0 flex-col items-end gap-[6px]">
                                        {viewType === 'subscriptions' ? (
                                            order.status === 'Inactive' ? (
                                                <>
                                                    <Link href={rentAgainHref(order)} className={rentAgainBtn}>Rent Again</Link>
                                                    <Link href={invoiceHref(order)} className={invoicesBtn}>Invoices</Link>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={invoicesBtn}>Extend Tenure</button>
                                                    <button onClick={() => { setCancelError(''); setCancelTarget(order); }} className={cancelLink}>Cancel My Order</button>
                                                </>
                                            )
                                        ) : order.status === 'Inactive' ? (
                                            <Link href={rentAgainHref(order)} className={rentAgainBtn}>Rent Again</Link>
                                        ) : order.status === 'Failed' ? (
                                            <Link href="/profile/kyc" className={rentAgainBtn}>Re-submit KYC Form</Link>
                                        ) : order.status === 'KYC Pending' ? (
                                            <button onClick={() => { setCancelError(''); setCancelTarget(order); }} className={cancelLink}>Cancel My Order</button>
                                        ) : (
                                            <>
                                                <Link href={invoiceHref(order)} className={order.status === 'Active' ? invoicesBtnActive : invoicesBtn}>Invoices</Link>
                                                <button onClick={() => { setCancelError(''); setCancelTarget(order); }} className={cancelLink}>Cancel My Order</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cancel confirmation modal */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div role="dialog" aria-modal="true" className="w-full max-w-[400px] rounded-[16px] border-[1.5px] border-[#e2e2e2] bg-white p-5">
                        <p className="text-[16px] font-semibold leading-[23px] tracking-[-0.4px] text-[#333333]">Cancel this order?</p>
                        <p className="mt-2 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">
                            Order #{cancelTarget.id} — {cancelTarget.productName}. Any amount paid is returned within 24-48 hours of cancellation. This cannot be undone.
                        </p>
                        {cancelError && (
                            <p className="mt-3 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#ed2115]">{cancelError}</p>
                        )}
                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setCancelTarget(null)}
                                disabled={cancelling}
                                className="rounded-[28px] bg-[#eeeeee] px-4 py-[6px] text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#333333] disabled:opacity-50"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                disabled={cancelling}
                                className="rounded-[28px] bg-[#ed2115] px-4 py-[6px] text-[12px] font-semibold leading-4 tracking-[-0.4px] text-white disabled:opacity-50"
                            >
                                {cancelling ? 'Cancelling…' : 'Yes, Cancel Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

