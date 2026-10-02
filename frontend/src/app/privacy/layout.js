import { publicMetadata } from '@/lib/publicMetadata';
import { SITE_URL, SITE_NAME } from "@/config/site";

const pageMetadata = {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
        "Read the IndianRenters Privacy Policy to understand how we collect, use, and protect your personal information when you use our rental services.",
    alternates: { canonical: `${SITE_URL}/privacy` },
    robots: { index: true, follow: true },
};
export const metadata = publicMetadata({ ...pageMetadata, path: '/privacy' });

export default function PrivacyLayout({ children }) {
    return children;
}
