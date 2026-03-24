"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaBars, FaTimes, FaChevronDown, FaHeart, FaSignOutAlt, FaLocationArrow } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { useSelector } from "react-redux";
import { selectCartTotalQuantity } from "../redux/features/cartSlice";
import { useSettings } from "../context/SettingsContext";

const Navbar = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Redux Cart Selector
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const { settings } = useSettings();
    const siteLogo = settings?.siteLogo || "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1771271177/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_cf3y9m.png";
    const siteName = settings?.siteName || "Indian Renters";

    // Removed fixed cities array
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

        // Check for user info
        const checkUserInfo = () => {
            const storedUserInfo = localStorage.getItem("userInfo");
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            } else {
                setUserInfo(null);
            }
        };

        const loadLocation = () => {
            const storedLocation = localStorage.getItem("userLocation");
            if (storedLocation) {
                setSelectedCity(storedLocation);
                setLocationInput(storedLocation);
            }
        };

        checkUserInfo();
        loadLocation();

        window.addEventListener("userInfoChanged", checkUserInfo);
        // Listen for storage events (in case login happens in another tab/window)
        window.addEventListener("storage", checkUserInfo);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("userInfoChanged", checkUserInfo);
            window.removeEventListener("storage", checkUserInfo);
        };
    }, []);

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocationInput("Fetching...");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await response.json();

                    const city = data.city || data.locality || data.principalSubdivision;
                    if (city) {
                        setSelectedCity(city);
                        setLocationInput(city);
                        localStorage.setItem('userLocation', city);
                        setIsCityDropdownOpen(false);
                    } else {
                        setLocationInput("");
                        alert("Could not determine city from location.");
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                    setLocationInput("");
                    alert("Failed to fetch location data.");
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                setLocationInput("");
                alert("Please allow location access to use this feature.");
            }
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
        setIsProfileDropdownOpen(false);
        router.push("/login"); // or router.push('/')
        // Optionally dispatch a custom event if other components need to know
    };

    const navLinks = [
        { name: "Apple Products", href: "/category/apple" },
        { name: "IT Products", href: "/category/it-products" },
        { name: "AV Products", href: "/category/av-products" },
        { name: "Office Equipment", href: "/category/office-equipment" },
        { name: "DSLR Cameras", href: "/category/dslr" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "More", href: "/categories" },
        { name: "Latest Launch", href: "/products" },
        { name: "Deals %", href: "/products" }
    ];

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                router.push(`/products?keyword=${encodeURIComponent(query)}`);
            }
        }
    };

    return (
        <header className="relative bg-white shadow-xs z-50">
            <div className="bg-orange-300 text-black text-xs font-semibold flex items-center justify-center overflow-hidden w-full h-[35px] desktop:h-[40px]">
                ♥ SAVE Extra 5% up to ₹100 on UPI Orders ♥
            </div>

            {/* Top Bar */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-[10px]">

                    {/* Left Section: Mobile Menu + Logo */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-800 focus:outline-none p-1"
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <Image
                                src={siteLogo}
                                alt={`${siteName} - You Name it We Rent it`}
                                width={150}
                                height={40}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400 group-focus-within:text-indigo-600" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for MacBook Pro 14..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 text-sm"
                            onKeyDown={handleSearch}
                        />
                    </div>

                    {/* Right Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors focus:outline-none font-medium"
                                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                                    <FaMapMarkerAlt size={16} />
                                </div>
                                <span className="text-sm font-bold truncate max-w-[150px]">
                                    {selectedCity || "Enter your location"}
                                </span>
                                <FaChevronDown size={10} className={`transform transition-transform duration-200 shrink-0 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* City Dropdown -> Location Input Modal/Popover */}
                            <AnimatePresence>
                                {isCityDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50"
                                    >
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Enter your location
                                        </label>
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="text"
                                                value={locationInput}
                                                onChange={(e) => setLocationInput(e.target.value)}
                                                placeholder="e.g. MG Road, Bangalore"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = locationInput.trim();
                                                        if (val) {
                                                            setSelectedCity(val);
                                                            localStorage.setItem('userLocation', val);
                                                            setIsCityDropdownOpen(false);
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                className="w-full bg-indigo-600 text-white font-bold text-sm py-2 rounded-lg hover:bg-indigo-700 transition"
                                                onClick={() => {
                                                    const val = locationInput.trim();
                                                    if (val && val !== "Fetching...") {
                                                        setSelectedCity(val);
                                                        localStorage.setItem('userLocation', val);
                                                        setIsCityDropdownOpen(false);
                                                    }
                                                }}
                                            >
                                                Save Location
                                            </button>

                                            <div className="relative flex items-center py-1">
                                                <div className="grow border-t border-gray-100"></div>
                                                <span className="shrink-0 mx-2 text-gray-400 text-xs">OR</span>
                                                <div className="grow border-t border-gray-100"></div>
                                            </div>

                                            <button
                                                className="w-full flex items-center justify-center gap-2 bg-gray-50 text-indigo-600 border border-indigo-100 font-bold text-sm py-2 rounded-lg hover:bg-indigo-50 transition"
                                                onClick={fetchLocation}
                                            >
                                                <FaLocationArrow size={12} />
                                                Use my current location
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>


                        {/* Login/Register or Profile (Desktop) */}
                        {userInfo ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors focus:outline-none"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                                        <FaUser size={14} />
                                    </div>
                                    <span className="text-sm font-medium hidden lg:block max-w-[100px] truncate">
                                        {userInfo.name || userInfo.email}
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-white/60 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <p className="text-sm font-bold text-gray-900 truncate">{userInfo.name || "User"}</p>
                                                <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                            </div>

                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                                                <FaUser size={14} className="text-gray-400" /> My Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <FaSignOutAlt size={14} /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer text-center rounded-md border h-10 w-full px-6 py-2 tablet:h-9 tablet:w-auto tablet:min-w-[110px] tablet:px-[22px] tablet:py-[9px] desktop:h-[35px] desktop:min-w-[120px] desktop:px-5 desktop:py-2 bg-orange-300 text-black border-orange-300 hover:bg-orange-400 hover:border-orange-400 active:bg-orange-500 active:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-info focus:ring-offset-2 focus:border-blue-info disabled:bg-orange-100 disabled:text-grey-400 disabled:border-orange-100 disabled:opacity-50 disabled:cursor-not-allowed !h-auto !py-2 !px-6 !rounded-full shadow-sm"
                            >
                                Login/Register
                            </button>
                        )}

                        {/* Wishlist & Cart (Desktop) */}
                        <div className="flex items-center gap-4 text-gray-600">
                            <button className="hover:text-indigo-600 transition-colors">
                                <FaHeart size={20} />
                            </button>
                            <Link href="/cart" className="relative hover:text-indigo-600 transition-colors">
                                <FaShoppingCart size={20} />
                                {totalQuantity > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>


                    {/* Mobile Controls (Right: Location + Cart) */}
                    <div className="md:hidden flex items-center gap-3">
                        {/* Mobile Location Pill */}
                        <button
                            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-100 max-w-[140px]"
                        >
                            <FaMapMarkerAlt size={12} className="text-gray-500 shrink-0" />
                            <span className="truncate">{selectedCity || "Location"}</span>
                        </button>

                        {/* Mobile Cart */}
                        <Link href="/cart" className="relative text-gray-700 hover:text-indigo-600 p-1">
                            <FaShoppingCart size={20} />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>      {/* Secondary Nav - Categories */}
            <div className="hidden md:block border-t border-b border-gray-200 bg-white">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center space-x-8 py-1 overflow-x-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[14px] font-medium text-gray-600 hover:text-black whitespace-nowrap transition-colors relative group tracking-wide"
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
                                    onKeyDown={handleSearch}
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
                                {userInfo ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                                                <FaUser size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{userInfo.name || "User"}</p>
                                                <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/profile" className="block w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full py-2 px-4 text-sm font-medium text-red-600 bg-red-50 rounded-lg text-center"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="block w-full text-center py-2.5 bg-amber-300 text-gray-900 rounded-lg font-bold mb-3 shadow-sm"
                                    >
                                        Login / Register
                                    </button>
                                )}

                                <div className="p-4 bg-gray-50 rounded-lg mt-3">
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        Enter your location
                                    </label>
                                    <div className="flex flex-col gap-3 relative w-full">
                                        <div className="flex gap-2 w-full">
                                            <div className="relative flex-1">
                                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={locationInput}
                                                    onChange={(e) => setLocationInput(e.target.value)}
                                                    placeholder="Your location"
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                />
                                            </div>
                                            <button
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition"
                                                onClick={() => {
                                                    const val = locationInput.trim();
                                                    if (val && val !== "Fetching...") {
                                                        setSelectedCity(val);
                                                        localStorage.setItem('userLocation', val);
                                                    }
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>

                                        <div className="relative flex items-center py-1">
                                            <div className="grow border-t border-gray-200"></div>
                                            <span className="shrink-0 mx-2 text-gray-400 text-xs">OR</span>
                                            <div className="grow border-t border-gray-200"></div>
                                        </div>

                                        <button
                                            className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 font-bold text-sm py-2 rounded-lg hover:bg-indigo-50 transition"
                                            onClick={fetchLocation}
                                        >
                                            <FaLocationArrow size={12} />
                                            Use my current location
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView="login"
            />
        </header >
    );
};

export default Navbar;
