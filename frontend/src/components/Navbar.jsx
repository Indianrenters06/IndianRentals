"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaBars, FaTimes, FaChevronDown, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Delhi");
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida"];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Apple Products", href: "/category/apple" },
        { name: "IT Products", href: "/category/it-products" },
        { name: "AV Products", href: "/category/av-products" },
        { name: "Office Equipment", href: "/category/office-equipment" },
        { name: "DSLR Cameras", href: "/category/dslr" },
        { name: "More", href: "/more" },
        { name: "Latest Launch", href: "/latest" },
        { name: "Deals %", href: "/deals" },
    ];

    return (
        <header
            className="relative bg-white shadow-xs z-50 pb-3"
        >
            {/* Top Promotional Banner */}
            <div className="bg-[#FFC107] text-black text-xs font-bold text-center py-1.5 px-4 tracking-wide">
                ♥ SAVE Extra 5% up to ₹100 on UPI Orders ♥
            </div>

            {/* Top Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo Section */}
                    <Link href="/" className="shrink-0 flex items-center gap-2">
                        {/* Logo Icon */}
                        <div className="w-10 h-10 flex items-center justify-center relative">
                            <span className="text-4xl font-bold text-green-600 font-serif italic">i</span>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>

                        <div className="flex flex-col -space-y-1">
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-orange-600">
                                    Indian
                                </span>
                                <span className="text-2xl font-bold text-blue-700">
                                    Renters
                                </span>
                                <span className="text-sm font-medium text-blue-500 ml-0.5">.com</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium tracking-wide italic pl-0.5">
                                You Name it We Rent it
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400 group-focus-within:text-indigo-600" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for MacBook Pro 14..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 text-sm"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Location Selector */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors focus:outline-none font-medium"
                                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                            >
                                <FaMapMarkerAlt size={16} />
                                <span className="text-sm">{selectedCity}</span>
                                <FaChevronDown size={10} className={`transform transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* City Dropdown */}
                            <AnimatePresence>
                                {isCityDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                    >
                                        {cities.map((city) => (
                                            <button
                                                key={city}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCity === city ? "text-indigo-600 font-medium" : "text-gray-600"
                                                    }`}
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setIsCityDropdownOpen(false);
                                                }}
                                            >
                                                {city}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Login/Register Button - Yellow */}
                        <button className="px-6 py-2 text-sm font-bold text-gray-900 bg-[#FFC107] hover:bg-[#FFD54F] rounded-full transition-colors shadow-sm">
                            Login/Register
                        </button>

                        {/* Wishlist & Cart */}
                        <div className="flex items-center gap-4 text-gray-600">
                            <button className="hover:text-indigo-600 transition-colors">
                                <FaHeart size={20} />
                            </button>
                            <button className="relative hover:text-indigo-600 transition-colors">
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full">2</span>
                                <FaShoppingCart size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 focus:outline-none p-2"
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary Nav - Categories */}
            <div className="hidden md:block border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center space-x-8 py-3 overflow-x-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[13px] font-medium text-gray-600 hover:text-indigo-600 whitespace-nowrap transition-colors relative group uppercase tracking-wide"
                            >
                                {link.name}
                                <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Mobile Links */}
                            <div className="flex flex-col space-y-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-600 font-medium hover:text-indigo-600 border-b border-gray-50 pb-2 last:border-0"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile Auth */}
                            <div className="pt-4 mt-2">
                                <button className="w-full py-2.5 bg-[#FFC107] text-gray-900 rounded-lg font-bold mb-3 shadow-sm">
                                    Login / Register
                                </button>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 relative w-full">
                                        <FaMapMarkerAlt className="text-gray-500" />
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className="appearance-none bg-transparent font-medium text-gray-700 focus:outline-none w-full cursor-pointer"
                                        >
                                            {cities.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                        <FaChevronDown size={10} className="absolute right-0 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
