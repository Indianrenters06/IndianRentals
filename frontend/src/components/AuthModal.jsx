"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Eye, EyeSlash, Phone, EnvelopeSimple, Lock } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../services/apiConfig";
import { useGoogleLogin } from "@react-oauth/google";

/* ─── close icon ─── */
const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 4L4 12M4 4l8 8" stroke="#545454" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

/* ─── spinner ─── */
const Spinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

/* ─── phone helpers ─── */
function validatePhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}
function normalizePhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

/* ════════════════════════════════════════════════════════════════════ */
const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
    const router = useRouter();
    const [view, setView] = useState(initialView);

    // Login states
    const [loginStep, setLoginStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const [otp, setOtp] = useState("");

    // Register states
    const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Shared
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Resend OTP countdown
    const [resendTimer, setResendTimer] = useState(25);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setLoading(false);
            setLoginStep(1);
            setPhone("");
            setPhoneError(false);
            setTermsChecked(false);
            setOtp("");
            setResendTimer(25);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) setView(initialView);
    }, [initialView, isOpen]);

    // Countdown when on step 2
    useEffect(() => {
        if (loginStep !== 2) return;
        setResendTimer(25);
        const interval = setInterval(() => {
            setResendTimer((t) => {
                if (t <= 1) { clearInterval(interval); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [loginStep]);

    /* ── send OTP ── */
    const handleLoginSendOtp = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        let valid = true;
        if (!validatePhone(phone)) { setPhoneError(true); valid = false; }
        if (!termsChecked) valid = false;
        if (!valid) return;
        setLoading(true);
        setError(null);
        try {
            const identifier = `+91${normalizePhone(phone)}`;
            const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send OTP");
            setLoginStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── verify OTP ── */
    const handleLoginVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const identifier = `+91${normalizePhone(phone)}`;
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            localStorage.setItem("userInfo", JSON.stringify(data));
            window.dispatchEvent(new Event("userInfoChanged"));
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── register ── */
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: registerData.name, email: registerData.email, phone: registerData.phone, password: registerData.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            setView("login");
            setLoginStep(1);
            setError("Registration successful! Please login.");
            setPhone(registerData.phone || "");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── Google SSO ── */
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token: tokenResponse.access_token }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Google Login failed");
                localStorage.setItem("userInfo", JSON.stringify(data));
                window.dispatchEvent(new Event("userInfoChanged"));
                onClose();
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        },
        onError: (err) => {
            console.error("Google OAuth error:", err);
            setError(err?.error_description || "Google login failed or was cancelled");
            setLoading(false);
        },
    });

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

                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="pointer-events-auto w-full"
                            style={{ maxWidth: "650px" }}
                        >
                            {view === "login" ? (
                                /* ══ LOGIN — Figma two-panel card ══ */
                                <div
                                    className="relative flex justify-end items-start w-full p-2 bg-white border border-[#eee] rounded-xl"
                                    style={{ gap: "20px" }}
                                >
                                    {/* Left photo panel */}
                                    <div
                                        className="relative self-stretch flex-shrink-0 rounded overflow-hidden hidden sm:block"
                                        style={{ width: "300px", minHeight: "283px" }}
                                        aria-hidden="true"
                                    >
                                        <Image src="/ipad-new.jpg" alt="" fill className="object-cover pointer-events-none" priority />
                                    </div>

                                    {/* Right form column */}
                                    <div
                                        className="relative flex-shrink-0 flex flex-col items-end w-full sm:w-[314px]"
                                        style={{ padding: "48px 20px 20px 0" }}
                                    >
                                        {/* Close */}
                                        <button
                                            type="button"
                                            aria-label="Close"
                                            onClick={onClose}
                                            className="absolute top-0 right-0 w-[34px] h-[34px] bg-white border border-[#f6f6f6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#fafafa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0859c5]"
                                            style={{ boxShadow: "0px 6px 4px rgba(161,161,161,0.05),0px 3px 3px rgba(161,161,161,0.09),0px 1px 1px rgba(161,161,161,0.1)" }}
                                        >
                                            <CloseIcon />
                                        </button>

                                        <div className="flex flex-col items-start gap-[30px] w-full">
                                            {error && (
                                                <div className={`w-full p-3 rounded-md border-l-4 ${error.includes("successful") ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
                                                    <p className={`text-xs ${error.includes("successful") ? "text-green-700" : "text-red-700"}`}>{error}</p>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-start gap-[10px] w-full">
                                                {/* Title */}
                                                <AnimatePresence mode="wait">
                                                    {loginStep === 1 ? (
                                                        <motion.p key="t1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ margin: 0, wordBreak: "break-word" }} className="w-full font-semibold text-[18px] leading-[25px] tracking-[-0.8px] text-[#333]">
                                                            Enter your number to Signup or Login
                                                        </motion.p>
                                                    ) : (
                                                        <motion.p key="t2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ margin: 0, fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 600, fontSize: "18px", lineHeight: "25px", letterSpacing: "-0.8px", color: "#333333" }} className="w-full">
                                                            OTP sent to this number
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>

                                                <div className="flex flex-col items-start gap-[15px] w-full">
                                                    <AnimatePresence mode="wait">

                                                        {/* Step 1 */}
                                                        {loginStep === 1 && (
                                                            <motion.div key="s1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="flex flex-col items-start gap-[15px] w-full">
                                                                {/* Phone field */}
                                                                <div className="flex flex-col items-start gap-1 w-full">
                                                                    <div className="flex items-start gap-[1px]">
                                                                        <p className="m-0 font-semibold text-[12px] leading-4 tracking-[-0.4px] text-[#545454]">Mobile Number</p>
                                                                        <p className="m-0 font-medium text-[12px] leading-4 tracking-[-0.4px] text-[#ed2115]">*</p>
                                                                    </div>
                                                                    <div className="flex flex-col items-start gap-[2px] w-full">
                                                                        <label htmlFor="modal-phone" className="sr-only">Mobile number</label>
                                                                        <div className={["relative w-full h-[39px] bg-white rounded-lg overflow-hidden transition-all", phoneError ? "border border-[#c8170d]" : "border border-[#e2e2e2] focus-within:border-[#0859c5] focus-within:shadow-[0_0_0_3px_rgba(8,89,197,0.12)]"].join(" ")}>
                                                                            <input
                                                                                id="modal-phone"
                                                                                type="tel"
                                                                                inputMode="tel"
                                                                                autoComplete="tel"
                                                                                placeholder="+91-XXXXX XXXXX"
                                                                                required
                                                                                value={phone}
                                                                                onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(false); }}
                                                                                className="absolute inset-0 w-full h-full border-none outline-none bg-transparent font-medium text-[12px] leading-4 tracking-[-0.4px] text-[#333] placeholder:text-[#9a9a9a]"
                                                                                style={{ padding: "0 8px 0 7px" }}
                                                                            />
                                                                        </div>
                                                                        {phoneError && (
                                                                            <p style={{ margin: 0, width: "294px", height: "32px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 400, fontSize: "10px", lineHeight: "16px", letterSpacing: "-0.4px", color: "#C8170D", flexShrink: 0, alignSelf: "stretch", flexGrow: 0 }}>
                                                                                Oops! Looks like you missed some digits. Please enter complete 10 digit number.
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Frame 276 — exact Figma spec */}
                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0, gap: "5px", height: "16px", flexShrink: 0 }}>
                                                                    {/* checkbox */}
                                                                    <div style={{ position: "relative", boxSizing: "border-box", width: "14px", height: "14px", background: termsChecked ? "#0859C5" : "#FFFFFF", border: `1px solid ${termsChecked ? "#0859C5" : "#AFAFAF"}`, borderRadius: "4px", flexShrink: 0, cursor: "pointer" }}
                                                                        onClick={() => setTermsChecked(!termsChecked)}>
                                                                        <input type="checkbox" id="modal-terms" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)}
                                                                            style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", margin: 0, cursor: "pointer" }} />
                                                                        {termsChecked && (
                                                                            <svg viewBox="0 0 14 14" fill="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden="true">
                                                                                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    {/* I agree to the */}
                                                                    <label htmlFor="modal-terms" style={{ width: "69px", height: "16px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 500, fontSize: "12px", lineHeight: "16px", textAlign: "center", letterSpacing: "-0.4px", color: "#000000", flexShrink: 0, cursor: "pointer", userSelect: "none" }}>
                                                                        I agree to the
                                                                    </label>
                                                                    {/* terms & conditions */}
                                                                    <button type="button" onClick={() => { onClose(); router.push("/terms"); }} style={{ width: "105px", height: "16px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 700, fontSize: "12px", lineHeight: "16px", textAlign: "center", letterSpacing: "-0.4px", textDecorationLine: "underline", color: "#0859C5", background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}>
                                                                        terms &amp; conditions
                                                                    </button>
                                                                    {/* & */}
                                                                    <span style={{ width: "10px", height: "16px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 500, fontSize: "12px", lineHeight: "16px", textAlign: "center", letterSpacing: "-0.4px", color: "#000000", flexShrink: 0 }}>
                                                                        &amp;
                                                                    </span>
                                                                    {/* privacy policies */}
                                                                    <button type="button" onClick={() => { onClose(); router.push("/privacy"); }} style={{ width: "86px", height: "16px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 700, fontSize: "12px", lineHeight: "16px", textAlign: "center", letterSpacing: "-0.4px", textDecorationLine: "underline", color: "#0859C5", background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}>
                                                                        privacy policies
                                                                    </button>
                                                                </div>

                                                                {/* Continue */}
                                                                <button type="button" disabled={loading} onClick={handleLoginSendOtp} className="flex items-center justify-center h-[35px] px-5 bg-[#ffcf46] border-none rounded-full cursor-pointer hover:bg-[#ffc629] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1f1f1f] focus-visible:outline-offset-2 disabled:bg-[#f1e6c6] disabled:cursor-not-allowed">
                                                                    {loading ? <Spinner /> : <span className="font-medium text-[16px] leading-[23px] tracking-[-0.4px] text-[#1f1f1f] whitespace-nowrap">Continue</span>}
                                                                </button>
                                                            </motion.div>
                                                        )}

                                                        {/* Step 2 — OTP screen (exact Figma spec) */}
                                                        {loginStep === 2 && (
                                                            <motion.form key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} onSubmit={handleLoginVerifyOtp}
                                                                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 0, gap: "15px", width: "294px" }}>

                                                                {/* Frame 230 — Input Fields */}
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 0, gap: "5px", width: "294px" }}>
                                                                    {/* Frame 300 — Label row */}
                                                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", padding: 0, gap: "1px", width: "294px", height: "16px" }}>
                                                                        {/* Label */}
                                                                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 600, fontSize: "12px", lineHeight: "16px", letterSpacing: "-0.4px", color: "#545454" }}>Provide your OTP</span>
                                                                        {/* * */}
                                                                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "16px", letterSpacing: "-0.4px", color: "#ED2115" }}>*</span>
                                                                    </div>
                                                                    {/* Frame 224 — Input + message */}
                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 0, gap: "2px", width: "294px" }}>
                                                                        {/* Input */}
                                                                        <div style={{ boxSizing: "border-box", position: "relative", width: "294px", height: "39px", background: "#FFFFFF", border: "1px solid #E2E2E2", borderRadius: "8px", overflow: "hidden" }}>
                                                                            <div style={{ position: "absolute", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: "16px", left: "8px", right: "9px", top: "calc(50% - 8px)" }}>
                                                                                <label htmlFor="modal-otp" className="sr-only">OTP</label>
                                                                                <input
                                                                                    id="modal-otp"
                                                                                    type="text"
                                                                                    inputMode="numeric"
                                                                                    maxLength={6}
                                                                                    required
                                                                                    value={otp}
                                                                                    onChange={(e) => setOtp(e.target.value)}
                                                                                    placeholder="ENTER OTP"
                                                                                    style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "16px", letterSpacing: "-0.4px", color: "#333333" }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Error message (hidden by default per Figma display:none) */}
                                                                        {error && (
                                                                            <p style={{ margin: 0, fontFamily: "'Mona Sans', sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "16px", letterSpacing: "-0.4px", color: "#C8170D" }}>{error}</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Frame 276 — Resend OTP + countdown */}
                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0, gap: "5px", width: "114px", height: "16px" }}>
                                                                    {/* Resend OTP */}
                                                                    <span style={{ width: "67px", height: "16px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 500, fontSize: "12px", lineHeight: "16px", textAlign: "center", letterSpacing: "-0.4px", color: "#757575", flexShrink: 0 }}>Resend OTP</span>
                                                                    {/* 25 secs / Resend link */}
                                                                    {resendTimer > 0 ? (
                                                                        <span style={{ width: "42px", height: "16px", fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 700, fontSize: "12px", lineHeight: "16px", textAlign: "center", letterSpacing: "-0.4px", textDecorationLine: "underline", color: "#141414", flexShrink: 0 }}>{resendTimer} secs</span>
                                                                    ) : (
                                                                        <button type="button" onClick={handleLoginSendOtp} style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "16px", letterSpacing: "-0.4px", textDecoration: "underline", color: "#0859C5", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Resend</button>
                                                                    )}
                                                                </div>

                                                                {/* Frame 231 — Verify button */}
                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0, gap: "148px", width: "294px", height: "35px" }}>
                                                                    <button type="submit" disabled={loading}
                                                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "6px 20px", gap: "2px", width: "81px", height: "35px", background: loading ? "#f1e6c6" : "#FFCF46", borderRadius: "9999px", border: "none", cursor: loading ? "not-allowed" : "pointer", flexShrink: 0 }}>
                                                                        {loading ? <Spinner /> : (
                                                                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontStyle: "normal", fontWeight: 500, fontSize: "16px", lineHeight: "23px", letterSpacing: "-0.4px", color: "#1F1F1F", width: "41px", height: "23px" }}>Verify</span>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </motion.form>
                                                        )}

                                                    </AnimatePresence>

                                                    {/* SSO & Register link — only on Step 1 (Figma spec) */}
                                                    {loginStep === 1 && (
                                                        <>
                                                            <div className="w-full mt-1">
                                                                <div className="relative">
                                                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#eee]" /></div>
                                                                    <div className="relative flex justify-center"><span className="px-2 bg-white text-[#afafaf] text-[10px] uppercase tracking-wider">Or continue with</span></div>
                                                                </div>
                                                                <div className="mt-3">
                                                                    <button type="button" onClick={() => handleGoogleLogin()} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2 px-3 border border-[#e2e2e2] rounded-xl bg-white text-[12px] font-medium text-[#545454] hover:bg-[#f6f6f6] transition-colors disabled:opacity-50">
                                                                        <svg width="14" height="14" viewBox="0 0 48 48">
                                                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                                        </svg>
                                                                        Google
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <p className="text-center text-[12px] text-[#545454] w-full mt-1">
                                                                Don&apos;t have an account?{" "}
                                                                <button type="button" onClick={() => { setView("register"); setError(null); }} className="font-semibold text-[#0859c5] hover:text-[#06408f] bg-transparent border-none cursor-pointer p-0">
                                                                    Create account
                                                                </button>
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ) : (
                                /* ══ REGISTER — single-panel card ══ */
                                <div className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
                                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-gray-50 rounded-full">
                                        <X size={20} weight="fill" />
                                    </button>
                                    <div className="px-8 py-10">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                                            <p className="text-gray-500 text-sm">Join IndianRentals today</p>
                                        </div>
                                        {error && (
                                            <div className={`mb-6 p-4 rounded-md ${error.includes("successful") ? "bg-green-50 border-l-4 border-green-500 text-green-700" : "bg-red-50 border-l-4 border-red-500 text-red-700"}`}>
                                                <p className="text-sm">{error}</p>
                                            </div>
                                        )}
                                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={14} weight="fill" /></div>
                                                    <input name="name" type="text" required value={registerData.name} onChange={handleRegisterChange} className="w-full border border-gray-200 rounded-md px-3 h-10 pl-10 bg-gray-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#0859c5]" placeholder="Full Name" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><EnvelopeSimple size={14} weight="fill" /></div>
                                                    <input name="email" type="email" required value={registerData.email} onChange={handleRegisterChange} className="w-full border border-gray-200 rounded-md px-3 h-10 pl-10 bg-gray-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#0859c5]" placeholder="Gmail" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone size={14} weight="fill" /></div>
                                                    <input name="phone" type="tel" required value={registerData.phone} onChange={handleRegisterChange} className="w-full border border-gray-200 rounded-md px-3 h-10 pl-10 bg-gray-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#0859c5]" placeholder="+91 " />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={14} weight="fill" /></div>
                                                        <input name="password" type={showPassword ? "text" : "password"} required value={registerData.password} onChange={handleRegisterChange} className="w-full border border-gray-200 rounded-md px-3 h-10 pl-10 pr-10 bg-gray-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#0859c5]" placeholder="••••••••" />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                                            {showPassword ? <EyeSlash size={16} weight="fill" /> : <Eye size={16} weight="fill" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={14} weight="fill" /></div>
                                                        <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={registerData.confirmPassword} onChange={handleRegisterChange} className="w-full border border-gray-200 rounded-md px-3 h-10 pl-10 pr-10 bg-gray-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#0859c5]" placeholder="••••••••" />
                                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                                            {showConfirmPassword ? <EyeSlash size={16} weight="fill" /> : <Eye size={16} weight="fill" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 h-[35px] px-5 bg-[#ffcf46] border-none rounded-full cursor-pointer hover:bg-[#ffc629] active:scale-[0.98] disabled:bg-[#f1e6c6] disabled:cursor-not-allowed mt-2 font-medium text-[15px] text-[#1f1f1f]">
                                                {loading ? <Spinner /> : <><span>Create Account</span><ArrowRight size={13} weight="bold" /></>}
                                            </button>
                                        </form>
                                        <div className="mt-8 text-center text-sm text-gray-600">
                                            Already have an account?{" "}
                                            <button onClick={() => { setView("login"); setError(null); }} className="font-semibold text-[#0859c5] hover:text-[#06408f]">Sign in</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
