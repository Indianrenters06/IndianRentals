'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaRegAddressCard, FaUserCheck, FaTruck } from 'react-icons/fa';

import { usePathname } from 'next/navigation';

const CartHeader = () => {
    const pathname = usePathname();

    const steps = [
        { name: "Checkout", icon: FaShoppingCart, path: "/cart" },
        { name: "Address", icon: FaRegAddressCard, path: "/checkout/address" },
        { name: "Verification", icon: FaUserCheck, path: "/checkout/kyc" },
        { name: "Delivery", icon: FaTruck, path: "/checkout/payment" }, // Payment/Delivery
    ];

    // Determine active step index
    // If exact match or sub-path match (simple logic)
    const activeStepIndex = steps.findIndex(step => pathname.includes(step.path));
    const currentStepIndex = activeStepIndex === -1 ? 0 : activeStepIndex;

    return (
        <header className="bg-white border-b border-gray-200 py-2 sticky top-0 z-[60]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="shrink-0">
                    <Image
                        src="/logo-v2.png"
                        alt="Indian Renters - You Name it We Rent it"
                        width={200}
                        height={54}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Steps Indicator */}
                <div className="flex items-center gap-2 md:gap-4 text-sm font-medium overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {steps.map((step, index) => {
                        // Logic: 
                        // - Active if it is the current step
                        // - Completed/Green if it is a previous step
                        // - Gray if future
                        // Actually typically: Past & Current = Green? Or Current = Active Color, Past = Green?
                        // Based on image: Active is Green text + Icon. Inactive is Gray.

                        const isActive = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <React.Fragment key={step.name}>
                                {/* Step Item */}
                                <div className={`flex items-center gap-2 ${isActive ? 'text-[#00C853]' : 'text-gray-400'}`}>
                                    <step.icon size={18} />
                                    <span>{step.name}</span>
                                </div>

                                {/* Divider (if not last) */}
                                {index < steps.length - 1 && (
                                    <div className={`h-px w-8 md:w-12 ${index < currentStepIndex ? 'bg-[#00C853]' : 'bg-gray-300'}`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default CartHeader;
