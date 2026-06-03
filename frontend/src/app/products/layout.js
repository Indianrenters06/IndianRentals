// Server component: provides SEO metadata for the products listing page.
// The page itself (page.js) stays a client component.
export const metadata = {
    title: "Rent Laptops, MacBooks, Cameras & Equipment",
    description:
        "Browse and rent premium tech — laptops, MacBooks, servers, DSLR cameras, AV gear and office equipment. Flexible rental plans with doorstep delivery across India.",
    alternates: { canonical: "/products" },
    openGraph: {
        title: "All Rental Products | IndianRenters",
        description:
            "Browse and rent premium tech — laptops, MacBooks, cameras, AV gear and office equipment across India.",
        url: "/products",
    },
};

export default function ProductsLayout({ children }) {
    return children;
}
