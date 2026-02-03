"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaGoogle, FaApple, FaArrowRight, FaPhone, FaArrowLeft, FaTimes, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../services/apiConfig";


const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
    const router = useRouter();
    const [view, setView] = useState(initialView); // 'login' or 'register'

    // Login States
    const [loginStep, setLoginStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [otpType, setOtpType] = useState("email");

    // Register States
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    // Shared States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Reset states when modal opens or view changes
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setLoading(false);
            // Reset fields
            setLoginStep(1);
            setIdentifier("");
            setOtp("");
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
        }
    }, [initialView, isOpen]);


    const handleLoginSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send OTP");
            }

            setOtpType(data.type);
            setLoginStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("userInfo", JSON.stringify(data));
            window.dispatchEvent(new Event("userInfoChanged"));
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    phone: registerData.phone,
                    password: registerData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // After registration, switch to login or auto-login
            // For now, switch to login view
            setView("login");
            setLoginStep(1);
            setError("Registration successful! Please login."); // Show success message as error/info? Or handling success state separately
            // Actually, let's just pre-fill the identifier if possible, or just let them login.
            setIdentifier(registerData.email || registerData.phone);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative max-h-[90vh] overflow-y-auto scrollbar-hide"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-gray-50 rounded-full"
                            >
                                <FaTimes />
                            </button>

                            <div className="px-8 py-10">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {view === "login"
                                            ? (loginStep === 1 ? "Welcome Back" : "Verify Login")
                                            : "Create Account"}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {view === "login"
                                            ? (loginStep === 1 ? "Sign in with Email or Phone" : `Enter OTP sent to your ${otpType}`)
                                            : "Join IndianRentals today"}
                                    </p>
                                </div>

                                {error && (
                                    <div className={`mb-6 p-4 rounded-md ${error.includes("successful") ? "bg-green-50 border-l-4 border-green-500 text-green-700" : "bg-red-50 border-l-4 border-red-500 text-red-700"}`}>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                {view === "login" ? (
                                    <AnimatePresence mode="wait">
                                        {loginStep === 1 ? (
                                            <motion.form
                                                key="step1"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                onSubmit={handleLoginSendOtp}
                                                className="space-y-5"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address or Phone Number
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <FaEnvelope size={16} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={identifier}
                                                            onChange={(e) => setIdentifier(e.target.value)}
                                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                                                            placeholder="user@example.com or +919876543210"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#00A8FF] hover:bg-[#0096e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8FF] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? "Sending..." : (
                                                        <>Get OTP <FaArrowRight className="ml-2" size={14} /></>
                                                    )}
                                                </button>
                                            </motion.form>
                                        ) : (
                                            <motion.form
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                onSubmit={handleLoginVerifyOtp}
                                                className="space-y-5"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Enter OTP
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <FaLock size={16} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            maxLength={6}
                                                            required
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value)}
                                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all bg-gray-50 focus:bg-white tracking-widest text-center text-lg"
                                                            placeholder="123456"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#00A8FF] hover:bg-[#0096e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8FF] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? "Verifying..." : (
                                                        <>Verify & Login <FaArrowRight className="ml-2" size={14} /></>
                                                    )}
                                                </button>

                                                <div className="flex justify-between items-center mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setLoginStep(1)}
                                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                                    >
                                                        <FaArrowLeft className="mr-1" size={12} /> Change {otpType}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleLoginSendOtp}
                                                        className="text-sm font-medium text-[#00A8FF] hover:text-[#008acd]"
                                                    >
                                                        Resend OTP
                                                    </button>
                                                </div>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>
                                ) : (
                                    <motion.form
                                        key="register"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleRegisterSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaUser size={14} />
                                                </div>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={registerData.name}
                                                    onChange={handleRegisterChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                                                    placeholder="Full Name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaEnvelope size={14} />
                                                </div>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={registerData.email}
                                                    onChange={handleRegisterChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                                                    placeholder="Gmail"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaPhone size={14} />
                                                </div>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    value={registerData.phone}
                                                    onChange={handleRegisterChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                                                    placeholder="+91 "
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <FaLock size={14} />
                                                    </div>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        required
                                                        value={registerData.password}
                                                        onChange={handleRegisterChange}
                                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <FaLock size={14} />
                                                    </div>
                                                    <input
                                                        name="confirmPassword"
                                                        type="password"
                                                        required
                                                        value={registerData.confirmPassword}
                                                        onChange={handleRegisterChange}
                                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A8FF] focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#00A8FF] hover:bg-[#0096e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8FF] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                                        >
                                            {loading ? "Creating Account..." : (
                                                <>Create Account <FaArrowRight className="ml-2" size={14} /></>
                                            )}
                                        </button>
                                    </motion.form>
                                )}

                                {/* Switcher */}
                                <div className="mt-8 text-center text-sm text-gray-600">
                                    {view === "login" ? (
                                        <>
                                            Don't have an account?{' '}
                                            <button
                                                onClick={() => setView("register")}
                                                className="font-semibold text-[#00A8FF] hover:text-[#008acd]"
                                            >
                                                Create account
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{' '}
                                            <button
                                                onClick={() => setView("login")}
                                                className="font-semibold text-[#00A8FF] hover:text-[#008acd]"
                                            >
                                                Sign in
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
