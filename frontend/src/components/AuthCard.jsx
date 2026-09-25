"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, ShieldCheck } from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../services/apiConfig";

/*
 * Sign in / Create account card — Figma login frames (870×575):
 * 377.58px photo panel on the left, form section on the right (30/42/18 padding).
 * Four screens: Sign in → "Enter your code." and Create account → "Verify your mobile."
 * Accounts are mobile-only; the account is created only once the SMS code checks out.
 * Shared by the navbar modal (AuthModal), /login and /register.
 */

const FONT = { fontFamily: "'Mona Sans', sans-serif" };
const PANEL_IMAGE = "/ipad-new.jpg";
const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

const Spinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

// Figma "Vector" beside the primary buttons: a 16×14 arrow turned -45°
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
const isValidPhone = (v) => /^[6-9]\d{9}$/.test(tenDigits(v));
// "+91 98••••••42"
const maskedPhone = (v) => {
    const d = tenDigits(v);
    return `+91 ${d.slice(0, 2)}••••••${d.slice(-2)}`;
};
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ── Figma building blocks ─────────────────────────────────────────────── */

// Label 13/20 bold #141414, 7px above the field
const Field = ({ label, htmlFor, children, className = "" }) => (
    <div className={`flex flex-col min-w-0 ${className}`}>
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
const PrimaryButton = ({ children, loading, gap = "gap-[2px]", ...props }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className={`flex items-center justify-center ${gap} w-full h-[48px] bg-[#FFCF46] border border-[#FFCF46] rounded-full text-[14px] leading-[21px] font-bold text-[#141414] hover:bg-[#FFC629] active:scale-[0.99] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
        style={FONT}
    >
        {loading ? <Spinner /> : children}
    </button>
);

const OrDivider = ({ className }) => (
    <div className={`flex items-center gap-[14px] w-full ${className}`}>
        <span className="flex-1 h-px bg-[#DDDDDD]" />
        <span className="text-[12px] leading-[18px] uppercase text-[#777777]" style={FONT}>or</span>
        <span className="flex-1 h-px bg-[#DDDDDD]" />
    </div>
);

// Six 49px boxes, 7px apart; the focused box gets the 2px #141414 border.
// Typing advances, Backspace steps back, and pasting / SMS autofill spreads the digits.
const CodeInput = ({ value, onChange, invalid }) => {
    const refs = useRef([]);
    const [focused, setFocused] = useState(0);
    const digits = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] || "");

    useEffect(() => { refs.current[0]?.focus(); }, []);

    const focusBox = (i) => refs.current[Math.max(0, Math.min(CODE_LENGTH - 1, i))]?.focus();

    const setDigit = (i, d) => {
        const next = [...digits];
        next[i] = d;
        onChange(next.join(""));
    };

    // Paste / SMS autofill: spread the digits from box i onwards
    const handleChange = (i, raw) => {
        const typed = digitsOf(raw);
        if (!typed) return;
        const next = [...digits];
        typed.slice(0, CODE_LENGTH - i).split("").forEach((d, k) => { next[i + k] = d; });
        onChange(next.join(""));
        focusBox(i + typed.length);
    };

    const handleKeyDown = (i, e) => {
        if (/^\d$/.test(e.key)) {
            e.preventDefault();
            setDigit(i, e.key);
            focusBox(i + 1);
        } else if (e.key === "Backspace") {
            e.preventDefault();
            if (digits[i]) setDigit(i, "");
            else if (i > 0) { setDigit(i - 1, ""); focusBox(i - 1); }
        } else if (e.key === "ArrowLeft") { e.preventDefault(); focusBox(i - 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); focusBox(i + 1); }
    };

    return (
        <div className="grid grid-cols-6 gap-[7px] w-full" role="group" aria-label="Six digit code">
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    id={i === 0 ? "auth-code" : undefined}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1}`}
                    placeholder="–"
                    value={d}
                    onFocus={(e) => { setFocused(i); e.target.select(); }}
                    onBlur={() => setFocused(-1)}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`box-border w-full min-w-0 h-[49px] rounded-[8px] bg-white text-center text-[22px] leading-[33px] text-[#141414] placeholder:text-[#B0B0B0] outline-none caret-transparent ${focused === i
                        ? "border-2 border-[#141414]"
                        : `border ${invalid ? "border-[#C8170D]" : "border-[#C9C9C9]"}`}`}
                    style={FONT}
                />
            ))}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════ */
const AuthCard = ({ initialView = "login", onClose, onSuccess, notice }) => {
    const router = useRouter();
    const [view, setView] = useState(initialView); // 'login' | 'register'
    const [step, setStep] = useState(1); // 1 = details, 2 = SMS code

    // Sign in
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    // Create account
    const [reg, setReg] = useState({ name: "", phone: "", terms: false });
    // Step 2 (both flows)
    const [code, setCode] = useState("");
    const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
    const [timerRun, setTimerRun] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(notice || null);

    // (Re)start the resend countdown whenever a code is sent
    useEffect(() => {
        if (step !== 2) return;
        setResendTimer(RESEND_SECONDS);
        const t = setInterval(() => setResendTimer((s) => (s <= 1 ? (clearInterval(t), 0) : s - 1)), 1000);
        return () => clearInterval(t);
    }, [step, timerRun]);

    const switchView = (next) => {
        setView(next);
        setError(null);
        setInfo(null);
        setStep(1);
        setCode("");
    };

    const backToDetails = () => { setStep(1); setCode(""); setError(null); };

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

    const isLogin = view === "login";
    const activePhone = isLogin ? phone : reg.phone;

    // Step 1 → send the code (also used by "Resend code")
    const sendCode = async (e) => {
        e?.preventDefault?.();
        setError(null); setInfo(null);
        if (isLogin) {
            if (!isValidPhone(phone)) { setPhoneError(true); return; }
        } else {
            if (!reg.name.trim()) { setError("Please enter your name."); return; }
            if (!isValidPhone(reg.phone)) { setError("Please enter a valid 10-digit mobile number."); return; }
            if (!reg.terms) { setError("Please accept the Terms and Privacy Policy."); return; }
        }
        setLoading(true);
        try {
            // Numbers travel as "+91XXXXXXXXXX" — the form accounts are looked up by
            if (isLogin) await postJSON("/api/auth/send-otp", { identifier: `+91${tenDigits(phone)}` });
            else await postJSON("/api/auth/register-otp", { name: reg.name.trim(), phone: `+91${tenDigits(reg.phone)}`, acceptTerms: true });
            setCode("");
            setStep(2);
            setTimerRun((n) => n + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2 → verify; signs in, or creates the account and signs in
    const verifyCode = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            const number = `+91${tenDigits(activePhone)}`;
            finish(isLogin
                ? await postJSON("/api/auth/verify-login", { identifier: number, otp: code })
                : await postJSON("/api/auth/register-verify", { phone: number, otp: code }));
        } catch (err) {
            // Keep the number, clear the boxes and say what went wrong inline
            setError(err.message);
            setCode("");
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

    const goTo = (path) => { onClose?.(); router.push(path); };

    const eyebrow = step === 1
        ? "Your rental account"
        : `${isLogin ? "Sign in" : "Create account"} / Step 02 of 02`;

    const linkButton = "bg-transparent border-0 p-0 text-inherit underline cursor-pointer";

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
                <p className="m-0 pb-[14px] text-[11px] leading-[16px] font-bold tracking-[1.32px] uppercase text-[#686868]">{eyebrow}</p>

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

                {/* ── Step 1: Sign in ── */}
                {isLogin && step === 1 && (
                    <>
                        <h3 className="m-0 text-[31px] leading-[36px] font-medium tracking-[-1.085px] text-[#141414]">Welcome back.</h3>
                        <p className="m-0 pt-2 text-[14px] leading-[21px] text-[#666666]">Sign in to continue your rental journey.</p>
                        {(error || info) && (
                            <p role={error ? "alert" : "status"} className={`m-0 mt-3 px-3 py-2 rounded-[8px] text-[12px] leading-[18px] ${error ? "bg-[#FFF2F1] text-[#C8170D]" : "bg-[#E8FFE4] text-[#0B7A10]"}`}>
                                {error || info}
                            </p>
                        )}
                        <form onSubmit={sendCode} noValidate>
                            <div className="pt-[22px]">
                                <Field label="Mobile number" htmlFor="auth-phone">
                                    <PhoneInput id="auth-phone" value={phone} invalid={phoneError} onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }} />
                                </Field>
                                {phoneError && <p className="m-0 pt-1 text-[11px] leading-[16px] text-[#C8170D]">Please enter a valid 10-digit mobile number.</p>}
                            </div>
                            <div className="pt-[15px]">
                                <PrimaryButton type="submit" loading={loading}>Continue with mobile <ArrowUpRight /></PrimaryButton>
                            </div>
                        </form>
                    </>
                )}

                {/* ── Step 1: Create account ── */}
                {!isLogin && step === 1 && (
                    <>
                        <h3 className="m-0 text-[28px] leading-[32px] font-medium tracking-[-0.98px] text-[#141414]">Create your account.</h3>
                        <p className="m-0 pt-2 text-[14px] leading-[21px] text-[#666666]">A few details, then you&apos;re ready to plan.</p>
                        {error && (
                            <p role="alert" className="m-0 mt-3 px-3 py-2 rounded-[8px] text-[12px] leading-[18px] bg-[#FFF2F1] text-[#C8170D]">{error}</p>
                        )}
                        <form onSubmit={sendCode} noValidate>
                            {/* Full name 162.53 + Mobile number 233.89, 10px apart */}
                            <div className="grid grid-cols-1 sm:grid-cols-[162.53fr_233.89fr] gap-x-[10px] gap-y-3 pt-[14px] pb-[15px]">
                                <Field label="Full name" htmlFor="auth-name">
                                    <div className={boxClass}>
                                        <input id="auth-name" type="text" autoComplete="name" placeholder="Your name" value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} className={`${inputClass} !px-[14px]`} style={FONT} />
                                    </div>
                                </Field>
                                <Field label="Mobile number" htmlFor="auth-reg-phone">
                                    <PhoneInput id="auth-reg-phone" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} />
                                </Field>
                            </div>
                            {/* 16px checkbox, 1px #999, radius 2; 9px gap; 12/18 #555 */}
                            <label className="flex items-start gap-[9px] cursor-pointer">
                                <span className="relative flex shrink-0 pt-px">
                                    <input
                                        type="checkbox"
                                        checked={reg.terms}
                                        onChange={(e) => setReg({ ...reg, terms: e.target.checked })}
                                        className="peer appearance-none m-0 w-4 h-4 border border-[#999999] rounded-[2px] bg-white checked:bg-[#141414] checked:border-[#141414] cursor-pointer"
                                    />
                                    <svg className="pointer-events-none absolute left-[3px] top-[4px] hidden peer-checked:block" width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                        <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-[12px] leading-[18px] text-[#555555]">
                                    I agree to the{" "}
                                    <button type="button" onClick={() => goTo("/terms")} className={linkButton}>Terms</button>
                                    {" "}and{" "}
                                    <button type="button" onClick={() => goTo("/privacy")} className={linkButton}>Privacy Policy</button>.
                                </span>
                            </label>
                            <div className="pt-[12px]">
                                <PrimaryButton type="submit" loading={loading} gap="gap-[10px]">
                                    Continue to verification <span aria-hidden="true">→</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </>
                )}

                {/* ── Step 2: code (both flows) ── */}
                {step === 2 && (
                    <form onSubmit={verifyCode} noValidate>
                        {/* Progress — two 3px #FFCF46 segments, 5px apart, 3px into the tab gap */}
                        <div className="relative h-[22px]">
                            <div className="absolute inset-x-0 -top-[3px] flex gap-[5px]" aria-hidden="true">
                                <span className="flex-1 h-[3px] rounded-[3px] bg-[#FFCF46]" />
                                <span className="flex-1 h-[3px] rounded-[3px] bg-[#FFCF46]" />
                            </div>
                        </div>

                        {/* Users tile — 40×39, orange-100 fill, orange-500 glyph */}
                        <span className="flex items-center justify-center w-10 h-[39px] rounded-[8px] bg-[#FFF1C5]" aria-hidden="true">
                            <Users size={20} color="#F08C00" />
                        </span>
                        <h3 className="m-0 pt-[13px] text-[31px] leading-[36px] font-medium tracking-[-1.085px] text-[#141414]">
                            {isLogin ? "Enter your code." : "Verify your mobile."}
                        </h3>
                        <p className="m-0 pt-2 text-[14px] leading-[21px] text-[#666666]">
                            A six-digit code was sent to {maskedPhone(activePhone)}. Change it below.
                        </p>

                        <div className="pt-[22px]">
                            <Field label="Verification code" htmlFor="auth-code">
                                <CodeInput value={code} onChange={(v) => { setCode(v); setError(null); }} invalid={!!error} />
                            </Field>
                            {error && <p role="alert" className="m-0 pt-[6px] text-[11px] leading-[15px] text-[#C8170D]">{error}</p>}
                        </div>

                        {/* Resend row — 12/18, space-between */}
                        <div className="flex items-start justify-between gap-[10px] pt-[14px] text-[12px] leading-[18px]">
                            <span className="text-[#777777]">Didn&apos;t get it?</span>
                            {resendTimer > 0
                                ? <span className="font-semibold text-[#555555]">Resend code in {mmss(resendTimer)}</span>
                                : <button type="button" onClick={sendCode} disabled={loading} className="bg-transparent border-0 p-0 font-semibold text-[#141414] underline cursor-pointer disabled:opacity-60">Resend code</button>}
                        </div>

                        {!isLogin && (
                            <div className="pt-[12px]">
                                <div className="flex items-center gap-[8px] px-[10px] py-[9px] rounded-[6px] bg-[#F6F6F6]">
                                    <ShieldCheck size={20} color="#000000" aria-hidden="true" />
                                    <span className="text-[11px] leading-[16px] text-[#555555]">Terms and Privacy consent confirmed on step 01.</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-[12px] pt-[12px]">
                            <PrimaryButton type="submit" loading={loading} disabled={code.length < CODE_LENGTH} gap="gap-[4px]">
                                {isLogin ? "Verify and sign in" : "Verify and create account"} <ArrowUpRight />
                            </PrimaryButton>
                            <button type="button" onClick={backToDetails} className="bg-transparent border-0 p-0 text-[14px] leading-[21px] font-bold text-[#141414] underline cursor-pointer">
                                Change number
                            </button>
                        </div>
                    </form>
                )}

                {step === 1 && (
                    <>
                        <OrDivider className={isLogin ? "pt-[17px]" : "pt-[10px]"} />
                        <div className={isLogin ? "pt-[17px]" : "pt-[10px]"}>
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={loading}
                                className="flex items-center justify-center gap-[10px] w-full h-[48px] bg-white border border-[#C9C9C9] rounded-full text-[14px] leading-[21px] font-bold text-[#141414] hover:bg-[#F6F6F6] transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                <GoogleG /> Continue with Google
                            </button>
                        </div>
                        <p className={`m-0 ${isLogin ? "pt-[17px]" : "pt-[10px]"} text-center text-[13px] leading-[20px] text-[#666666]`}>
                            {isLogin ? "New here? " : "Already have an account? "}
                            <button type="button" onClick={() => switchView(isLogin ? "register" : "login")} className="bg-transparent border-0 p-0 font-bold text-[#141414] underline cursor-pointer">
                                {isLogin ? "Create an account" : "Sign in"}
                            </button>
                        </p>
                    </>
                )}

                {/* Footer — 1px #E5E5E5 rule, 11/16 #777 (sign-in only; Create account has the Terms checkbox) */}
                {isLogin && step === 1 && (
                    <div className="pt-[17px]">
                        <p className="m-0 pt-3 border-t border-[#E5E5E5] text-[11px] leading-[16px] text-[#777777]">
                            By continuing you agree to our{" "}
                            <button type="button" onClick={() => goTo("/terms")} className="bg-transparent border-0 p-0 text-[#141414] underline cursor-pointer">Terms &amp; Conditions</button>
                            {" "}and{" "}
                            <button type="button" onClick={() => goTo("/privacy")} className="bg-transparent border-0 p-0 text-[#141414] underline cursor-pointer">Privacy Policy</button>.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AuthCard;
