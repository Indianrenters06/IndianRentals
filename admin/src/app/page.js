"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
          <CardHeader className="flex flex-col items-center gap-4 pb-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Enter your credentials to access the secure dashboard
              </p>
            </div>
          </CardHeader>

          <CardBody className="gap-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="admin@indianrentals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="w-4 h-4 text-slate-500" />}
                classNames={{
                  input: "bg-slate-900/50",
                  inputWrapper: "bg-slate-900/50 border border-slate-700 hover:border-slate-600 focus-within:border-indigo-500",
                }}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Lock className="w-4 h-4 text-slate-500" />}
                classNames={{
                  input: "bg-slate-900/50",
                  inputWrapper: "bg-slate-900/50 border border-slate-700 hover:border-slate-600 focus-within:border-indigo-500",
                }}
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold mt-6"
                size="lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
              <p>Protected by advanced encryption. Unauthorized access is strictly prohibited.</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
