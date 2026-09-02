import { SITE_URL, SITE_NAME } from "@/config/site";

export const metadata = {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
        "Read the IndianRenters Privacy Policy to understand how we collect, use, and protect your personal information when you use our rental services.",
    alternates: { canonical: `${SITE_URL}/privacy` },
    robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }) {
    return children;
}
