"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';

const imgVector2 = "https://www.figma.com/api/mcp/asset/31a2c546-e600-4cc0-a4dd-670ec2ed76e8.svg";

const Sidebar = ({
    selectedDuration,
    setSelectedDuration,
    selectedSort,
    setSelectedSort,
    dealsOnly,
    setDealsOnly
}) => {
    const pathname = usePathname() || "";
    const [localDeals, setLocalDeals] = useState(false);

    const isDealsActive = dealsOnly !== undefined ? dealsOnly : localDeals;
    const handleDealsToggle = () => {
        if (setDealsOnly) {
            setDealsOnly(!dealsOnly);
        } else {
            setLocalDeals(!localDeals);
        }
    };

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
    const sortOptions = ["Most Popular", "Price (high to low)", "Price (low to high)", "New Arrivals"];

    return (
        <aside
            className="shrink-0 hidden lg:flex flex-col bg-[#f6f6f6] border border-[#e2e2e2] gap-[10px] items-start pb-[41.01px] pt-[21px] px-[21px] rounded-[20px] w-[250px]"
            style={{
                fontFamily: "'Mona Sans', sans-serif",
                opacity: 1
            }}
            data-name="filter-Aside"
        >
            {/* 1. BROWSE CATEGORIES */}
            <div className="flex flex-col gap-[12px] items-start w-full">
                <div className="w-full">
                    <p className="font-bold text-[12px] leading-[16px] text-[#757575] tracking-[-0.4px] uppercase m-0">
                        BROWSE CATEGORIES
                    </p>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
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
                                className="group flex items-center justify-between p-[4px] rounded-[6px] w-full transition-colors hover:bg-black/5"
                            >
                                <span
                                    className={`font-['Mona_Sans'] text-[12px] leading-[16px] tracking-[-0.4px] transition-colors ${
                                        isMore
                                            ? 'font-bold text-[#ed2115] underline decoration-solid decoration-[1.5%] text-left'
                                            : isActive
                                            ? 'font-bold text-[#333] text-left'
                                            : 'font-semibold text-[#333] text-left group-hover:text-black'
                                    }`}
                                >
                                    {cat === "DSLR Camera & Lenses" ? "DSLR Camera & Lenses" : cat}
                                </span>
                                {!isMore && (
                                    <ChevronRightIcon
                                        className={`w-[12px] h-[12px] shrink-0 transition-transform duration-200 ${
                                            isActive
                                                ? "text-[#333] translate-x-0.5 font-bold"
                                                : "text-[#333] group-hover:text-black group-hover:translate-x-0.5"
                                        }`}
                                        strokeWidth={2.5}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Separator */}
            <div className="w-[208px] h-0 border-t border-[#e2e2e2] shrink-0 my-1" />

            {/* 2. RENT FOR */}
            <div className="flex flex-col gap-[12.01px] items-start w-full">
                <div className="flex gap-[8px] items-center w-full">
                    <p className="font-bold text-[12px] leading-[16px] text-[#757575] tracking-[-0.4px] uppercase m-0">
                        RENT FOR
                    </p>
                    <div className="w-[16px] h-[16px] shrink-0 relative overflow-hidden">
                        <img alt="info" className="absolute inset-0 size-full block" src={imgVector2} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-[12px] items-start w-full cursor-pointer">
                    {durations.map((duration) => {
                        const isSelected = selectedDuration === duration;
                        return (
                            <button
                                key={duration}
                                type="button"
                                onClick={() => setSelectedDuration && setSelectedDuration(duration)}
                                className={`bg-white border border-solid px-[16px] py-[8px] rounded-[8px] flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-[#1f1f1f] shadow-sm'
                                        : 'border-[#afafaf] hover:border-[#757575]'
                                }`}
                            >
                                <span className={`font-['Mona_Sans'] text-[12px] leading-[16px] tracking-[-0.4px] whitespace-nowrap ${
                                    isSelected ? 'font-bold text-[#1f1f1f]' : 'font-bold text-[#333]'
                                }`}>
                                    {duration}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Separator */}
            <div className="w-[208px] h-0 border-t border-[#e2e2e2] shrink-0 my-1" />

            {/* 3. SORT BY */}
            <div className="flex flex-col gap-[12px] items-start w-full">
                <p className="font-bold text-[12px] leading-[16px] text-[#757575] tracking-[-0.4px] uppercase m-0">
                    SORT BY
                </p>

                <div className="flex flex-col gap-[8px] items-start w-full">
                    {sortOptions.map((option) => {
                        const isSelected = selectedSort === option;
                        return (
                            <div
                                key={option}
                                onClick={() => setSelectedSort && setSelectedSort(option)}
                                className="flex gap-[8px] items-center p-[4px] rounded-[6px] w-full cursor-pointer group transition-colors hover:bg-black/5"
                            >
                                <button
                                    type="button"
                                    className={`size-[20px] rounded-full border shrink-0 relative flex items-center justify-center transition-all ${
                                        isSelected ? 'border-[#1f1f1f]' : 'border-[#afafaf] group-hover:border-[#757575]'
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="size-[8px] rounded-full bg-[#1f1f1f]" />
                                    )}
                                </button>
                                <span className={`font-['Mona_Sans'] text-[12px] leading-[16px] tracking-[-0.4px] whitespace-nowrap transition-colors ${
                                    isSelected ? 'font-bold text-[#1f1f1f]' : 'font-semibold text-[#333] group-hover:text-black'
                                }`}>
                                    {option}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Separator */}
            <div className="w-[208px] h-0 border-t border-[#e2e2e2] shrink-0 my-1" />

            {/* 4. DEALS */}
            <div className="flex flex-col gap-[12px] items-start w-full">
                <p className="font-bold text-[12px] leading-[16px] text-[#757575] tracking-[-0.4px] uppercase m-0">
                    DEALS
                </p>

                <div className="flex flex-col items-start w-full">
                    <div
                        onClick={handleDealsToggle}
                        className="flex gap-[8px] items-center p-[4px] rounded-[6px] w-full cursor-pointer group transition-colors hover:bg-black/5"
                    >
                        <button
                            type="button"
                            className={`size-[14px] bg-white border border-solid rounded-[4px] shrink-0 flex items-center justify-center transition-all ${
                                isDealsActive ? 'bg-[#1f1f1f] border-[#1f1f1f]' : 'border-[#afafaf] group-hover:border-[#757575]'
                            }`}
                        >
                            {isDealsActive && (
                                <CheckIcon className="w-[10px] h-[10px] text-white stroke-[3]" />
                            )}
                        </button>
                        <span className={`font-['Mona_Sans'] text-[12px] leading-[16px] tracking-[-0.4px] whitespace-nowrap transition-colors ${
                            isDealsActive ? 'font-bold text-[#1f1f1f]' : 'font-semibold text-[#333] group-hover:text-black'
                        }`}>
                            Deals
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

