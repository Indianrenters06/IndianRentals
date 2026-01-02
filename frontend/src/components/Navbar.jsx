"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaBars, FaTimes, FaChevronDown, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Delhi");

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
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-md py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="shrink-0 flex items-center gap-2">
                        {/* Placeholder Logo */}
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            IR
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500">
                            IndianRenters
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <input
                            type="text"
                            placeholder="Search for MacBook, DSLR, Projectors..."
                            className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-sm"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                            <FaSearch size={14} />
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Location Selector */}
                        <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
                            <FaMapMarkerAlt size={16} />
                            <span className="text-sm font-medium">{selectedCity}</span>
                            <FaChevronDown size={10} />
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <button className="px-6 py-2 text-sm font-semibold text-whitefrontend v bg-indigo-700 hover:bg-indigo-500 rounded-full transition-colors">
                                Login/Register
                            </button>
                        </div>

                        {/* Wishlist */}
                        <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <FaHeart size={20} />
                        </button>

                        {/* Cart */}
                        <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            <FaShoppingCart size={20} />
                        </button>

                        {/* Hamburger Menu (Desktop & Mobile) */}
                        <button
                            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>

                    {/* Mobile Hamburger (Visible only on mobile) */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Secondary Nav - Categories */}
                <div className="hidden md:flex items-center justify-center py-3 border-t border-gray-100 mt-2">
                    <div className="flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
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
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
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
                                        className="text-gray-600 font-medium hover:text-indigo-600"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile Auth */}
                            <div className="pt-4 border-t border-gray-100">
                                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold mb-2">
                                    Login / Register
                                </button>
                                <div className="flex items-center justify-between mt-4 text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <FaMapMarkerAlt /> {selectedCity}
                                    </span>
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
