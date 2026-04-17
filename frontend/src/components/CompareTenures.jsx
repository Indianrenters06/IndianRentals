'use client';

import React from 'react';
import { PiCaretLeft, PiGear } from 'react-icons/pi';

const CompareTenures = ({ isOpen, onClose, selectedTenure, onSelect, tenures }) => {
    // If tenures aren't passed, use hardcoded backups matching the site's logic
    const displayTenures = tenures || [
        { label: '1+', months: 1, price: 2560, originalPrice: 3600, discount: '20% OFF' },
        { label: '3+', months: 3, price: 2304, originalPrice: 3500, discount: '20% OFF' },
        { label: '6+', months: 6, price: 2048, originalPrice: 3400, discount: '20% OFF' },
        { label: '9+', months: 9, price: 1920, originalPrice: 3300, discount: '20% OFF' },
        { label: '12+', months: 12, price: 1792, originalPrice: 3200, discount: '20% OFF' },
    ];

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
                className={`fixed top-[50%] left-0 z-[9999] bg-[#EDEDED] shadow-2xl transition-all duration-500 ease-in-out transform`}
                style={{
                    width: '506px',
                    height: 'auto',
                    minHeight: '600px',
                    padding: '32px 20px',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    transform: isOpen
                        ? 'translateY(-50%) translateX(0)'
                        : 'translateY(-50%) translateX(-100%)',
                    backgroundColor: 'hsla(0, 0%, 93%, 1)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                }}
            >
                <div className="flex flex-col h-full gap-[25px]">
                    <div className="flex flex-col gap-6">
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
                            <span
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    color: 'hsla(3, 88%, 42%, 1)'
                                }}
                            >
                                Back
                            </span>
                        </button>

                        <div
                            className="flex items-center"
                            style={{
                                width: '342.67px',
                                height: '35px',
                                gap: '8px',
                                opacity: 1
                            }}
                        >
                            <h2
                                style={{
                                    width: '308px',
                                    height: '35px',
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '24px',
                                    lineHeight: '35px',
                                    letterSpacing: '0.01em',
                                    color: 'hsla(0, 0%, 0%, 1)',
                                    margin: 0
                                }}
                            >
                                Compare all rental prices
                            </h2>
                            <PiGear size={24} className="text-[#3A9CFF] cursor-pointer" />
                        </div>
                    </div>

                    <div
                        style={{
                            width: '466px',
                            height: 'auto', // Allow height to be auto to fit content or set to 369 matching Figma
                            minHeight: '369px',
                            padding: '14px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            border: '2px solid hsla(0, 0%, 96%, 1)',
                            boxShadow: `
                                0px 3px 6px 0px hsla(0, 0%, 80%, 0.1),
                                0px 12px 12px 0px hsla(0, 0%, 80%, 0.09),
                                0px 26px 16px 0px hsla(0, 0%, 80%, 0.05),
                                0px 46px 18px 0px hsla(0, 0%, 80%, 0.01),
                                0px 72px 20px 0px hsla(0, 0%, 80%, 0)
                            `
                        }}
                    >
                        <div
                            className="flex flex-col h-full"
                            style={{ gap: '14px' }}
                        >
                            {displayTenures.map((item) => (
                                <div
                                    key={item.months}
                                    onClick={() => onSelect(item.months)}
                                    className={`flex items-center transition-all cursor-pointer`}
                                    style={{
                                        width: '439px',
                                        height: '57px',
                                        padding: '12px',
                                        gap: '20px',
                                        borderRadius: '12px',
                                        backgroundColor: selectedTenure === item.months ? '#F0FFF1' : '#FFFFFF',
                                        border: selectedTenure === item.months
                                            ? '1px solid #008A02'
                                            : '1px solid hsla(0, 0%, 89%, 1)',
                                        opacity: 1
                                    }}
                                >
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${selectedTenure === item.months
                                        ? 'border-[#008A02] bg-[#008A02]'
                                        : 'border-gray-300'
                                        }`}>
                                        {selectedTenure === item.months && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        )}
                                    </div>

                                    <div className="bg-[#008A02] text-white px-2 py-1 rounded-md text-[14px] font-bold min-w-[80px] text-center">
                                        {item.months} month
                                    </div>

                                    <div className="flex items-center gap-2 flex-grow overflow-hidden">
                                        <span className="text-[14px] font-bold text-[#1A1A1A] whitespace-nowrap">₹{item.price}/mo</span>
                                        <span className="text-[12px] text-gray-400 line-through whitespace-nowrap">₹{Math.round(item.price * 1.5)}/mo</span>
                                        <span className="text-[12px] text-[#008A02] font-semibold whitespace-nowrap">{item.discount || '55% OFF'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Select Button */}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center hover:opacity-90 transition-opacity"
                        style={{
                            width: '86px',
                            height: '35px',
                            paddingTop: '6px',
                            paddingRight: '20px',
                            paddingBottom: '6px',
                            paddingLeft: '20px',
                            gap: '2px',
                            borderRadius: '9999px',
                            backgroundColor: 'hsla(44, 100%, 64%, 1)',
                            border: 'none',
                            color: '#1A1A1A',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px'
                        }}
                    >
                        Select
                    </button>
                </div>
            </div>
        </>
    );
};

export default CompareTenures;
