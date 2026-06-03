// Server component: provides SEO metadata for the categories listing page.
export const metadata = {
    title: "Rental Categories — Apple, IT, AV, Office & Cameras",
    description:
        "Explore IndianRenters categories: Apple products, IT equipment, AV gear, office equipment and DSLR cameras. Find the right rental for your business or event.",
    alternates: { canonical: "/categories" },
    openGraph: {
        title: "Rental Categories | IndianRenters",
        description:
            "Explore rental categories: Apple, IT, AV, office equipment and DSLR cameras across India.",
        url: "/categories",
    },
};

export default function CategoriesLayout({ children }) {
    return children;
}
