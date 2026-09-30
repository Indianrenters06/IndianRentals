"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TrustStrip from "./TrustStrip";
import Testimonials from "./Testimonials";
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
    const hasPageTestimonials = pathname === "/" || pathname === "/rental-process" || pathname.startsWith("/products/");
    const marketingRoutes = [
        '/about', '/products', '/categories', '/category', '/faq', '/contact',
        '/blog', '/locations', '/services', '/careers', '/terms', '/privacy',
        '/kyc-policy', '/shipping', '/return-policy', '/refund-policy', '/rules',
        '/delivery-charges', '/late-fee-rules', '/cancellation-rules', '/subscription-rules',
    ];
    // These page families intentionally omit the shared customer reviews section.
    const routesWithoutTestimonials = ['/contact', '/locations', '/services', '/faq', '/blog'];
    const showSharedTestimonials = !isCheckoutFlow && !hasPageTestimonials
        && !routesWithoutTestimonials.some(route => pathname === route || pathname.startsWith(`${route}/`))
        && marketingRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

    const showTrustStrip = !isCheckoutFlow && (pathname === '/' || pathname === '/rental-process'
        || marketingRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)));

    return (
        <div className="flex flex-col min-h-screen">
            {isCheckoutFlow ? <CheckoutHeader /> : <Navbar />}
            <main className="flex-grow">
                {children}
                {showSharedTestimonials && <Testimonials />}
            </main>
            {!isCheckoutFlow && !pathname.startsWith('/profile') ? <>
                {showTrustStrip && <TrustStrip />}
                <Footer />
            </> : (
                <div className="flex justify-center py-3">
                    <button type="button" className={footerStyles.cookieSettings} onClick={openSettings}>Cookie settings</button>
                </div>
            )}
        </div>
    );
}
