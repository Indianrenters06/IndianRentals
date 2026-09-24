"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../services/apiConfig";

/*
 * Sign in / Create account card — Figma login frame (870×575):
 * 377.58px photo panel on the left, form section on the right (30/42/18 padding).
 * Shared by the navbar modal (AuthModal), /login and /register.
 */

const FONT = { fontFamily: "'Mona Sans', sans-serif" };
const PANEL_IMAGE = "/ipad-new.jpg";

const Spinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

// Figma "Vector" beside "Continue with mobile": a 16×14 arrow turned -45°
const ArrowUpRight = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true" style={{ transform: "rotate(-45deg)" }}>
        <path d="M1 7h13M9 2l5 5-5 5" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GoogleG = () => (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

const digitsOf = (v) => v.replace(/\D/g, "");
const tenDigits = (v) => {
    const d = digitsOf(v);
    return d.length === 12 && d.startsWith("91") ? d.slice(2) : d;
};
const isValidPhone = (v) => tenDigits(v).length === 10;

/* ── Figma building blocks ─────────────────────────────────────────────── */

// Label 13/20 bold #141414, 7px above the field
const Field = ({ label, htmlFor, children }) => (
    <div className="flex flex-col w-full">
        <label htmlFor={htmlFor} className="text-[13px] leading-[20px] font-bold text-[#141414]" style={FONT}>{label}</label>
        <div className="pt-[7px]">{children}</div>
    </div>
);

// 49px box, 1px #C9C9C9, radius 12; text 13/20
const boxClass = "flex items-center w-full h-[49px] bg-white border border-[#C9C9C9] rounded-[12px] overflow-hidden focus-within:border-[#141414] transition-colors";
const inputClass = "flex-1 min-w-0 h-full px-3 bg-transparent border-none outline-none text-[13px] leading-[20px] text-[#141414] placeholder:text-[#8A8A8A]";

const PhoneInput = ({ id, value, onChange, invalid }) => (
    <div className={`${boxClass} ${invalid ? "!border-[#C8170D]" : ""}`}>
        {/* "+91" cell — 49px wide, #DEDEDE rule on the right */}
        <span className="flex items-center h-full px-[13px] border-r border-[#DEDEDE] text-[13px] leading-[20px] font-semibold text-[#141414]" style={FONT}>+91</span>
        <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={14}
            placeholder="10-digit mobile number"
            value={value}
            onChange={onChange}
            className={inputClass}
            style={FONT}
        />
    </div>
);

// 48px pill, 14/21 bold #141414
const PrimaryButton = ({ children, loading, ...props }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className="flex items-center justify-center gap-[2px] w-full h-[48px] bg-[#FFCF46] border border-[#FFCF46] rounded-full text-[14px] leading-[21px] font-bold text-[#141414] hover:bg-[#FFC629] active:scale-[0.99] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={FONT}
    >
        {loading ? <Spinner /> : children}
    </button>
);

const OrDivider = () => (
    <div className="flex items-center gap-[14px] w-full pt-[17px]">
        <span className="flex-1 h-px bg-[#DDDDDD]" />
        <span className="text-[12px] leading-[18px] uppercase text-[#777777]" style={FONT}>or</span>
        <span className="flex-1 h-px bg-[#DDDDDD]" />
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════ */
const AuthCard = ({ initialView = "login", onClose, onSuccess, notice }) => {
    const router = useRouter();
    const [view, setView] = useState(initialView); // 'login' | 'register'

    // Sign in (mobile OTP)
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(25);

    // Create account
    const [reg, setReg] = useState({ name: "", email: "", phone: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(notice || null);

    useEffect(() => {
        if (step !== 2) return;
        setResendTimer(25);
        const t = setInterval(() => setResendTimer((s) => (s <= 1 ? (clearInterval(t), 0) : s - 1)), 1000);
        return () => clearInterval(t);
    }, [step]);

    const switchView = (next) => {
        setView(next);
        setError(null);
        setInfo(null);
        setStep(1);
    };

    const finish = (data) => {
        localStorage.setItem("userInfo", JSON.stringify(data));
        window.dispatchEvent(new Event("userInfoChanged"));
        onSuccess?.(data);
    };

    const postJSON = async (path, body) => {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
        return data;
    };

    /* ── Sign in ── */
    const sendOtp = async (e) => {
        e?.preventDefault?.();
        if (!isValidPhone(phone)) { setPhoneError(true); return; }
        setLoading(true); setError(null); setInfo(null);
        try {
            await postJSON("/api/auth/send-otp", { identifier: `+91${tenDigits(phone)}` });
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            finish(await postJSON("/api/auth/verify-login", { identifier: `+91${tenDigits(phone)}`, otp: otp.trim() }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── Create account ── */
    const register = async (e) => {
        e.preventDefault();
        if (!isValidPhone(reg.phone)) { setError("Please enter a complete 10-digit mobile number."); return; }
        setLoading(true); setError(null);
        try {
            // Same "+91XXXXXXXXXX" form the sign-in step looks the number up by
            await postJSON("/api/auth/register", { name: reg.name.trim(), email: reg.email.trim(), phone: `+91${tenDigits(reg.phone)}`, password: reg.password });
            setPhone(tenDigits(reg.phone));
            setView("login");
            setStep(1);
            setInfo("Account created! Continue with your mobile number to sign in.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── Google ── */
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true); setError(null);
            try {
                finish(await postJSON("/api/auth/google-login", { access_token: tokenResponse.access_token }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        onError: (err) => setError(err?.error_description || "Google sign-in was cancelled."),
    });

    const isLogin = view === "login";
    const heading = isLogin ? (step === 1 ? "Welcome back." : "Enter your OTP.") : "Create your account.";
    const subheading = isLogin
        ? (step === 1 ? "Sign in to continue your rental journey." : `We sent a code to +91 ${tenDigits(phone)}.`)
        : "Sign up to start renting with IndianRenters.";

    const goTo = (path) => { onClose?.(); router.push(path); };

    return (
        // Container — 870×575, white, 1px #DFDFDF, radius 15, soft shadow
        <div
            className="relative flex w-full max-w-[870px] md:min-h-[575px] max-h-[calc(100vh-32px)] bg-white border border-[#DFDFDF] rounded-[15px] overflow-hidden"
            style={{ boxShadow: "0px 14px 42px rgba(0, 0, 0, 0.094)", ...FONT }}
        >
            {/* Figure — 377.58px photo panel with top/bottom scrim and caption */}
            <figure className="relative hidden md:block shrink-0 w-[377.58px] m-0 bg-[#141414]">
                <Image src={PANEL_IMAGE} alt="Professional opening a laptop for a project, with a projector nearby" fill sizes="378px" className="object-cover" priority />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0, 0, 0, 0.733) 0%, rgba(0, 0, 0, 0) 43%, rgba(0, 0, 0, 0.467) 100%)" }} />
                <figcaption className="absolute left-[30px] top-[33px] w-[325.58px] flex flex-col">
                    <span className="text-[11px] leading-[16px] tracking-[1.65px] text-[#DDDDDD] uppercase">The Work Edit / Account</span>
                    <span className="pt-[14px] w-[200px] text-[36px] leading-[39px] font-medium tracking-[-1.62px] text-white">There&apos;s more work ahead.</span>
                    <span className="pt-[11px] text-[14px] leading-[21px] text-[#E1E1E1]">Pick up where your project left off.</span>
                </figcaption>
            </figure>

            {/* Section — form column */}
            <section className="relative flex-1 min-w-0 flex flex-col justify-center px-6 md:px-[42px] pt-[30px] pb-[18px] overflow-y-auto">
                {/* Close — 36px #F6F6F6 circle, top-right */}
                {onClose && (
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="absolute top-4 right-[18px] w-9 h-9 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] flex items-center justify-center text-[25px] leading-[25px] text-[#141414] cursor-pointer z-10"
                    >
                        ×
                    </button>
                )}

                {/* Eyebrow */}
                <p className="m-0 pb-[14px] text-[11px] leading-[16px] font-bold tracking-[1.32px] uppercase text-[#686868]">Your rental account</p>

                {/* Tabs — #DDD rule; active tab has a 2px #141414 underline */}
                <div className="pb-[18px]">
                    <div className="flex items-start gap-[25px] border-b border-[#DDDDDD]" role="tablist">
                        {[["login", "Sign in"], ["register", "Create account"]].map(([key, label]) => {
                            const active = view === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => switchView(key)}
                                    className={`-mb-px pb-[11px] text-[14px] leading-[21px] bg-transparent border-0 cursor-pointer ${active ? "font-bold text-[#141414] border-b-2 border-[#141414]" : "font-normal text-[#777777] border-b-2 border-transparent hover:text-[#141414]"}`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Heading */}
                <h3 className="m-0 text-[31px] leading-[36px] font-medium tracking-[-1.085px] text-[#141414]">{heading}</h3>
                <p className="m-0 pt-2 text-[14px] leading-[21px] text-[#666666]">{subheading}</p>

                {(error || info) && (
                    <p role={error ? "alert" : "status"} className={`m-0 mt-3 px-3 py-2 rounded-[8px] text-[12px] leading-[18px] ${error ? "bg-[#FFF2F1] text-[#C8170D]" : "bg-[#E8FFE4] text-[#0B7A10]"}`}>
                        {error || info}
                    </p>
                )}

                {isLogin && step === 1 && (
                    <form onSubmit={sendOtp} noValidate>
                        <div className="pt-[22px]">
                            <Field label="Mobile number" htmlFor="auth-phone">
                                <PhoneInput id="auth-phone" value={phone} invalid={phoneError} onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }} />
                            </Field>
                            {phoneError && <p className="m-0 pt-1 text-[11px] leading-[16px] text-[#C8170D]">Please enter a complete 10-digit mobile number.</p>}
                        </div>
                        <div className="pt-[15px]">
                            <PrimaryButton type="submit" loading={loading}>Continue with mobile <ArrowUpRight /></PrimaryButton>
                        </div>
                    </form>
                )}

                {isLogin && step === 2 && (
                    <form onSubmit={verifyOtp}>
                        <div className="pt-[22px]">
                            <Field label="One-time password" htmlFor="auth-otp">
                                <div className={boxClass}>
                                    <input
                                        id="auth-otp"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        required
                                        autoFocus
                                        placeholder="6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        className={`${inputClass} tracking-[0.3em]`}
                                    />
                                </div>
                            </Field>
                            <div className="flex items-center justify-between pt-2 text-[12px] leading-[18px]">
                                <button type="button" onClick={() => { setStep(1); setOtp(""); setError(null); }} className="bg-transparent border-0 p-0 text-[#777777] hover:text-[#141414] cursor-pointer">Change number</button>
                                {resendTimer > 0
                                    ? <span className="text-[#777777]">Resend in {resendTimer}s</span>
                                    : <button type="button" onClick={sendOtp} className="bg-transparent border-0 p-0 font-bold text-[#141414] underline cursor-pointer">Resend OTP</button>}
                            </div>
                        </div>
                        <div className="pt-[15px]">
                            <PrimaryButton type="submit" loading={loading} disabled={otp.length < 6}>Verify &amp; sign in <ArrowUpRight /></PrimaryButton>
                        </div>
                    </form>
                )}

                {!isLogin && (
                    <form onSubmit={register} className="flex flex-col gap-3 pt-[22px]">
                        <Field label="Full name" htmlFor="auth-name">
                            <div className={boxClass}>
                                <input id="auth-name" type="text" autoComplete="name" required placeholder="Your name" value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} className={inputClass} />
                            </div>
                        </Field>
                        <Field label="Email" htmlFor="auth-email">
                            <div className={boxClass}>
                                <input id="auth-email" type="email" autoComplete="email" required placeholder="you@example.com" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} className={inputClass} />
                            </div>
                        </Field>
                        <Field label="Mobile number" htmlFor="auth-reg-phone">
                            <PhoneInput id="auth-reg-phone" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} />
                        </Field>
                        <Field label="Password" htmlFor="auth-password">
                            <div className={boxClass}>
                                <input id="auth-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required placeholder="At least 8 characters" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} className={inputClass} />
                                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="px-3 h-full bg-transparent border-0 text-[#777777] hover:text-[#141414] cursor-pointer">
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Mirrors the backend rule in models/User.js */}
                            <p className="m-0 pt-1 text-[11px] leading-[16px] text-[#777777]">Use upper &amp; lower case, a number and a symbol (@$!%*?&amp;).</p>
                        </Field>
                        <div className="pt-[3px]">
                            <PrimaryButton type="submit" loading={loading}>Create account <ArrowUpRight /></PrimaryButton>
                        </div>
                    </form>
                )}

                {step === 1 && (
                    <>
                        <OrDivider />
                        <div className="pt-[17px]">
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={loading}
                                className="flex items-center justify-center gap-[10px] w-full h-[48px] bg-white border border-[#C9C9C9] rounded-full text-[14px] leading-[21px] font-bold text-[#141414] hover:bg-[#F6F6F6] transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                <GoogleG /> Continue with Google
                            </button>
                        </div>
                        <p className="m-0 pt-[17px] text-center text-[13px] leading-[20px] text-[#666666]">
                            {isLogin ? "New here? " : "Already have an account? "}
                            <button type="button" onClick={() => switchView(isLogin ? "register" : "login")} className="bg-transparent border-0 p-0 font-bold text-[#141414] underline cursor-pointer">
                                {isLogin ? "Create an account" : "Sign in"}
                            </button>
                        </p>
                    </>
                )}

                {/* Footer — 1px #E5E5E5 rule, 11/16 #777 (Figma's design-preview note slot) */}
                <div className="pt-[17px]">
                    <p className="m-0 pt-3 border-t border-[#E5E5E5] text-[11px] leading-[16px] text-[#777777]">
                        By continuing you agree to our{" "}
                        <button type="button" onClick={() => goTo("/terms")} className="bg-transparent border-0 p-0 text-[#141414] underline cursor-pointer">Terms &amp; Conditions</button>
                        {" "}and{" "}
                        <button type="button" onClick={() => goTo("/privacy")} className="bg-transparent border-0 p-0 text-[#141414] underline cursor-pointer">Privacy Policy</button>.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AuthCard;
