"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ selectedDuration, setSelectedDuration, selectedSort, setSelectedSort }) => {
    const pathname = usePathname() || "";

    const categoryLinks = {
        "Most Rented": "/products",
        "Apple Products": "/category/apple",
        "IT Products": "/category/it-products",
        "AV Products": "/category/av-products",
        "Office Equipment": "/category/office-equipment",
        "DSLR Camera & Lenses": "/category/dslr",
        "Latest Launch": "/products",
        "More": "/categories"
    };

    const categories = Object.keys(categoryLinks);

    const durations = ["1 month", "3 months", "6 months", "9 months", "18 months", "24 months"];

    return (
        <aside
            className="shrink-0 hidden lg:flex flex-col font-sans bg-white"
            style={{
                width: '260px',
                minHeight: '754.02px',
                borderRadius: '20px', // rounded-2xl
                border: '1px solid hsla(0, 0%, 89%, 1)',
                gap: '10px',
                opacity: 1,
                padding: '21px 21px 41.01px 21px'
            }}
        >
            <div
                className="flex flex-col"
                style={{
                    width: '208px',
                    minHeight: '268px',
                    gap: '12px',
                    opacity: 1
                }}
            >
                <h3
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 700,
                        width: '208px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        margin: 0,
                        opacity: 1
                    }}
                    className="uppercase text-orange-500"
                >
                    Browse Categories
                </h3>
                {categories.map((cat) => {
                    const href = categoryLinks[cat] || "#";
                    const isActive = pathname.startsWith(href) && href !== "/products" && href !== "/categories"
                        ? true
                        : pathname === href && (cat === "Most Rented" || cat === "Latest Launch" || cat === "More");

                    const isMore = cat === "More";

                    return (
                        <Link
                            key={cat}
                            href={href}
                            className="group flex items-center justify-between transition-all duration-200"
                            style={{
                                width: '208px',
                                height: '24px',
                                borderRadius: '6px',
                                padding: '4px',
                                opacity: 1
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: isActive || isMore ? 700 : 600,
                                    color: isActive ? 'hsla(0, 0%, 0%, 1)' : isMore ? 'hsla(3, 86%, 51%, 1)' : 'hsla(0, 0%, 20%, 1)',
                                    fontSize: '13px',
                                    lineHeight: '16px',
                                    height: '16px',
                                    letterSpacing: '0.08em',
                                    verticalAlign: 'middle',
                                    display: 'inline-block',
                                    textDecoration: isMore ? 'underline' : 'none',
                                    textDecorationStyle: 'solid',
                                    textUnderlineOffset: isMore ? '2px' : 'auto',
                                    textDecorationThickness: isMore ? '1px' : 'auto',
                                    opacity: 1
                                }}
                                className="transition-colors duration-200 hover:text-black"
                            >
                                {cat}
                            </span>
                            {!isMore && (
                                <ChevronRightIcon
                                    className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-black translate-x-1" : "text-[hsla(0,0%,20%,1)] group-hover:text-black group-hover:translate-x-1"}`}
                                    strokeWidth={2}
                                />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            <div
                className="flex flex-col"
                style={{
                    width: '208px',
                    minHeight: '148.01px',
                    gap: '12px',
                    opacity: 1
                }}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-[12px] font-bold text-orange-500 uppercase tracking-wider m-0">Rent For</h3>
                </div>
                <div
                    className="grid grid-cols-2 m-0"
                    style={{
                        width: '208px',
                        height: '120px',
                        gap: '12px',
                        opacity: 1
                    }}
                >
                    {durations.map((duration) => {
                        const isSelected = selectedDuration === duration;
                        return (
                            <button
                                key={duration}
                                onClick={() => setSelectedDuration(duration)}
                                className={`transition-all duration-200 flex items-center justify-center font-sans ${duration === '9 months' ? 'justify-self-end' : 'justify-self-start'}`}
                                style={{
                                    height: '32px',
                                    width: 'fit-content',
                                    borderRadius: '8px',
                                    border: isSelected ? '1px solid #000' : '1px solid hsla(0, 0%, 69%, 1)',
                                    backgroundColor: 'hsla(0, 0%, 100%, 1)',
                                    padding: '8px 16px',
                                    gap: '10px',
                                    outline: 'none',
                                    boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                <span style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    letterSpacing: '0.08em',
                                    verticalAlign: 'middle',
                                    color: isSelected ? 'hsla(0, 0%, 0%, 1)' : 'hsla(0, 0%, 20%, 1)',
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap',
                                    opacity: 1
                                }}>
                                    {duration}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            <div className="mb-2">
                <h3 className="text-[12px] font-bold text-orange-500 uppercase tracking-wider mb-4">Sort By</h3>
                <div className="space-y-4">
                    {["Most Popular", "Price (high to low)", "Price (low to high)", "New Arrivals"].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedSort(option)}>
                            <div className={`w-4 h-4 rounded-full border transition-all duration-200 flex items-center justify-center ${selectedSort === option ? "border-black" : "border-gray-300 group-hover:border-gray-400"}`}>
                                {selectedSort === option && <div className="w-2 h-2 rounded-full bg-black" />}
                            </div>
                            <span className={`text-[13px] transition-colors duration-200 ${selectedSort === option ? "text-black font-medium" : "text-gray-500 group-hover:text-gray-800"}`}>{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            <div>
                <h3 className="text-[12px] font-bold text-orange-500 uppercase tracking-wider mb-4">Deals</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center border-gray-300 group-hover:border-gray-400">
                    </div>
                    <span className="text-[13px] text-gray-500 group-hover:text-gray-800 transition-colors duration-200">Deals</span>
                </label>
            </div>
        </aside>
    );
};

export default Sidebar;
