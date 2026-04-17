'use client';

import React from 'react';
import { PiCaretLeft, PiTruck } from 'react-icons/pi';

const CancellationSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 z-[9998] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Side Panel */}
            <div 
                className={`fixed top-0 right-0 z-[9999] h-full bg-[#EDEDED] shadow-2xl transition-transform duration-500 ease-in-out transform`}
                style={{
                    width: '335px',
                    height: '100vh',
                    padding: '32px 20px',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    backgroundColor: 'hsla(0, 0%, 93%, 1)'
                }}
            >
                <div className="flex flex-col h-full gap-6">
                    {/* Header */}
                    <button 
                        onClick={onClose}
                        className="flex items-center hover:opacity-80 transition-opacity"
                        style={{
                            width: '77.67px',
                            height: '29px',
                            paddingTop: '3px',
                            paddingRight: '12px',
                            paddingBottom: '3px',
                            paddingLeft: '8px',
                            gap: '2px',
                            borderRadius: '18px',
                            backgroundColor: 'hsla(4, 100%, 97%, 1)',
                            border: '1px solid hsla(3, 88%, 42%, 1)'
                        }}
                    >
                        <PiCaretLeft size={16} color="hsla(3, 88%, 42%, 1)" />
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '14px', color: 'hsla(3, 88%, 42%, 1)' }}>Back</span>
                    </button>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <PiTruck size={24} className="text-[#FF5A00]" />
                            <h2 className="text-[20px] font-bold text-[#1A1A1A] font-sans">
                                Cancellation & Returns
                            </h2>
                        </div>
                        <p className="text-[12px] text-gray-500 leading-tight">
                            Lorem ipsum dolor sit amet consectetur. Vel id elementum ultrices vestibulum consequat leo.
                        </p>
                    </div>

                    <div 
                        className="bg-white"
                        style={{
                            position: 'absolute',
                            top: '181px',
                            left: '20px',
                            width: '295px',
                            height: '429px',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: `
                                0px 3px 6px 0px hsla(0, 0%, 80%, 0.1),
                                0px 12px 12px 0px hsla(0, 0%, 80%, 0.09),
                                0px 26px 16px 0px hsla(0, 0%, 80%, 0.05),
                                0px 46px 18px 0px hsla(0, 0%, 80%, 0.01),
                                0px 72px 20px 0px hsla(0, 0%, 80%, 0)
                            `
                        }}
                    >
                        <div className="space-y-8 flex flex-col h-full">
                            <section>
                                <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-4">1. Cancellation Before Delivery</h3>
                                <ul className="space-y-3 text-[13px] text-gray-600">
                                    <li className="flex gap-2">
                                        <span className="shrink-0">•</span>
                                        <span>If you cancel your order before the product is delivered, no additional charges will apply.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="shrink-0">•</span>
                                        <span>You can request cancellation through our chat support</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-4">2. Return Policy</h3>
                                <ul className="space-y-3 text-[13px] text-gray-600">
                                    <li className="flex gap-2">
                                        <span className="shrink-0">•</span>
                                        <span>If you cancel your order before the product is delivered, no additional charges will apply.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="shrink-0">•</span>
                                        <span>If you cancel your order before the product is delivered, no additional charges will apply.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="shrink-0">•</span>
                                        <span>You can request cancellation through our chat support</span>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CancellationSidebar;
