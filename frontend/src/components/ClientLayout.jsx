"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useConsent } from "./CookieConsent";
import footerStyles from "./Footer.module.css";
import CheckoutHeader from "./CheckoutHeader";
import { setupAuthInterceptor } from "@/services/authInterceptor";

export default function ClientLayout({ children }) {
    const pathname = usePathname() || "";
    const { openSettings } = useConsent();

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
            {!isCheckoutFlow && !pathname.startsWith('/profile') ? <Footer /> : (
                <div className="flex justify-center py-3">
                    <button type="button" className={footerStyles.cookieSettings} onClick={openSettings}>Cookie settings</button>
                </div>
            )}
        </div>
    );
}
