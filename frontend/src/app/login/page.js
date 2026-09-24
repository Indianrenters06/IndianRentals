"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "../../components/AuthCard";

// Only internal, same-origin paths may be redirected to after sign-in.
const safeRedirect = (value) => {
  if (!value) return "/";
  try {
    const decoded = decodeURIComponent(value);
    return decoded.startsWith("/") && !decoded.startsWith("//") ? decoded : "/";
  } catch {
    return "/";
  }
};

// Reads the session-expired / redirect params written by the auth interceptor.
const LoginCard = () => {
  const router = useRouter();
  const params = useSearchParams();
  const notice = params.get("session") === "expired"
    ? "Your session expired. Please sign in again to continue."
    : null;

  return (
    <AuthCard
      initialView="login"
      notice={notice}
      onSuccess={() => router.push(safeRedirect(params.get("redirect")))}
    />
  );
};

// /login — the same Figma sign-in card as the navbar pop-up, centred on the page.
const LoginPage = () => (
  <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10 bg-[#F6F6F6]">
    <Suspense fallback={null}>
      <LoginCard />
    </Suspense>
  </main>
);

export default LoginPage;
