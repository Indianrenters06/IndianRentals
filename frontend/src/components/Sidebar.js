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
            className="shrink-0 hidden lg:flex flex-col bg-white"
            style={{
                fontFamily: "'Mona Sans', sans-serif",
                width: '250px',
                minHeight: '754.02px',
                borderRadius: '20px',
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
                        letterSpacing: '-0.4px',
                        margin: 0,
                        opacity: 1
                    }}
                    className="uppercase text-[#F08C00]"
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
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    height: '16px',
                                    letterSpacing: '-0.4px',
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
                                    className={`w-3 h-3 transition-transform duration-200 ${isActive ? "text-black translate-x-1" : "text-[hsla(0,0%,20%,1)] group-hover:text-black group-hover:translate-x-1"}`}
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
                    <h3 className="text-[12px] font-bold text-[#F08C00] uppercase tracking-[-0.4px] m-0">Rent For</h3>
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
                                    letterSpacing: '-0.4px',
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

            <div
                className="flex flex-col"
                style={{
                    width: '208px',
                    height: '164px',
                    gap: '12px',
                    opacity: 1
                }}
            >
                <h3
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '12px',
                        lineHeight: '16px',
                        letterSpacing: '-0.4px',
                        verticalAlign: 'middle',
                        color: 'hsla(35, 100%, 47%, 1)',
                        textTransform: 'uppercase',
                        width: '208px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        margin: 0,
                        opacity: 1
                    }}
                >Sort By</h3>
                <div
                    className="flex flex-col"
                    style={{
                        width: '208px',
                        height: '136px',
                        gap: '8px',
                        opacity: 1
                    }}
                >
                    {["Most Popular", "Price (high to low)", "Price (low to high)", "New Arrivals"].map((option) => (
                        <label
                            key={option}
                            className="flex items-center cursor-pointer group transition-all duration-200"
                            onClick={() => setSelectedSort(option)}
                            style={{
                                width: '208px',
                                height: '28px',
                                borderRadius: '6px',
                                gap: '8px',
                                padding: '4px',
                                opacity: 1
                            }}
                        >
                            <div className={`w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center shrink-0 ${selectedSort === option ? "border-black" : "border-gray-300 group-hover:border-gray-400"}`}>
                                {selectedSort === option && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                            </div>
                            <span style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: selectedSort === option ? 700 : 600,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '-0.4px',
                                verticalAlign: 'middle',
                                color: selectedSort === option ? 'hsla(0, 0%, 0%, 1)' : 'hsla(0, 0%, 20%, 1)',
                                display: 'inline-block',
                                height: '16px',
                                opacity: 1,
                                transition: 'color 0.2s'
                            }}>{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            <div
                className="flex flex-col"
                style={{
                    width: '208px',
                    height: '52px',
                    gap: '12px',
                    opacity: 1
                }}
            >
                <h3 className="text-[12px] font-bold text-[#F08C00] uppercase tracking-[-0.4px] m-0">Deals</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-3.5 h-3.5 rounded border transition-all duration-200 flex items-center justify-center border-[#AFAFAF] group-hover:border-gray-500">
                    </div>
                    <span className="text-[12px] font-semibold text-[#333] tracking-[-0.4px] group-hover:text-black transition-colors duration-200">Deals</span>
                </label>
            </div>
        </aside>
    );
};

export default Sidebar;
