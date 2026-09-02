import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/config/site";

export const metadata = {
    title: `Our Rental Services | ${SITE_NAME}`,
    description:
        "Explore all rental services offered by IndianRenters — laptops, MacBooks, cameras, AV equipment, servers, and office equipment. Flexible monthly plans across India.",
    alternates: { canonical: `${SITE_URL}/services` },
};

const SERVICES = [
    {
        slug: "laptop-rental",
        icon: "💻",
        title: "Laptop Rentals",
        desc: "Dell, HP, Lenovo, Asus & more. Business laptops with i5/i7/i9 configurations.",
        badge: "Most Popular",
    },
    {
        slug: "macbook-rental",
        icon: "🍎",
        title: "MacBook Rentals",
        desc: "MacBook Air M2/M3 and MacBook Pro M3/M4 — all models available monthly.",
        badge: "Apple Silicon",
    },
    {
        slug: "camera-rental",
        icon: "📷",
        title: "Camera Rentals",
        desc: "Canon, Sony, Nikon DSLR & mirrorless cameras for shoots and productions.",
        badge: null,
    },
    {
        slug: "av-equipment-rental",
        icon: "🎬",
        title: "AV Equipment",
        desc: "Projectors, LED walls, PA sound systems, and event lighting rigs.",
        badge: "Events",
    },
    {
        slug: "server-rental",
        icon: "🖥️",
        title: "Server & IT Infrastructure",
        desc: "Dell, HP & Lenovo rack servers, NAS, and enterprise networking equipment.",
        badge: null,
    },
    {
        slug: "office-equipment-rental",
        icon: "🖨️",
        title: "Office Equipment",
        desc: "MFP printers, scanners, shredders, and office workstations for any setup.",
        badge: null,
    },
];

export default function ServicesPage() {
    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16 md:py-24 px-5 mb-12">
                <div className="max-w-[1200px] mx-auto text-center">
                    <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">Everything You Need</p>
                    <h1 className="text-3xl md:text-6xl font-bold mb-4 leading-tight">
                        Our Rental Services
                    </h1>
                    <p className="text-gray-300 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
                        From individual MacBooks to full event AV setups — IndianRenters has the right equipment
                        on flexible, affordable monthly terms.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-[1200px] mx-auto px-5 md:px-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((s) => (
                        <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="group bg-white border border-gray-100 rounded-3xl p-7 hover:shadow-lg hover:border-amber-200 transition-all flex flex-col gap-4 relative overflow-hidden"
                        >
                            {s.badge && (
                                <span className="absolute top-4 right-4 bg-amber-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
                                    {s.badge}
                                </span>
                            )}
                            <div className="text-5xl">{s.icon}</div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                    {s.title}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                            <span className="text-sm font-semibold text-amber-600 group-hover:underline">
                                Learn More →
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Why Rent CTA */}
            <section className="max-w-[1200px] mx-auto px-5 md:px-8">
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to Rent?
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base mb-6 max-w-lg mx-auto">
                        Talk to our rental experts for a free consultation and customized quote for your project.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/products"
                            className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Browse All Products
                        </Link>
                        <Link
                            href="/contact"
                            className="border-2 border-black text-black font-bold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
