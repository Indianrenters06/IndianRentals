'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartHeader from "./CartHeader";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    // Use CartHeader for cart and all checkout pages
    const isCheckoutFlow = pathname === "/cart" || pathname.startsWith("/checkout");

    return (
        <div className="flex flex-col min-h-screen">
            {isCheckoutFlow ? <CartHeader /> : <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!isCheckoutFlow && !pathname.startsWith('/profile') && <Footer />}
        </div>
    );
}
