'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartSimple, AddressBook, UserCheck, Truck } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';

const CheckoutHeader = () => {
    const pathname = usePathname();
    const steps = [
        { id: 'checkout', label: 'Checkout', icon: ShoppingCartSimple, path: '/cart' },
        { id: 'address', label: 'Address', icon: AddressBook, path: '/checkout/address' },
        { id: 'verification', label: 'Verification', icon: UserCheck, path: '/checkout/kyc' },
        { id: 'delivery', label: 'Delivery', icon: Truck, path: '/checkout/payment' },
    ];

    const getCurrentStep = () => {
        if (pathname === '/cart') return 'checkout';
        if (pathname.includes('/address')) return 'address';
        if (pathname.includes('/kyc')) return 'verification';
        if (pathname.includes('/payment') || pathname.includes('/success')) return 'delivery';
        return 'checkout';
    };

    const currentStep = getCurrentStep();

    const getStepStatus = (stepId) => {
        const order = ['checkout', 'address', 'verification', 'delivery'];
        const currentIndex = order.indexOf(currentStep);
        const stepIndex = order.indexOf(stepId);

        if (stepIndex === currentIndex) return 'active';
        if (stepIndex < currentIndex) return 'completed';
        return 'pending';
    };

    return (
        <header className="w-full bg-white border-b border-gray-100 flex items-center justify-center h-[60px] sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1200px] w-full mx-auto px-4 md:px-8 flex items-center justify-between" style={{ height: '40px' }}>
                {/* Logo Section */}
                <Link href="/" className="shrink-0">
                    <Image
                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png"
                        alt="Indian Renters - You Name it We Rent it"
                        width={135}
                        height={36}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Progress Steps Section */}
                <div className="hidden md:flex items-center gap-6">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        const Icon = step.icon;

                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex items-center gap-2">
                                    <div className={`p-1 rounded-full transition-colors ${status === 'active' || status === 'completed' ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        <Icon size={18} weight={status === 'pending' ? 'regular' : 'fill'} />
                                    </div>
                                    <span
                                        className={`font-semibold tracking-tight transition-colors flex items-center ${status === 'active' || status === 'completed' ? 'text-emerald-600' : 'text-gray-400'}`}
                                        style={{
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '16px', // Estimated from font/size/3
                                            lineHeight: '23px',
                                            letterSpacing: '0px',
                                            opacity: 1
                                        }}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-[1px] w-12 transition-colors ${status === 'completed' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default CheckoutHeader;
