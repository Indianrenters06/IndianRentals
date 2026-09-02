import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/config/site";

// ── City data — extend as needed ────────────────────────────────────────────
const CITIES = {
    delhi: {
        name: "Delhi",
        state: "Delhi",
        tagline: "Premium Tech Rentals in the Capital",
        description:
            "Rent laptops, MacBooks, DSLR cameras, AV equipment, and server infrastructure in Delhi & NCR. Same-day and next-day delivery available. Trusted by 5,000+ businesses in Delhi.",
        address: "Unit No. 06, Jumbo Industrial Estate, Dr Jha Marg, Okhla Phase III, New Delhi - 110020",
        phone: "9870533392",
        email: "itsupport@indianrenters.com",
        pincode: "110020",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.5!2d77.2726!3d28.538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMyJzE2LjgiTiA3N8KwMTYnMjEuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
    },
    mumbai: {
        name: "Mumbai",
        state: "Maharashtra",
        tagline: "Tech Rentals for India's Financial Capital",
        description:
            "Rent laptops, servers, cameras, and AV gear in Mumbai with fast city-wide delivery. Serving startups, enterprises, events, and film productions across Mumbai, Thane & Navi Mumbai.",
        address: "117 Sai Dham Building, MIDC Road No. 7, Andheri East, Mumbai, Maharashtra - 400093",
        phone: "9987534668",
        email: "support@indianrenters.com",
        pincode: "400093",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5!2d72.8486!3d19.1208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzE1LjEiTiA3MsKwNTEnMDkuOCJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&q=80",
    },
    bangalore: {
        name: "Bangalore",
        state: "Karnataka",
        tagline: "The Silicon Valley's Go-To Rental Partner",
        description:
            "Rent MacBooks, AI workstations, cameras, and AV equipment in Bangalore. Fast delivery to Whitefield, Koramangala, HSR Layout, Indiranagar, and Electronic City.",
        address: "#1473, First Floor, 17th A Main Road, 2nd Phase, JP Nagar, Bangalore - 560078",
        phone: "9999501792",
        email: "sale-bangalore@indianrenters.com",
        pincode: "560078",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5!2d77.5946!3d12.9082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzI5LjUiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
    },
    hyderabad: {
        name: "Hyderabad",
        state: "Telangana",
        tagline: "Tech Rentals for HITEC City & Beyond",
        description:
            "Rent IT equipment, servers, laptops, and AV gear in Hyderabad. Fast delivery across HITEC City, Gachibowli, Banjara Hills, and Secunderabad.",
        address: "11-6-837/C, Red Hills, Lakdi Ka Pul, Hyderabad, Telangana - 500004",
        phone: "8510842741",
        email: "hyd-support@indianrenters.com",
        pincode: "500004",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.4744!3d17.4139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzUwLjEiTiA3OMKwMjgnMjcuOCJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&q=80",
    },
    noida: {
        name: "Noida",
        state: "Uttar Pradesh",
        tagline: "Fast Tech Rentals Across Noida & Greater Noida",
        description:
            "Rent laptops, workstations, cameras, and office equipment in Noida, Sector 62, and Greater Noida. Same-day delivery for businesses in the NCR region.",
        address: "L8-802, The Iconic Corenthum, Tower C, Sector 62, Noida, UP - 201301",
        phone: "9122234563",
        email: "info@indianrenters.com",
        pincode: "201301",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5!2d77.3710!3d28.6261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzMzLjkiTiA3N8KwMjInMTUuNiJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1680374657222-df1b21f26a6e?w=1200&q=80",
    },
    pune: {
        name: "Pune",
        state: "Maharashtra",
        tagline: "Pune's Premier Equipment Rental Service",
        description:
            "Rent MacBooks, cameras, AV equipment, and IT hardware in Pune. Delivery across Kothrud, Hinjewadi, Magarpatta, Viman Nagar, and Hadapsar.",
        address: "Office No. 3, 1st Floor, Kajale Heights, Paud Phata, Karve Road, Kothrud, Pune - 411038",
        phone: "9922800442",
        email: "pune@indianrenters.com",
        pincode: "411038",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5!2d73.8153!3d18.4937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI5JzM3LjMiTiA3M8KwNDgnNTUuMSJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    },
    chennai: {
        name: "Chennai",
        state: "Tamil Nadu",
        tagline: "Chennai's Trusted Rental Partner for Tech & AV",
        description:
            "Rent laptops, DSLR cameras, AV systems, and office equipment in Chennai. Fast delivery across T. Nagar, Anna Salai, OMR, and Ambattur Industrial Estate.",
        address: "No. 12, Nungambakkam High Road, Chennai, Tamil Nadu - 600034",
        phone: "9870533392",
        email: "chennai@indianrenters.com",
        pincode: "600034",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5!2d80.2545!3d13.0601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM0JzIyLjkiTiA4MMKwMTUnMTYuMiJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
    },
    kolkata: {
        name: "Kolkata",
        state: "West Bengal",
        tagline: "East India's Leading Tech Rental Service",
        description:
            "Rent laptops, AV equipment, cameras, and servers in Kolkata. Serving Salt Lake Sector V, Park Street, Esplanade, and New Town tech corridors.",
        address: "Plot No. 5, Block BP, Sector V, Salt Lake, Kolkata, West Bengal - 700091",
        phone: "9870533392",
        email: "kolkata@indianrenters.com",
        pincode: "700091",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.5!2d88.4265!3d22.5763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzM0LjciTiA4OMKwMjUnMzUuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
        image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&q=80",
    },
};

const SERVICES = [
    { title: "Laptop Rentals", icon: "💻", href: "/category/it-products", desc: "MacBooks, Dell XPS, Lenovo ThinkPad and more" },
    { title: "Camera Rentals", icon: "📷", href: "/category/dslr", desc: "DSLR, mirrorless, and professional video cameras" },
    { title: "AV Equipment", icon: "🎬", href: "/category/av-products", desc: "Projectors, LED walls, PA systems, and mixers" },
    { title: "Apple Products", icon: "🍎", href: "/category/apple", desc: "MacBook Pro, MacBook Air, iPad Pro and iMac" },
    { title: "Office Equipment", icon: "🖨️", href: "/category/office-equipment", desc: "Printers, scanners, and office hardware" },
    { title: "Server Infrastructure", icon: "🖥️", href: "/products", desc: "Rack servers, NAS units, and networking gear" },
];

// Generate static params for the known cities
export function generateStaticParams() {
    return Object.keys(CITIES).map((city) => ({ city }));
}

// Generate per-city metadata
export async function generateMetadata({ params }) {
    const { city } = await params;
    const data = CITIES[city.toLowerCase()];
    if (!data) return {};
    return {
        title: `Tech Rentals in ${data.name} | ${SITE_NAME}`,
        description: data.description,
        alternates: { canonical: `${SITE_URL}/locations/${city}` },
        openGraph: {
            title: `Tech Rentals in ${data.name} | ${SITE_NAME}`,
            description: data.description,
            url: `${SITE_URL}/locations/${city}`,
            images: [{ url: data.image, width: 1200, height: 630, alt: `Tech Rentals in ${data.name}` }],
        },
    };
}

export default async function LocationPage({ params }) {
    const { city } = await params;
    const data = CITIES[city.toLowerCase()];

    if (!data) return notFound();

    // LocalBusiness structured data for better local SEO
    const localBusinessJsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `${SITE_NAME} — ${data.name}`,
        description: data.description,
        url: `${SITE_URL}/locations/${city}`,
        telephone: `+91-${data.phone}`,
        email: data.email,
        address: {
            "@type": "PostalAddress",
            streetAddress: data.address,
            addressLocality: data.name,
            addressRegion: data.state,
            postalCode: data.pincode,
            addressCountry: "IN",
        },
        image: data.image,
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "10:00",
                closes: "19:30",
            },
        ],
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
            />

            <div className="font-sans text-gray-800 pb-20">
                {/* ── Hero Banner ── */}
                <section className="w-full max-w-[1440px] mx-auto mt-5 md:mt-8 mb-8 md:mb-16">
                    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                        <div className="w-full h-[220px] md:h-[450px] relative bg-gray-200 overflow-hidden rounded-2xl md:rounded-3xl">
                            <Image
                                src={data.image}
                                alt={`Tech equipment rentals in ${data.name}`}
                                fill
                                className="object-cover object-center brightness-75"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <p className="text-amber-300 text-xs md:text-sm font-semibold uppercase tracking-widest mb-2">
                                    📍 {data.name}, {data.state}
                                </p>
                                <h1 className="text-white text-2xl md:text-6xl font-bold drop-shadow-lg font-sans leading-tight max-w-3xl">
                                    Tech Rentals in {data.name}
                                </h1>
                                <p className="text-gray-200 text-sm md:text-xl mt-3 md:mt-4 max-w-2xl leading-relaxed">
                                    {data.tagline}
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <Link
                                        href="/products"
                                        className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
                                    >
                                        Browse Products
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2.5 rounded-full text-sm border border-white/30 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                                    >
                                        Get a Quote
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── About this Location ── */}
                <section className="max-w-[1200px] mx-auto px-5 md:px-8 mb-12 md:mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                Rent Tech Equipment in {data.name}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                                {data.description}
                            </p>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                                IndianRenters has been India's most trusted rental partner since 1992. In {data.name}, we
                                deliver enterprise-grade equipment to your doorstep — clean, tested, and ready to use.
                                Tenures from 1 month to 12 months, with easy extensions.
                            </p>
                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                {[
                                    { label: "Same-Day Delivery", icon: "🚀" },
                                    { label: "Fully Insured Gear", icon: "🛡️" },
                                    { label: "24/7 Support", icon: "📞" },
                                ].map((b) => (
                                    <div key={b.label} className="flex flex-col items-center text-center bg-amber-50 border border-amber-100 rounded-2xl p-3">
                                        <span className="text-2xl mb-1">{b.icon}</span>
                                        <p className="text-xs font-semibold text-gray-700">{b.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                📍 Our {data.name} Office
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <span className="mt-0.5 text-lg shrink-0">🏢</span>
                                    <p className="text-gray-600 leading-relaxed">{data.address}</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-lg shrink-0">📞</span>
                                    <a href={`tel:+91${data.phone}`} className="text-blue-600 font-semibold hover:underline">
                                        +91 {data.phone}
                                    </a>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-lg shrink-0">✉️</span>
                                    <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline break-all">
                                        {data.email}
                                    </a>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-lg shrink-0">🕐</span>
                                    <p className="text-gray-600">Mon – Sat: 10:00 AM – 7:30 PM</p>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-3">
                                <Link
                                    href="/contact"
                                    className="flex-1 bg-black text-white text-center font-bold text-sm py-3 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Get a Free Quote
                                </Link>
                                <a
                                    href={`tel:+91${data.phone}`}
                                    className="flex-1 border-2 border-black text-black text-center font-bold text-sm py-3 rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Services ── */}
                <section className="bg-gray-50 py-12 md:py-20 mb-12 md:mb-20">
                    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                            What We Rent in {data.name}
                        </h2>
                        <p className="text-gray-500 text-center text-sm md:text-base mb-10">
                            100+ products available for monthly rental — delivered to your door.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {SERVICES.map((s) => (
                                <Link
                                    key={s.title}
                                    href={s.href}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-amber-200 transition-all group"
                                >
                                    <div className="text-3xl mb-3">{s.icon}</div>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 group-hover:text-amber-600 transition-colors">
                                        {s.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Other Locations ── */}
                <section className="max-w-[1200px] mx-auto px-5 md:px-8 mb-12">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
                        We Also Serve These Cities
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(CITIES)
                            .filter(([slug]) => slug !== city.toLowerCase())
                            .map(([slug, cityData]) => (
                                <Link
                                    key={slug}
                                    href={`/locations/${slug}`}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all"
                                >
                                    📍 {cityData.name}
                                </Link>
                            ))}
                    </div>
                </section>
            </div>
        </>
    );
}
