"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, MapPin, ArrowRight, Heart, ShoppingCartSimple, List, MagnifyingGlass, X, CaretDown, SignOut, NavigationArrow } from "@phosphor-icons/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { useSelector } from "react-redux";
import { selectCartTotalQuantity } from "../redux/features/cartSlice";
import { useSettings } from "../context/SettingsContext";
import { getCategories } from "../services/categoryService";

const Navbar = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isHamburgerDropdownOpen, setIsHamburgerDropdownOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeArea, setPincodeArea] = useState("");
    const [pincodeError, setPincodeError] = useState("");
    const [fetchedCategories, setFetchedCategories] = useState([]);

    // Redux Cart Selector
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const { settings } = useSettings();
    const siteLogo = settings?.siteLogo || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
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

        const fetchNavCategories = async () => {
            try {
                const cats = await getCategories();
                setFetchedCategories(cats || []);
            } catch (err) {
                console.error("Error fetching categories for navbar", err);
            }
        };

        checkUserInfo();
        loadLocation();
        fetchNavCategories();

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

    const fetchPincodeArea = async (pincode) => {
        if (!/^\d{6}$/.test(pincode)) {
            setPincodeError("Please enter a valid 6-digit pincode");
            return;
        }
        setPincodeLoading(true);
        setPincodeArea("");
        setPincodeError("");
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await res.json();
            if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                const po = data[0].PostOffice[0];
                const areaLabel = `${po.Name}, ${po.District}`;
                setPincodeArea(areaLabel);
                setSelectedCity(areaLabel);
                localStorage.setItem('userLocation', areaLabel);
                // Close after short delay so user sees the area
                setTimeout(() => setIsCityDropdownOpen(false), 900);
            } else {
                setPincodeError("Pincode not found. Please try again.");
            }
        } catch (e) {
            setPincodeError("Failed to fetch. Check your connection.");
        } finally {
            setPincodeLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
        setIsProfileDropdownOpen(false);
        router.push("/login"); // or router.push('/')
        // Optionally dispatch a custom event if other components need to know
    };

    let navLinks = [];
    if (settings?.navbarLinks?.length > 0) {
        navLinks = settings.navbarLinks;
    } else {
        const getCategoryRoute = (cat) => {
            const lowerName = cat.name.toLowerCase();
            if (lowerName.includes('apple')) return '/category/apple';
            if (lowerName.includes('dslr')) return '/category/dslr';
            if (lowerName.includes('it')) return '/category/it-products';
            if (lowerName.includes('av')) return '/category/av-products';
            if (lowerName.includes('office')) return '/category/office-equipment';
            return `/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`;
        };

        const dynamicLinks = fetchedCategories.slice(0, 5).map(cat => ({
            name: cat.name,
            href: getCategoryRoute(cat)
        }));

        if (dynamicLinks.length > 0) {
            navLinks = [
                ...dynamicLinks,
                { name: "More", href: "/categories" },
                { name: "Latest Launch", href: "/products", separator: true },
                { name: "Deals %", href: "/products" }
            ];
        } else {
            navLinks = [
                { name: "Apple Products", href: "/category/apple" },
                { name: "IT Products", href: "/category/it-products" },
                { name: "AV Products", href: "/category/av-products" },
                { name: "Office Equipment", href: "/category/office-equipment" },
                { name: "DSLR Cameras", href: "/category/dslr" },
                { name: "More", href: "/categories" },
                { name: "Latest Launch", href: "/products", separator: true },
                { name: "Deals %", href: "/products" }
            ];
        }
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = searchQuery.trim();
            if (query) {
                router.push(`/products?keyword=${encodeURIComponent(query)}`);
            }
        }
    };

    const handleSearchClick = () => {
        const query = searchQuery.trim();
        if (query) {
            router.push(`/products?keyword=${encodeURIComponent(query)}`);
        }
    };

    const announcements = settings?.navbarAnnouncements?.length > 0 ? settings.navbarAnnouncements : [
        "♥ SAVE Extra 5% up to ₹100 on UPI Orders ♥",
        "♥ Free Delivery on orders above ₹500 ♥",
        "♥ Use code FIRSTRENT for 10% off your first month ♥"
    ];
    const [announcementIndex, setAnnouncementIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnnouncementIndex(prev => (prev + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length]);

    return (
        <header className="relative z-50 w-full" style={{ backgroundColor: "hsla(0, 0%, 100%, 1)", borderBottom: "1px solid hsla(0, 0%, 93%, 1)" }}>
            <div
                className="bg-orange-300 text-black flex items-center justify-center w-full overflow-hidden relative"
                style={{ height: "24px", paddingTop: "4px", paddingBottom: "4px" }}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={announcementIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute w-full text-center"
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: "12px",
                            lineHeight: "16px",
                            letterSpacing: "-0.4px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {announcements[announcementIndex]}
                    </motion.span>
                </AnimatePresence>
            </div>

            <div className="w-full bg-white">
                <div
                    className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-8"
                    style={{
                        height: "64px",
                        gap: "10px",
                        paddingTop: "12px",
                        paddingBottom: "12px"
                    }}
                >
                    <div className="flex items-center gap-8">
                        {/* Left Section: Mobile/Tablet Menu + Logo */}
                        <div className="flex items-center gap-[6px] md:gap-4">
                            {/* Mobile/Tablet Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden text-gray-800 focus:outline-none p-1"
                            >
                                {isMobileMenuOpen ? <X size={20} color="hsla(0, 0%, 16%, 1)" /> : <List size={20} color="hsla(0, 0%, 16%, 1)" />}
                            </button>

                            {/* Logo */}
                            <Link href="/" className="shrink-0">
                                <Image
                                    src={siteLogo}
                                    alt={`${siteName} - You Name it We Rent it`}
                                    width={135}
                                    height={36}
                                    className="h-9 md:h-10 w-auto object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex items-center relative" style={{ width: "300px", height: "36px" }}>
                            <input
                                type="text"
                                placeholder="Search for MacBook Pro, Sony A7III"
                                className="w-full bg-white text-[#292929] placeholder-[#AFAFAF] outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    height: "36px",
                                    paddingTop: "6px",
                                    paddingBottom: "6px",
                                    paddingLeft: "10px",
                                    paddingRight: "34px",
                                    borderRadius: "24px",
                                    border: "0.7px solid #AFAFAF",
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    lineHeight: "16px",
                                    letterSpacing: "-0.4px",
                                }}
                                onKeyDown={handleSearch}
                            />
                            <div
                                className="absolute inset-y-0 right-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ paddingRight: "10px" }}
                                onClick={handleSearchClick}
                            >
                                <div style={{ width: "24px", height: "24px", position: "relative" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#AFAFAF" style={{ width: "19.5px", height: "19.5px", position: "absolute", top: "2.23px", left: "2.23px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Actions (Desktop/Tablet) */}
                    <div className="hidden lg:flex items-center justify-end" style={{ width: "auto", minWidth: "191px", height: "33px", gap: "8px" }}>
                        <div className="relative flex items-center shrink-0">
                            <button
                                className="flex items-center outline-none h-[33px] group"
                                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                style={{
                                    border: "1.5px solid #d1d1d1",
                                    borderRadius: "9999px",
                                    paddingLeft: "8px",
                                    paddingRight: "14px",
                                    gap: "4px",
                                    backgroundColor: "#FFFFFF",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                                }}
                            >
                                <MapPin size={18} color="#1D1D1F" weight="regular" />
                                <span className="text-[14.5px] text-[#1D1D1F] font-medium truncate" style={{ maxWidth: "150px" }}>
                                    {selectedCity || "Delhi"}
                                </span>
                            </button>

                            {/* City Drawer -> Location Sidebar */}
                            <AnimatePresence>
                                {isCityDropdownOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998]"
                                            onClick={() => setIsCityDropdownOpen(false)}
                                        />

                                        {/* Sidebar itself */}
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: 0 }}
                                            exit={{ x: "-100%" }}
                                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                            className="fixed left-0 top-0 h-screen z-[999] overflow-y-auto scrollbar-hide flex flex-col rounded-r-3xl shadow-[10px_0_30px_rgba(0,0,0,0.08)]"
                                            style={{ width: '360px', background: '#F2F2F7', padding: '12px' }}
                                        >
                                            {/* Card 1 — Pincode */}
                                            <div className="bg-white rounded-2xl p-3 mb-2">
                                                {/* Back pill — sits in its own row, never touches text */}
                                                <div className="flex justify-end mb-3">
                                                    <button
                                                        onClick={() => setIsCityDropdownOpen(false)}
                                                        className="flex items-center"
                                                        style={{
                                                            height: '24px',
                                                            minWidth: '66px',
                                                            borderRadius: '18px',
                                                            border: '1px solid hsla(3, 88%, 42%, 1)',
                                                            background: 'hsla(4, 100%, 97%, 1)',
                                                            paddingTop: '2px',
                                                            paddingBottom: '2px',
                                                            paddingLeft: '6px',
                                                            paddingRight: '10px',
                                                            gap: '2px',
                                                            color: 'hsla(3, 88%, 42%, 1)',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        <ChevronLeftIcon className="w-[10px] h-[10px]" strokeWidth={3} />
                                                        Back
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <MapPin size={22} color="#0066FF" weight="regular" />
                                                    <h2 className="text-[16px] font-bold text-gray-900 font-sans tracking-tight">
                                                        Enter Your Delivery Location
                                                    </h2>
                                                </div>

                                                <div className="relative mb-3">
                                                    <input
                                                        type="text"
                                                        value={locationInput}
                                                        onChange={(e) => {
                                                            setLocationInput(e.target.value);
                                                            setPincodeArea("");
                                                            setPincodeError("");
                                                        }}
                                                        placeholder="Enter Your Delivery Pincode"
                                                        maxLength={6}
                                                        className="w-full pl-4 pr-10 border border-[#3B82F6] rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-[13px] font-medium text-gray-800 placeholder-gray-400"
                                                        style={{ height: '42px' }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') fetchPincodeArea(locationInput.trim());
                                                        }}
                                                    />
                                                    <button
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none disabled:opacity-40"
                                                        onClick={() => fetchPincodeArea(locationInput.trim())}
                                                        disabled={pincodeLoading}
                                                    >
                                                        {pincodeLoading
                                                            ? <span className="block w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                            : <ArrowRight size={18} weight="regular" />}
                                                    </button>
                                                </div>

                                                {pincodeArea && (
                                                    <p className="text-[11px] text-center text-green-600 font-semibold mb-1">📍 {pincodeArea}</p>
                                                )}
                                                {pincodeError && (
                                                    <p className="text-[11px] text-center text-red-500 font-medium mb-1">{pincodeError}</p>
                                                )}
                                                {!pincodeArea && !pincodeError && (
                                                    <p className="text-[12px] text-center text-gray-400 font-medium">
                                                        Your currently selected pincode : <span className="text-[#646464] font-bold">{selectedCity || "110034"}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Card 2 — City Grid */}
                                            <div className="bg-white rounded-2xl p-5">
                                                <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">or Select your Delivery City</h3>

                                                <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                                                    {[
                                                        { name: "Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&q=80" },
                                                        { name: "Noida", img: "https://images.unsplash.com/photo-1680374657222-df1b21f26a6e?w=200&q=80" },
                                                        { name: "Mumbai", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=200&q=80" },
                                                        { name: "Pune", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&q=80" },
                                                        { name: "Bangalore", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200&q=80" },
                                                        { name: "Hyderabad", img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80" },
                                                        { name: "Kolkata", img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80" },
                                                        { name: "Chennai", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&q=80" },
                                                    ].map((city) => (
                                                        <div
                                                            key={city.name}
                                                            className="flex flex-col items-center gap-1.5 cursor-pointer group"
                                                            onClick={() => {
                                                                setSelectedCity(city.name);
                                                                setLocationInput(city.name);
                                                                localStorage.setItem('userLocation', city.name);
                                                                setIsCityDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className={`w-[68px] h-[68px] rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${selectedCity === city.name ? 'border-[#FFCF46] scale-105' : 'border-transparent group-hover:border-gray-200 group-hover:scale-105'}`}>
                                                                <img
                                                                    src={city.img}
                                                                    alt={city.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => { e.target.onError = null; e.target.src = `https://placehold.co/150x150/E5E7EB/6B7280?font=montserrat&text=${city.name[0]}` }}
                                                                />
                                                            </div>
                                                            <span className={`text-[10px] transition-colors text-center leading-tight ${selectedCity === city.name ? 'text-[#1D1D1F] font-bold' : 'text-gray-500 font-medium group-hover:text-black'}`}>{city.name}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-5 flex justify-center">
                                                    <button
                                                        onClick={() => setIsCityDropdownOpen(false)}
                                                        className="font-medium text-black transition-all duration-200 active:scale-95 hover:brightness-105 flex items-center justify-center whitespace-nowrap"
                                                        style={{
                                                            width: '68px',
                                                            height: '23px',
                                                            borderRadius: '9999px',
                                                            background: 'hsla(44, 100%, 64%, 1)',
                                                            fontFamily: '"Mona Sans", sans-serif',
                                                            fontWeight: 500,
                                                            fontSize: '11px',
                                                            letterSpacing: '-0.2px',
                                                            padding: '0'
                                                        }}
                                                    >
                                                        Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Login/Register or Profile (Desktop) */}
                        {userInfo ? (
                            <div className="relative flex items-center shrink-0">
                                <button
                                    className="flex items-center text-gray-700 hover:text-black transition-colors focus:outline-none h-full"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    <div className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105" style={{ width: "30px", height: "30px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "26.25px", height: "26.25px", color: "#000000" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <>
                                            {/* Backdrop to close on click outside */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full right-0 mt-2 bg-white z-50 overflow-hidden"
                                                style={{
                                                    width: "173px",
                                                    height: "202px",
                                                    padding: "16px",
                                                    borderRadius: "12px",
                                                    boxShadow: "0px 0px 6px 0px hsla(0, 0%, 60%, 0.25)",
                                                    fontFamily: "'Mona Sans', sans-serif",
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}
                                            >
                                                {/* Header */}
                                                <div className="mb-2">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span
                                                            style={{
                                                                width: "52px",
                                                                height: "16px",
                                                                fontFamily: "'Mona Sans', sans-serif",
                                                                fontWeight: 600,
                                                                fontSize: "11px",
                                                                color: "hsla(0, 0%, 46%, 1)",
                                                                lineHeight: "16px",
                                                                letterSpacing: "0.2px", // approximation of spacing/8
                                                                display: "inline-flex",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            Welcome
                                                        </span>
                                                        <span className="text-[11px] leading-[16px]">👋</span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            width: "141px",
                                                            height: "16px",
                                                            fontFamily: "'Mona Sans', sans-serif",
                                                            fontWeight: 600,
                                                            fontSize: "11px",
                                                            color: "hsla(0, 0%, 33%, 1)",
                                                            lineHeight: "16px",
                                                            letterSpacing: "0.2px",
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                        className="truncate"
                                                    >
                                                        {userInfo.name || "Aryton Senna"}
                                                    </p>
                                                </div>

                                                {/* Divider - Exact Specs: 141px width, centered, grey-200 color */}
                                                <div className="flex justify-center w-full mb-3">
                                                    <div
                                                        style={{
                                                            width: "141px",
                                                            height: "0px",
                                                            borderTop: "1px solid hsla(0, 0%, 89%, 1)"
                                                        }}
                                                    />
                                                </div>

                                                {/* Menu Items */}
                                                <div className="flex flex-col gap-[10px]">
                                                    {[
                                                        { label: "Profile Settings", href: "/profile" },
                                                        { label: "My Orders", href: "/profile/orders" },
                                                        { label: "KYC Documentation", href: "/kyc" },
                                                        { label: "My Invoices", href: "/profile/invoices" }
                                                    ].map((item) => (
                                                        <Link
                                                            key={item.label}
                                                            href={item.href}
                                                            style={{
                                                                width: "141px",
                                                                height: "20px",
                                                                fontFamily: "'Mona Sans', sans-serif",
                                                                fontWeight: 600,
                                                                fontSize: "13px",
                                                                color: "hsla(0, 0%, 20%, 1)",
                                                                lineHeight: "20px",
                                                                letterSpacing: "0.15px",
                                                                display: "flex",
                                                                alignItems: "center"
                                                            }}
                                                            className="hover:text-[#007AFF] transition-colors whitespace-nowrap"
                                                            onClick={() => setIsProfileDropdownOpen(false)}
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="inline-flex items-center justify-center font-bold text-sm bg-orange-300 text-black rounded-full hover:bg-orange-400 active:bg-orange-500 transition-all duration-200 cursor-pointer text-center"
                                style={{ height: "35px", paddingLeft: "20px", paddingRight: "20px" }}
                            >
                                Login/Register
                            </button>
                        )}

                        {/* Wishlist */}
                        <Link href="/profile/liked" className="flex items-center justify-center hover:opacity-80 transition-opacity shrink-0 ml-1" style={{ width: "30px", height: "30px" }}>
                            <Heart size={26.25} color="#000000" weight="regular" />
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative flex items-center justify-center hover:opacity-80 transition-opacity shrink-0" style={{ width: "30px", height: "30px" }}>
                            <ShoppingCartSimple size={26.25} color="#000000" weight="regular" />
                            {totalQuantity > 0 && (
                                <span
                                    className="absolute bg-red-500 text-white text-[10px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full"
                                    style={{ top: "-2px", right: "-4px" }}
                                >
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        {/* Menu Hamburger */}
                        <div className="relative flex items-center shrink-0">
                            <button
                                className="flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => setIsHamburgerDropdownOpen(!isHamburgerDropdownOpen)}
                            >
                                <List size={26.25} color="#000000" />
                            </button>

                            {/* Hamburger Dropdown */}
                            <AnimatePresence>
                                {isHamburgerDropdownOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsHamburgerDropdownOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full right-0 mt-2 bg-white z-50 overflow-hidden"
                                            style={{
                                                width: "173px",
                                                height: "212px",
                                                gap: "16px",
                                                padding: "16px",
                                                borderRadius: "12px",
                                                background: "hsla(0, 0%, 100%, 1)",
                                                boxShadow: "0px 0px 6px 0px hsla(0, 0%, 60%, 0.25)",
                                                fontFamily: "'Mona Sans', sans-serif",
                                                display: "flex",
                                                flexDirection: "column",
                                                opacity: 1
                                            }}
                                        >
                                            <Link
                                                href="/how-it-works"
                                                style={{
                                                    width: "141px",
                                                    height: "20px",
                                                    fontFamily: "'Mona Sans', sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                    color: "hsla(0, 0%, 20%, 1)",
                                                    lineHeight: "20px",
                                                    letterSpacing: "0.15px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                                className="hover:text-[#007AFF] transition-colors whitespace-nowrap"
                                                onClick={() => setIsHamburgerDropdownOpen(false)}
                                            >
                                                How It Works
                                            </Link>

                                            <div className="flex justify-center w-full">
                                                <div style={{ width: "141px", height: "0px", borderTop: "1px solid hsla(0, 0%, 89%, 1)" }} />
                                            </div>

                                            <div style={{ width: "141px", height: "48px", display: "flex", flexDirection: "column", gap: "8px", opacity: 1 }}>
                                                <Link
                                                    href="/rental-policy"
                                                    style={{
                                                        width: "141px",
                                                        height: "20px",
                                                        fontFamily: "'Mona Sans', sans-serif",
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        color: "hsla(0, 0%, 20%, 1)",
                                                        lineHeight: "20px",
                                                        letterSpacing: "0.15px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                    className="hover:text-[#007AFF] transition-colors whitespace-nowrap"
                                                    onClick={() => setIsHamburgerDropdownOpen(false)}
                                                >
                                                    Rental Policy
                                                </Link>

                                                <Link
                                                    href="/delivery-policy"
                                                    style={{
                                                        width: "141px",
                                                        height: "20px",
                                                        fontFamily: "'Mona Sans', sans-serif",
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        color: "hsla(0, 0%, 20%, 1)",
                                                        lineHeight: "20px",
                                                        letterSpacing: "0.15px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                    className="hover:text-[#007AFF] transition-colors whitespace-nowrap"
                                                    onClick={() => setIsHamburgerDropdownOpen(false)}
                                                >
                                                    Delivery Policy
                                                </Link>
                                            </div>

                                            <div className="flex justify-center w-full">
                                                <div style={{ width: "141px", height: "0px", borderTop: "1px solid hsla(0, 0%, 89%, 1)" }} />
                                            </div>

                                            <div style={{ width: "141px", height: "48px", display: "flex", flexDirection: "column", gap: "8px", opacity: 1 }}>
                                                <Link
                                                    href="/faqs"
                                                    style={{
                                                        width: "141px",
                                                        height: "20px",
                                                        fontFamily: "'Mona Sans', sans-serif",
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        color: "hsla(0, 0%, 20%, 1)",
                                                        lineHeight: "20px",
                                                        letterSpacing: "0.15px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                    className="hover:text-[#007AFF] transition-colors whitespace-nowrap"
                                                    onClick={() => setIsHamburgerDropdownOpen(false)}
                                                >
                                                    FAQs
                                                </Link>

                                                <Link
                                                    href="/contact"
                                                    style={{
                                                        width: "141px",
                                                        height: "20px",
                                                        fontFamily: "'Mona Sans', sans-serif",
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        color: "hsla(0, 0%, 20%, 1)",
                                                        lineHeight: "20px",
                                                        letterSpacing: "0.15px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                    className="hover:text-[#007AFF] transition-colors whitespace-nowrap"
                                                    onClick={() => setIsHamburgerDropdownOpen(false)}
                                                >
                                                    Get In Touch
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>


                    {/* Tablet/Mobile Controls (Right: Location + Cart) */}
                    <div className="lg:hidden flex items-center gap-2">
                        {/* Mobile Location Pill */}
                        <button
                            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                            className="flex items-center gap-1.5 focus:outline-none"
                            style={{
                                height: "35px",
                                border: "1px solid #D1D1D1",
                                borderRadius: "9999px",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                backgroundColor: "#FFFFFF"
                            }}
                        >
                            <MapPin size={18} weight="fill" color="#667085" className="shrink-0" />
                            <span className="text-[13px] font-medium truncate max-w-[70px]" style={{ color: "#174378" }}>{selectedCity || "Bangalore"}</span>
                        </button>

                        {/* Mobile Cart */}
                        <Link href="/cart" className="relative p-1">
                            <ShoppingCartSimple size={32} weight="regular" color="#000000" />
                            {totalQuantity > 0 && (
                                <span
                                    className="absolute flex items-center justify-center rounded-full font-bold"
                                    style={{
                                        top: "-2px",
                                        right: "-4px",
                                        backgroundColor: "hsla(353, 85%, 53%, 1)",
                                        color: "#FFFFFF",
                                        width: "16px",
                                        height: "16px",
                                        fontSize: "10px"
                                    }}
                                >
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block bg-white w-full border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-[28px] flex items-center">
                    <div className="flex items-center" style={{ width: "754px", height: "20px", gap: "17px" }}>
                        {navLinks.map((link, index) => (
                            <React.Fragment key={link.name}>
                                {link.separator && (
                                    <div
                                        style={{
                                            width: "1px",
                                            height: "19px",
                                            backgroundColor: "hsla(0, 0%, 60%, 1)",
                                            opacity: 1,
                                            flexShrink: 0
                                        }}
                                    />
                                )}
                                <Link
                                    href={link.href}
                                    className="font-medium text-[#464646] hover:text-black whitespace-nowrap transition-colors"
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    {link.name}
                                </Link>
                            </React.Fragment>
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
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={handleSearchClick}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
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
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
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
                                                <MapPin size={18} weight="fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                            <NavigationArrow size={12} weight="fill" />
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
