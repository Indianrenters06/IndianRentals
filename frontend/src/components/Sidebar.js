"use client";
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

const Sidebar = ({ selectedDuration, setSelectedDuration, selectedSort, setSelectedSort }) => {
    const categories = [
        "Most Rented", "Apple Products", "IT Products", "AV Products",
        "Office Equipment", "DSLR Camera & Lenses", "Latest Launch", "More"
    ];
    const durations = ["1 month", "3 months", "6 months", "9 months", "18 months", "24 months"];

    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 min-h-screen font-sans">
            <div className="mb-10">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Browse Categories</h3>
                <ul className="space-y-4">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <Link href="#" className={`flex items-center justify-between text-[14px] group transition-all duration-200 ${cat === "Apple Products" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}`}>
                                {cat}
                                <span className={`text-lg transition-transform duration-200 ${cat === "Apple Products" ? "text-black translate-x-1" : "text-gray-300 group-hover:text-black group-hover:translate-x-1"}`}>›</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-10 border-t border-gray-100 pt-8">
                <div className="flex items-center gap-2 mb-5">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rent For</h3>
                    <FaInfoCircle className="text-gray-300 hover:text-gray-500 cursor-help" size={12} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {durations.map((duration) => (
                        <button key={duration} onClick={() => setSelectedDuration(duration)} className={`px-3 py-2.5 text-[13px] font-medium rounded-xl border transition-all duration-200 ${selectedDuration === duration ? "border-black bg-white text-black shadow-sm ring-1 ring-black/5" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-transparent"}`}>{duration}</button>
                    ))}
                </div>
            </div>
            <div className="mb-10 border-t border-gray-100 pt-8">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Sort By</h3>
                <div className="space-y-4">
                    {["Most Popular", "Price (high to low)", "Price (low to high)", "New Arrivals"].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedSort(option)}>
                            <div className={`w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center ${selectedSort === option ? "border-black" : "border-gray-300 group-hover:border-gray-400"}`}>
                                {selectedSort === option && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                            </div>
                            <span className={`text-[14px] transition-colors duration-200 ${selectedSort === option ? "text-black font-medium" : "text-gray-500 group-hover:text-gray-800"}`}>{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
