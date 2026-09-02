import { SITE_URL, SITE_NAME } from "@/config/site";

export const metadata = {
    title: `About Us — India's Premier Tech Rental Platform | ${SITE_NAME}`,
    description:
        "Learn about IndianRenters — India's largest tech rental platform since 1992. Serving 10,000+ clients across 401+ cities with laptops, cameras, AV gear, and IT infrastructure.",
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
        title: `About IndianRenters | ${SITE_NAME}`,
        description: "From 1992 to today — learn how IndianRenters became India's most trusted equipment rental partner.",
        url: `${SITE_URL}/about`,
    },
};

export default function AboutLayout({ children }) {
    return children;
}
