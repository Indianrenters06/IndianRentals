import { publicMetadata } from '@/lib/publicMetadata';
import { SITE_URL, SITE_NAME } from "@/config/site";

const pageMetadata = {
    title: `FAQs — Rental Process, Policies & Support | ${SITE_NAME}`,
    description:
        "Find answers to the most common questions about renting laptops, cameras, and AV equipment from IndianRenters — delivery, KYC, damage policy, and more.",
    alternates: { canonical: `${SITE_URL}/faq` },
    openGraph: {
        title: `FAQs | ${SITE_NAME}`,
        description: "Answers to common questions about IndianRenters — rental process, delivery, damage policy, and more.",
        url: `${SITE_URL}/faq`,
    },
};
export const metadata = publicMetadata({ ...pageMetadata, path: '/faq' });

export default function FaqLayout({ children }) {
    return children;
}
