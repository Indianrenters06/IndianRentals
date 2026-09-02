import { SITE_URL, SITE_NAME } from "@/config/site";

export const metadata = {
    title: `Contact Us — Get in Touch | ${SITE_NAME}`,
    description:
        "Contact IndianRenters for rental enquiries, quotes, or support. Offices in Delhi, Mumbai, Bangalore, Hyderabad, Pune, Noida, Chennai & Kolkata.",
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        title: `Contact Us | ${SITE_NAME}`,
        description: "Reach out to our team for rental quotes and support across 8 major Indian cities.",
        url: `${SITE_URL}/contact`,
    },
};

export default function ContactLayout({ children }) {
    return (
        <div className="bg-white min-h-screen">
            {children}
        </div>
    );
}
