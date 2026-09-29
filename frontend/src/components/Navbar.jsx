"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, ShoppingCartSimple, List, MagnifyingGlass, X, CaretDown, NavigationArrow } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import LocationSelector from "./LocationSelector";
import { checkServiceability } from "../services/serviceabilityService";
import { useSelector } from "react-redux";
import { selectCartTotalQuantity } from "../redux/features/cartSlice";
import { useSettings } from "../context/SettingsContext";
import { getCategories } from "../services/categoryService";
import { logout } from "../services/authService";
import { categoryHref } from "../lib/categoryRoutes";

const Navbar = ({ showCategories: propShowCategories } = {}) => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    const mobileMenuCloseRef = useRef(null);
    const mobileMenuTriggerRef = useRef(null);
    const desktopMenuTriggerRef = useRef(null);
    const desktopMenuRef = useRef(null);
    const [selectedCity, setSelectedCity] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeArea, setPincodeArea] = useState("");
    const [pincodeError, setPincodeError] = useState("");
    const [fetchedCategories, setFetchedCategories] = useState([]);
    const [isMobileScreen, setIsMobileScreen] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

    // Redux Cart Selector
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const { settings } = useSettings();
    const siteLogo = settings?.siteLogo || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
    const siteName = settings?.siteName || "Indian Renters";

    const showCategories = propShowCategories !== undefined
        ? propShowCategories
        : (settings?.showNavbarCategories !== false);

    // Removed fixed cities array
    useEffect(() => {
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

        const handleResize = () => {
            setIsMobileScreen(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setIsDesktopMenuOpen(false);
            else setIsMobileMenuOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        window.addEventListener("userInfoChanged", checkUserInfo);
        // Listen for storage events (in case login happens in another tab/window)
        window.addEventListener("storage", checkUserInfo);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("userInfoChanged", checkUserInfo);
            window.removeEventListener("storage", checkUserInfo);
        };
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            const trigger = mobileMenuTriggerRef.current;
            document.body.style.overflow = "hidden";
            mobileMenuCloseRef.current?.focus();
            const handleEscape = (event) => {
                if (event.key === "Escape") setIsMobileMenuOpen(false);
            };
            window.addEventListener("keydown", handleEscape);
            return () => {
                window.removeEventListener("keydown", handleEscape);
                document.body.style.overflow = "";
                trigger?.focus();
            };
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen, isMobileScreen]);

    useEffect(() => {
        if (!isDesktopMenuOpen) return;
        const closeOnOutsideClick = (event) => {
            if (!desktopMenuRef.current?.contains(event.target)) setIsDesktopMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setIsDesktopMenuOpen(false);
                desktopMenuTriggerRef.current?.focus();
            }
        };
        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isDesktopMenuOpen]);

    const fetchLocation = ({ interactive = false } = {}) => {
        if (!navigator.geolocation) {
            if (interactive) setPincodeError("This browser can't find your location. Enter a city or pincode instead.");
            return;
        }

        setPincodeError("");
        setLocationInput("Fetching...");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    if (!response.ok) throw new Error("Reverse geocoding failed");
                    const data = await response.json();

                    const city = data.city || data.locality || data.principalSubdivision;
                    if (city) {
                        setSelectedCity(city);
                        setLocationInput(city);
                        localStorage.setItem('userLocation', city);
                        setIsCityDropdownOpen(false);
                        if (interactive) setIsMobileMenuOpen(false);
                    } else {
                        setLocationInput("");
                        if (interactive) setPincodeError("We couldn't find your city. Enter a city or pincode instead.");
                    }
                } catch {
                    setLocationInput("");
                    if (interactive) setPincodeError("We couldn't find your city. Enter a city or pincode instead.");
                }
            },
            (error) => {
                setLocationInput("");
                if (interactive) {
                    setPincodeError(error.code === 1
                        ? "Location access is off. Enter a city or pincode instead."
                        : "We couldn't find your location. Enter a city or pincode instead.");
                }
            }
        );
    };

    useEffect(() => {
        const checkAutoLocation = async () => {
            if (!localStorage.getItem("userLocation") && navigator.geolocation) {
                try {
                    const result = await navigator.permissions.query({ name: 'geolocation' });
                    if (result.state === 'granted') {
                        fetchLocation();
                    }
                } catch { /* Permission checks are optional; manual city selection remains available. */ }
            }
        };
        checkAutoLocation();
    }, []);

    const fetchPincodeArea = async (pincode) => {
        if (!/^[1-9]\d{5}$/.test(pincode)) {
            setPincodeError("Please enter a valid 6-digit pincode");
            return;
        }
        setPincodeLoading(true);
        setPincodeArea("");
        setPincodeError("");
        try {
            const data = await checkServiceability(pincode);
            if (typeof data?.serviceable !== "boolean") throw new Error("Invalid serviceability response");
            if (!data.serviceable) {
                setPincodeError(data.message || "Delivery is not available for this pincode yet.");
                return;
            }
            const label = [pincode, data.district].filter(Boolean).join(" · ");
            setPincodeArea(label);
            setSelectedCity(label);
            setLocationInput(label);
            localStorage.setItem("userLocation", label);
            setIsMobileMenuOpen(false);
        } catch {
            setPincodeError("We couldn’t check delivery right now. Please try again.");
        } finally {
            setPincodeLoading(false);
        }
    };

    const handleLogout = () => {
        setUserInfo(null);
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
        logout();
    };

    let navLinks = [];
    if (showCategories) {
        if (settings?.navbarLinks && Array.isArray(settings.navbarLinks)) {
            navLinks = settings.navbarLinks;
        } else {
            const dynamicLinks = fetchedCategories.slice(0, 5).map(cat => ({
                name: cat.name,
                href: categoryHref(cat)
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
    }

    const defaultDrawerCategories = [
        { name: "Apple Products", href: "/category/apple" },
        { name: "IT Products", href: "/category/it-products" },
        { name: "AV Products", href: "/category/av-products" },
        { name: "Office Equipment", href: "/category/office-equipment" },
        { name: "DSLR Cameras & Lenses", href: "/category/dslr" },
    ];
    const configuredCategoryLinks = navLinks.filter(link => link.href?.startsWith("/category/"));
    const drawerCategoryLinks = [
        ...defaultDrawerCategories.map(defaultLink => {
            const configured = configuredCategoryLinks.find(link => link.href === defaultLink.href);
            return configured && !["Apple", "Cameras"].includes(configured.name)
                ? configured
                : defaultLink;
        }),
        ...configuredCategoryLinks.filter(link => !defaultDrawerCategories.some(defaultLink => defaultLink.href === link.href)),
    ].slice(0, 5);
    const topNavLinks = [
        ...drawerCategoryLinks.map(link => ({ ...link, name: link.href === "/category/dslr" ? "DSLR Cameras" : link.name })),
        navLinks.find(link => link.name === "More") || { name: "More", href: "/categories" },
        { ...(navLinks.find(link => link.name === "Latest Launch") || { name: "Latest Launch", href: "/products" }), separator: true },
        navLinks.find(link => link.name === "Deals %") || { name: "Deals %", href: "/products" },
    ];

    const saveDrawerLocation = async () => {
        const value = locationInput.trim();
        if (/^\d{6}$/.test(value)) {
            await fetchPincodeArea(value);
        } else if (value) {
            setPincodeError("");
            setSelectedCity(value);
            localStorage.setItem("userLocation", value);
            setIsMobileMenuOpen(false);
        } else {
            setPincodeError("Enter a city or 6-digit pincode");
        }
    };

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
                                ref={mobileMenuTriggerRef}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Open navigation menu"
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="site-navigation-drawer"
                                className="lg:hidden text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] p-1"
                            >
                                {isMobileMenuOpen ? <X size={20} color="hsla(0, 0%, 16%, 1)" /> : <List size={20} color="hsla(0, 0%, 16%, 1)" />}
                            </button>

                            {/* Logo */}
                            <Link href="/" className="shrink-0">
                                <Image
                                    src={siteLogo}
                                    unoptimized
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
                                onClick={() => {
                                    if (typeof window !== 'undefined') setIsMobileScreen(window.innerWidth < 1024);
                                    setIsCityDropdownOpen(!isCityDropdownOpen);
                                }}
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
                                                    // Figma height is 202px, but that was sized for 4 menu rows.
                                                    // Keep it as a floor so the Logout row isn't clipped.
                                                    minHeight: "202px",
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
                                                        { label: "Profile Settings", href: "/profile/settings" },
                                                        { label: "My Orders", href: "/profile/orders" },
                                                        { label: "KYC Documentation", href: "/profile/kyc" },
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

                                                    <button
                                                        onClick={handleLogout}
                                                        style={{
                                                            width: "141px",
                                                            height: "20px",
                                                            fontFamily: "'Mona Sans', sans-serif",
                                                            fontWeight: 600,
                                                            fontSize: "13px",
                                                            color: "hsla(3, 84%, 51%, 1)",
                                                            lineHeight: "20px",
                                                            letterSpacing: "0.15px",
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                        className="hover:opacity-80 transition-opacity whitespace-nowrap text-left"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="inline-flex items-center justify-center cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95 shrink-0"
                                style={{
                                    background: '#ffcf46',
                                    borderRadius: '9999px',
                                    height: '35px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    lineHeight: '23px',
                                    letterSpacing: '-0.4px',
                                    color: '#1f1f1f',
                                    whiteSpace: 'nowrap',
                                    border: 'none',
                                }}
                            >
                                Login/Register
                            </button>
                        )}

                        {/* Wishlist — only visible when signed up / logged in */}
                        {userInfo && (
                            <Link href="/profile/liked" className="flex items-center justify-center hover:opacity-80 transition-opacity shrink-0 ml-1" style={{ width: "30px", height: "30px" }} title="Wishlist">
                                <Heart size={26.25} color="#000000" weight="regular" />
                            </Link>
                        )}

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
                        <div ref={desktopMenuRef} className="relative flex items-center shrink-0">
                            <button
                                ref={desktopMenuTriggerRef}
                                type="button"
                                aria-label="Open navigation menu"
                                aria-expanded={isDesktopMenuOpen}
                                aria-controls="desktop-navigation-menu"
                                className="flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => setIsDesktopMenuOpen(open => !open)}
                            >
                                <List size={26.25} color="#000000" />
                            </button>
                            {isDesktopMenuOpen && (
                                <nav id="desktop-navigation-menu" aria-label="More pages" className="absolute right-0 top-full z-[100] mt-3 w-[173px] rounded-xl bg-white p-4 shadow-[0_0_8px_rgba(0,0,0,0.16)]">
                                    <div className="flex flex-col gap-4">
                                        <Link href="/rental-process" onClick={() => setIsDesktopMenuOpen(false)} className="text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-black focus-visible:outline-2 focus-visible:outline-[#141414]">How It Works</Link>
                                        <div className="h-px bg-[#E2E2E2]" />
                                        <Link href="/rules" onClick={() => setIsDesktopMenuOpen(false)} className="text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-black focus-visible:outline-2 focus-visible:outline-[#141414]">Rental Policy</Link>
                                        <Link href="/delivery-charges" onClick={() => setIsDesktopMenuOpen(false)} className="text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-black focus-visible:outline-2 focus-visible:outline-[#141414]">Delivery Policy</Link>
                                        <div className="h-px bg-[#E2E2E2]" />
                                        <Link href="/faq" onClick={() => setIsDesktopMenuOpen(false)} className="text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-black focus-visible:outline-2 focus-visible:outline-[#141414]">FAQs</Link>
                                        <Link href="/contact" onClick={() => setIsDesktopMenuOpen(false)} className="text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-black focus-visible:outline-2 focus-visible:outline-[#141414]">Get In Touch</Link>
                                    </div>
                                </nav>
                            )}
                        </div>
                    </div>


                    {/* Tablet/Mobile Controls (Right: Location + Cart) */}
                    <div className="lg:hidden flex items-center gap-2">
                        {/* Mobile Location Pill */}
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') setIsMobileScreen(window.innerWidth < 1024);
                                setIsCityDropdownOpen(!isCityDropdownOpen);
                            }}
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
                            <MapPin size={20} weight="regular" color="#1D1D1F" className="shrink-0" aria-hidden="true" />
                            <span className="text-[13px] font-medium truncate max-w-[70px]" style={{ color: "#174378" }}>{selectedCity || "Bangalore"}</span>
                        </button>

                        {/* Mobile Cart */}
                        <Link href="/cart" className="relative p-1">
                            <ShoppingCartSimple size={26.25} weight="regular" color="#000000" />
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

            {/* Category Navigation Bar (show/remove category section) */}
            {showCategories && topNavLinks.length > 0 && (
                <div className="hidden lg:block bg-white w-full border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-[28px] flex items-center">
                        <div className="flex items-center" style={{ width: "754px", height: "20px", gap: "17px" }}>
                            {topNavLinks.map((link) => (
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
            )}


            {/* Figma navigation drawer for tablet and mobile. */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close navigation menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[998] bg-black/35"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside
                            id="site-navigation-drawer"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Navigation menu"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 29, stiffness: 260 }}
                            className="fixed inset-y-0 left-0 z-[999] flex w-full max-w-[390px] flex-col overflow-y-auto bg-white shadow-[0_0_14px_rgba(0,0,0,0.15)]"
                        >
                            <div className="flex h-[63px] shrink-0 items-center justify-between border-b border-[#F3F4F6] px-4">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex h-8 w-[121px] items-center">
                                    <Image src={siteLogo} unoptimized alt={siteName} width={121} height={32} className="max-h-8 w-auto max-w-[121px] object-contain" />
                                </Link>
                                <button
                                    ref={mobileMenuCloseRef}
                                    type="button"
                                    aria-label="Close menu"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#141414] hover:bg-[#F6F6F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 px-5 pb-5 pt-4">
                                <div className="relative">
                                    <input
                                        type="search"
                                        aria-label="Search products"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                handleSearch(event);
                                                if (searchQuery.trim()) setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className="h-[38px] w-full rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-12 text-[14px] text-[#333] outline-none placeholder:text-[#89919E] focus-visible:border-[#141414]"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Submit product search"
                                        onClick={() => {
                                            handleSearchClick();
                                            if (searchQuery.trim()) setIsMobileMenuOpen(false);
                                        }}
                                        className="absolute inset-y-0 right-3 flex w-7 items-center justify-center text-[#89919E] focus-visible:outline-2 focus-visible:outline-[#141414]"
                                    >
                                        <MagnifyingGlass size={18} />
                                    </button>
                                </div>

                                {showCategories && (
                                    <nav aria-label="Product categories">
                                        <h2 className="border-b border-[#D1D1D1] pb-2 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">MENU</h2>
                                        <div className="mt-2">
                                            {drawerCategoryLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex min-h-[46px] items-center justify-between border-b border-[#E2E2E2] text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-[#141414]"
                                                >
                                                    <span>{link.name}</span>
                                                    <CaretDown size={16} className="-rotate-90" aria-hidden="true" />
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                )}

                                <nav aria-label="Account and help">
                                    <h2 className="border-b border-[#D1D1D1] pb-2 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">ACCOUNT</h2>
                                    <div className="mt-2 flex flex-col gap-[11px] text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333]">
                                        {[
                                            { name: "How It Works", href: "/rental-process" },
                                            { name: "Rental Policy", href: "/rules" },
                                            { name: "Delivery Policy", href: "/delivery-charges" },
                                            { name: "FAQs", href: "/faq" },
                                        ].map((link) => (
                                            <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-[#141414]">{link.name}</Link>
                                        ))}
                                    </div>
                                </nav>

                                <nav aria-label="Contact">
                                    <h2 className="border-b border-[#D1D1D1] pb-2 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">CONTACT</h2>
                                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 block text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#333] hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-[#141414]">Get In Touch</Link>
                                </nav>
                            </div>

                            <div className="mt-auto space-y-4 px-5 pb-5">
                                {userInfo ? (
                                    <div className="space-y-3">
                                        <div className="flex min-h-[60px] items-center gap-3 rounded-xl border border-[#FFCF46] bg-[#FFFAEB] p-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FFCF46] bg-[#FFF1C5] text-[14px] font-bold text-[#BB4D00]">{userInfo.name?.charAt(0).toUpperCase() || "U"}</span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-[14px] font-bold leading-5 text-[#101828]">{userInfo.name || "User"}</span>
                                                <span className="block truncate text-[12px] leading-4 text-[#344054]">{userInfo.email}</span>
                                            </span>
                                        </div>
                                        <Link href="/profile/overview" onClick={() => setIsMobileMenuOpen(false)} className="flex h-[35px] items-center justify-center rounded-full bg-[#F3F4F6] text-[14px] font-medium text-[#333] hover:bg-[#E2E2E2]">My Profile</Link>
                                        <button type="button" onClick={handleLogout} className="flex h-[35px] w-full items-center justify-center rounded-full bg-[#FFF2F1] text-[14px] font-medium text-[#ED2115] hover:bg-[#FFE4E1]">Logout</button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="flex h-[35px] w-full items-center justify-center rounded-full bg-[#FFCF46] text-[16px] font-medium tracking-[-0.4px] text-[#1F1F1F] hover:bg-[#FFC62B]">Login/SignUp</button>
                                )}

                                <div className="rounded-xl bg-[#F6F7F9] p-[15px]">
                                    <label htmlFor="drawer-location" className="block text-[12px] font-bold leading-4 tracking-[0.2px] text-[#344054]">DELIVERY LOCATION</label>
                                    <div className="mt-2 flex items-center gap-1">
                                        <div className="relative min-w-0 flex-1">
                                            <MapPin size={16} weight="fill" className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[#89919E]" aria-hidden="true" />
                                            <input id="drawer-location" type="text" value={locationInput} onChange={(event) => setLocationInput(event.target.value)} placeholder="Pincode or city" className="h-[30px] w-full rounded-full border border-[#E2E2E2] bg-white pl-[33px] pr-2 text-[12px] text-[#333] outline-none placeholder:text-[#89919E] focus-visible:border-[#141414]" />
                                        </div>
                                        <button type="button" disabled={pincodeLoading} onClick={saveDrawerLocation} className="h-[28px] shrink-0 rounded-full bg-[#141414] px-[14px] text-[12px] font-medium text-white hover:bg-[#333] disabled:opacity-50">{pincodeLoading ? "Saving..." : "Save"}</button>
                                    </div>
                                    {pincodeError && <p role="alert" className="mt-1 text-[11px] text-[#B42318]">{pincodeError}</p>}
                                    {pincodeArea && <p className="mt-1 text-[11px] text-[#067647]">{pincodeArea}</p>}
                                    <button type="button" onClick={() => fetchLocation({ interactive: true })} className="mt-2 flex h-[30px] w-full items-center justify-center gap-1 rounded-full border border-[#E2E2E2] bg-white text-[12px] font-medium text-[#333] hover:bg-[#FAFAFA]">
                                        <NavigationArrow size={12} weight="fill" className="text-[#BB4D00]" aria-hidden="true" />
                                        Use current location
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {isCityDropdownOpen && (
                <LocationSelector
                    currentLocation={selectedCity}
                    onClose={() => setIsCityDropdownOpen(false)}
                    onSave={(location) => {
                        setSelectedCity(location);
                        setLocationInput(location);
                        localStorage.setItem("userLocation", location);
                        setIsCityDropdownOpen(false);
                    }}
                />
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView="login"
            />
        </header>
    );
};

export default Navbar;
