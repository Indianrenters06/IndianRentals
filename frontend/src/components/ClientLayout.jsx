"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CheckoutHeader from "./CheckoutHeader";
import { ReduxProvider } from "@/redux/provider";
import { SettingsProvider } from "@/context/SettingsContext";

export default function ClientLayout({ children }) {
    const pathname = usePathname() || "";
    // Use CartHeader for cart and all checkout pages
    const isCheckoutFlow = pathname === "/cart" || pathname.startsWith("/checkout");

    return (
        <ReduxProvider>
            <SettingsProvider>
                <div className="flex flex-col min-h-screen">
                    {isCheckoutFlow ? <CheckoutHeader /> : <Navbar />}
                    <main className="flex-grow">
                        {children}
                    </main>
                    {!isCheckoutFlow && !pathname.startsWith('/profile') && <Footer />}
                </div>
            </SettingsProvider>
        </ReduxProvider>
    );
}
