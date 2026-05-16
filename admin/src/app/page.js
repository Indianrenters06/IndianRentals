"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, EnvelopeSimple, ShieldCheck, ArrowRight, ChartLineUp, Database, HardDrive } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button } from "@heroui/react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminInfo", JSON.stringify(data));
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setForgotMessage("");

    // Simulate API call for forgot password
    setTimeout(() => {
      setIsLoading(false);
      if (!forgotEmail) {
        setError("Please enter your email address.");
      } else {
        setForgotMessage(`If an account exists for ${forgotEmail}, a password reset link will be sent shortly.`);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 dark:opacity-30" />
      </div>

      <div className="flex w-full z-10">
        {/* Left Side - Info Panel */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <img 
                src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png" 
                alt="IndianRentals Admin" 
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="z-10 max-w-md"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Command Center
              <br />
              <span className="text-slate-500 dark:text-slate-400 font-medium text-3xl">for your operations.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              Manage inventory, oversee rentals, and gain powerful insights into your business performance through our secure administration console.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: ChartLineUp, text: "Real-time analytics and reporting" },
                { icon: Database, text: "Centralized inventory management" },
                { icon: HardDrive, text: "Secure infrastructure \& data protection" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <item.icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" weight="bold" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Decorative floating elements */}
          <div className="absolute bottom-12 right-12 z-0 opacity-20">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 50,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-64 h-64 border border-indigo-500/30 rounded-full border-dashed flex items-center justify-center"
            >
              <div className="w-48 h-48 border border-purple-500/30 rounded-full border-dashed" />
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Mobile Header */}
            <div className="lg:hidden flex flex-col items-center mb-10">
              <img 
                src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png" 
                alt="IndianRentals Admin" 
                className="h-16 w-auto object-contain drop-shadow-xl"
              />
            </div>

            <Card className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 shadow-2xl p-2 sm:p-4 rounded-3xl overflow-visible transition-colors duration-300">
              <CardBody className="p-6 sm:p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h3>
                  <p className="text-slate-500 dark:text-slate-400">Sign in to your administration account</p>
                </div>

                {!isForgotMode ? (
                  <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <div className="relative group/email">
                        <EnvelopeSimple
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within/email:text-indigo-500 transition-colors pointer-events-none"
                          weight="bold"
                        />
                        <input
                          type="email"
                          placeholder="admin@indianrentals.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="off"
                          name="admin-email-nofill"
                          required
                          className="w-full h-14 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900/50 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                      <div className="relative group/pass">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within/pass:text-indigo-500 transition-colors pointer-events-none"
                          weight="bold"
                        />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          name="admin-pass-nofill"
                          required
                          className="w-full h-14 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium tracking-widest text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900/50 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 transition-colors peer-checked:bg-indigo-500 peer-checked:border-indigo-500 group-hover:border-slate-400 dark:group-hover:border-slate-500" />
                          <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">Remember me</span>
                      </label>

                      <button 
                        type="button" 
                        onClick={() => { setIsForgotMode(true); setError(""); setForgotMessage(""); }} 
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={isLoading}
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isLoading ? (
                          "Authenticating..."
                        ) : (
                          <>
                            Secure Sign In
                            <ArrowRight className="w-5 h-5" weight="bold" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-5" autoComplete="off">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}
                    {forgotMessage && (
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        {forgotMessage}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <div className="relative group/email">
                        <EnvelopeSimple
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within/email:text-indigo-500 transition-colors pointer-events-none"
                          weight="bold"
                        />
                        <input
                          type="email"
                          placeholder="admin@indianrentals.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          autoComplete="off"
                          required
                          className="w-full h-14 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900/50 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                        />
                      </div>
                      <p className="text-xs text-slate-500 ml-1 mt-2">Enter your email and we'll send you instructions to reset your password.</p>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={isLoading || !!forgotMessage}
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                      <Button
                        type="button"
                        onPress={() => { setIsForgotMode(false); setError(""); setForgotMessage(""); }}
                        className="w-full h-14 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-base rounded-xl transition-colors"
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 text-center">
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" weight="bold" />
                    Protected by enterprise-grade encryption
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
