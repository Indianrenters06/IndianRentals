"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/AuthCard";

// /register — the Figma sign-in card opened on its "Create account" tab.
// Verifying the SMS code creates the account and signs in; either way the user lands home.
const RegisterPage = () => {
  const router = useRouter();
  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10 bg-[#F6F6F6]">
      <AuthCard initialView="register" onSuccess={() => router.push("/")} />
    </main>
  );
};

export default RegisterPage;
