"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CheckoutHeader from "./CheckoutHeader";
import { setupAuthInterceptor } from "@/services/authInterceptor";

export default function ClientLayout({ children }) {
    const pathname = usePathname() || "";

    // Install the global 401 -> auto-logout interceptor once on the client.
    useEffect(() => {
        setupAuthInterceptor();
    }, []);
    // Use CartHeader for cart and all checkout pages
    const isCheckoutFlow = pathname === "/cart" || pathname.startsWith("/checkout");

    return (
        <div className="flex flex-col min-h-screen">
            {isCheckoutFlow ? <CheckoutHeader /> : <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!isCheckoutFlow && !pathname.startsWith('/profile') && <Footer />}
        </div>
    );
}
