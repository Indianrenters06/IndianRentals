"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaGoogle, FaApple, FaArrowRight, FaPhone, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../services/apiConfig";

const LoginPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [otpType, setOtpType] = useState("email");

    // Use a flag to avoid SSR issues if necessary, though it should be fine.
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
        setStep(1);
        setIdentifier("");
        setOtp("");
        setError(null);
    }, []);

    if (!isClient && typeof window === 'undefined') {
        return null; // Return null on server to avoid hydration mismatch and potential hook issues
    }

    const handleSendOtp = async (e) => {
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

            setOtpType(data.type); // 'email' or 'phone'
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
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

            // Store token
            localStorage.setItem("userInfo", JSON.stringify(data));
            window.dispatchEvent(new Event("userInfoChanged"));

            // Redirect
            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#00A8FF]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FFC107]/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative z-10"
            >
                <div className="px-8 py-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500 text-sm">
                            {step === 1 ? "Sign in with Email or Phone" : `Enter the OTP sent to your ${otpType}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="identifier">
                                        Email Address or Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FaEnvelope size={16} />
                                        </div>
                                        <input
                                            id="identifier"
                                            name="identifier"
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
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Get OTP <FaArrowRight className="ml-2" size={14} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="otp">
                                        Enter OTP
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FaLock size={16} />
                                        </div>
                                        <input
                                            id="otp"
                                            name="otp"
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
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Verify & Login <FaArrowRight className="ml-2" size={14} />
                                        </>
                                    )}
                                </button>

                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                    >
                                        <FaArrowLeft className="mr-1" size={12} /> Change {otpType}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="text-sm font-medium text-[#00A8FF] hover:text-[#008acd]"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-400 text-xs uppercase tracking-wider">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                                <FaGoogle className="text-red-500 mr-2" /> Google
                            </button>
                            <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                                <FaApple className="text-black mr-2" /> Apple
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-semibold text-[#00A8FF] hover:text-[#008acd]">
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
