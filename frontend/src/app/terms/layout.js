import { publicMetadata } from '@/lib/publicMetadata';
import { SITE_URL, SITE_NAME } from "@/config/site";

const pageMetadata = {
    title: `Terms & Conditions | ${SITE_NAME}`,
    description:
        "Read the IndianRenters Terms & Conditions governing equipment rentals, payments, damage policy, and service usage.",
    alternates: { canonical: `${SITE_URL}/terms` },
    robots: { index: true, follow: true },
};
export const metadata = publicMetadata({ ...pageMetadata, path: '/terms' });

export default function TermsLayout({ children }) {
    return children;
}
