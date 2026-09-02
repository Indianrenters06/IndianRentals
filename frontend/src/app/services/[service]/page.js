import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/config/site";

// ── Service Data ─────────────────────────────────────────────────────────────
const SERVICES = {
    "laptop-rental": {
        title: "Laptop Rental in India",
        headline: "Rent Laptops for Business, Events & Education",
        description:
            "Rent high-performance laptops in India — Dell, HP, Lenovo, Asus, and more — on flexible monthly plans. No deposit hassle, free delivery, clean certified devices.",
        longDesc: `Renting a laptop is smarter than buying for short-term projects, events, or when your team scales fast. IndianRenters offers a wide range of business laptops including Dell XPS, Lenovo ThinkPad, HP EliteBook, and Asus ZenBook. Every device is factory-reset, tested, and delivered same-day in major cities.

All plans include free tech support, insurance against accidental damage, and free replacement if the device malfunctions.`,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
        categoryHref: "/category/it-products",
        features: ["1–12 month flexible terms", "Free delivery & pickup", "Certified & tested devices", "Same-day replacement guarantee", "GST invoices included", "10,000+ devices in stock"],
        faqs: [
            { q: "What laptops are available for rent?", a: "We stock Dell, HP, Lenovo, Asus, Microsoft Surface, and more — across i5/i7/i9 configurations and various RAM/SSD combinations." },
            { q: "What's the minimum rental period?", a: "Our minimum rental period is 1 month. We offer 1, 3, 6, and 12-month plans, with discounts for longer commitments." },
            { q: "Do you deliver across India?", a: "Yes. We deliver across 8+ major cities including Delhi, Mumbai, Bangalore, Hyderabad, Pune, Noida, Chennai, and Kolkata." },
        ],
        keywords: ["laptop rental", "laptop on rent", "laptop hire India", "business laptop rental"],
    },
    "macbook-rental": {
        title: "MacBook Rental in India",
        headline: "Rent MacBook Pro & MacBook Air",
        description:
            "Rent Apple MacBook Pro (M1/M2/M3/M4) and MacBook Air on flexible monthly plans. Perfect for creative professionals, developers, and video editors. Free delivery across India.",
        longDesc: `Apple MacBooks are the gold standard for creative professionals, software developers, and data scientists. Instead of investing ₹1–3 lakhs in a MacBook, rent one for a fraction of the monthly cost and stay updated with the latest Apple Silicon without the depreciation hit.

IndianRenters stocks MacBook Air (M2/M3), MacBook Pro 14" and 16" (M3/M4), and older Intel models — all with macOS freshly installed, verified clean, and delivered in original packaging.`,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
        categoryHref: "/category/apple",
        features: ["M1 to M4 Apple Silicon models", "macOS pre-configured", "Accessories included", "1–12 month plans", "Free tech support", "GST invoice included"],
        faqs: [
            { q: "Which MacBook models are available?", a: "MacBook Air M2/M3 and MacBook Pro 14\"/16\" M3/M4 are currently most available. Older Intel models also in stock for budget needs." },
            { q: "Can I get a MacBook with specific software installed?", a: "Yes, we can pre-install software as per your requirement (e.g., Adobe Creative Cloud, Xcode). Contact us for custom configurations." },
            { q: "What happens if the MacBook is damaged?", a: "Our rental plans include coverage for accidental damage. We'll arrange a same-day replacement at no extra charge for covered incidents." },
        ],
        keywords: ["macbook rental", "macbook on rent", "rent macbook pro", "apple laptop rental India"],
    },
    "camera-rental": {
        title: "Camera & DSLR Rental in India",
        headline: "Rent Professional Cameras for Events & Production",
        description:
            "Rent DSLR, mirrorless, and cinema cameras in India — Canon, Sony, Nikon, and RED. Perfect for weddings, corporate shoots, film productions, and YouTube content creators.",
        longDesc: `Professional cameras are one of the most rented pieces of equipment in India's growing creator economy. Whether you're shooting a feature film, corporate video, wedding, or product catalog, IndianRenters has the right camera for your project.

We stock Canon EOS R5/R6, Sony A7 III/A7 IV, Nikon Z6/Z7, GoPro, DJI action cameras, and cinema cameras like the Blackmagic Pocket Cinema Camera.`,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
        categoryHref: "/category/dslr",
        features: ["DSLR, mirrorless & cinema cameras", "Lenses available as add-ons", "Batteries, cards & bags included", "Daily/weekly/monthly plans", "Delivered & collected from site", "Insurance available"],
        faqs: [
            { q: "Do you rent camera lenses separately?", a: "Yes, we rent lenses as add-ons to camera rentals. Canon EF/RF, Sony FE, and Nikon Z mount lenses are available." },
            { q: "Is a deposit required to rent a camera?", a: "Yes, a refundable security deposit is required. The deposit amount depends on the camera value." },
            { q: "Can I rent a camera for just a day?", a: "Yes, we offer daily, weekly, and monthly rental plans for cameras. Contact us for daily rental pricing." },
        ],
        keywords: ["camera rental", "DSLR rental India", "rent camera for shoot", "professional camera hire"],
    },
    "av-equipment-rental": {
        title: "AV Equipment Rental in India",
        headline: "Rent Audio-Visual Equipment for Events & Conferences",
        description:
            "Rent projectors, LED walls, sound systems, microphones, and lighting rigs for conferences, corporate events, weddings, and exhibitions across India.",
        longDesc: `Audio-Visual equipment is essential for any professional event — from corporate townhalls to product launches, weddings to trade shows. Owning AV gear is expensive and quickly becomes outdated. Renting gives you access to the latest professional equipment without the capital expenditure.

IndianRenters offers a comprehensive range of AV gear including laser projectors, LED display walls, PA sound systems, wireless microphones, lighting rigs, and complete event setups managed by our technicians.`,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
        categoryHref: "/category/av-products",
        features: ["Projectors up to 20,000 lumens", "LED walls in all sizes", "PA systems & mixers", "Wireless microphones", "Stage & ambient lighting", "Setup & support staff available"],
        faqs: [
            { q: "Do you provide setup and support at the event venue?", a: "Yes, for larger AV setups, we provide trained technicians who set up, operate, and troubleshoot the equipment at your venue." },
            { q: "What's the minimum order for AV equipment?", a: "There's no strict minimum. You can rent a single projector or a full event AV package. Contact us for a customized quote." },
            { q: "How far in advance should I book?", a: "We recommend booking at least 3–5 days in advance for standard orders. For large events, 2–3 weeks advance booking is preferred." },
        ],
        keywords: ["AV equipment rental", "projector rental", "LED wall rental", "event equipment hire India"],
    },
    "server-rental": {
        title: "Server & IT Infrastructure Rental in India",
        headline: "Rent Servers, NAS, and Networking Equipment",
        description:
            "Rent rack servers, NAS storage, network switches, and enterprise IT infrastructure in India. Ideal for data centers, temporary capacity, disaster recovery, and project-based IT setups.",
        longDesc: `Enterprise IT infrastructure is one of the highest-capital expenses for any organization. Renting servers and networking equipment gives you the capacity you need without the 3–5 year depreciation cycle.

IndianRenters provides Dell PowerEdge, HP ProLiant, Lenovo ThinkSystem servers, Synology/QNAP NAS units, and Cisco/TP-Link networking equipment. All equipment is enterprise-grade, rack-ready, and delivered pre-configured per your spec.`,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
        categoryHref: "/products",
        features: ["Dell, HP, Lenovo servers", "NAS & SAN storage", "Networking gear", "Pre-configured delivery", "Rack installation support", "Monthly to annual plans"],
        faqs: [
            { q: "Can you deliver and install servers at our data center?", a: "Yes, we offer installation services. Our engineers can rack-mount and configure the servers at your data center." },
            { q: "What server configurations are available?", a: "From single-socket Xeon E servers to dual-socket Gold configurations with up to 3TB RAM. Custom configurations are available on request." },
            { q: "Is 24/7 support available for rented servers?", a: "Yes, all server rentals include our 24/7 hardware support SLA with next-business-day replacement for critical failures." },
        ],
        keywords: ["server rental India", "rack server hire", "IT infrastructure rental", "data center equipment rental"],
    },
    "office-equipment-rental": {
        title: "Office Equipment Rental in India",
        headline: "Rent Printers, Scanners & Office Hardware",
        description:
            "Rent office equipment — multi-function printers, document scanners, shredders, and workstations — for temporary offices, projects, and expanding teams.",
        longDesc: `Setting up a temporary office, expanding a team, or running a project site? Instead of buying office equipment that'll sit idle once the project ends, rent it. IndianRenters offers flexible office equipment rentals for businesses of all sizes.

We stock multifunction laser printers (HP, Canon, Ricoh), high-speed document scanners, paper shredders, and office workstations. Equipment is delivered clean, tested, and ready to plug in.`,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        categoryHref: "/category/office-equipment",
        features: ["MFP printers (A3/A4)", "High-speed document scanners", "Shredders & binding machines", "Office workstations", "Monthly toner/ink plans", "Free setup & delivery"],
        faqs: [
            { q: "Do you provide toner/ink as part of the rental?", a: "We offer optional toner supply plans alongside printer rentals. Contact us for details on per-page pricing." },
            { q: "Can I rent equipment for a single event or pop-up?", a: "Yes, we offer short-term rentals (1 week minimum) for temporary setups like pop-up offices, exhibition booths, and project sites." },
            { q: "What brands do you carry for printers?", a: "We carry HP, Canon, Ricoh, Xerox, and Konica Minolta multifunction printers across mono and color options." },
        ],
        keywords: ["office equipment rental", "printer rental India", "scanner hire", "office hardware rent"],
    },
};

export function generateStaticParams() {
    return Object.keys(SERVICES).map((service) => ({ service }));
}

export async function generateMetadata({ params }) {
    const { service } = await params;
    const data = SERVICES[service];
    if (!data) return {};
    return {
        title: `${data.title} | ${SITE_NAME}`,
        description: data.description,
        keywords: data.keywords,
        alternates: { canonical: `${SITE_URL}/services/${service}` },
        openGraph: {
            title: `${data.title} | ${SITE_NAME}`,
            description: data.description,
            url: `${SITE_URL}/services/${service}`,
            images: [{ url: data.image, width: 1200, height: 630, alt: data.title }],
        },
    };
}

export default async function ServicePage({ params }) {
    const { service } = await params;
    const data = SERVICES[service];
    if (!data) return notFound();

    const serviceJsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: data.title,
        description: data.description,
        provider: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
        areaServed: {
            "@type": "Country",
            name: "India",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />

            <div className="font-sans text-gray-800 pb-20">
                {/* Hero */}
                <section className="w-full max-w-[1440px] mx-auto mt-5 md:mt-8 mb-8 md:mb-16">
                    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                        <div className="w-full h-[220px] md:h-[480px] relative bg-gray-200 overflow-hidden rounded-2xl md:rounded-3xl">
                            <Image
                                src={data.image}
                                alt={data.title}
                                fill
                                className="object-cover brightness-75"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <h1 className="text-white text-2xl md:text-6xl font-bold drop-shadow-lg leading-tight max-w-4xl mb-3">
                                    {data.headline}
                                </h1>
                                <p className="text-gray-200 text-sm md:text-lg max-w-2xl leading-relaxed">
                                    {data.description}
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <Link
                                        href={data.categoryHref}
                                        className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
                                    >
                                        Browse Products
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2.5 rounded-full text-sm border border-white/30 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                                    >
                                        Get a Free Quote
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                    {/* Description */}
                    <section className="mb-12 md:mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                                    {data.title}
                                </h2>
                                {data.longDesc.split("\n\n").map((para, i) => (
                                    <p key={i} className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Features card */}
                            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 sticky top-24">
                                <h3 className="font-bold text-gray-900 text-lg mb-4">What's Included</h3>
                                <ul className="space-y-3">
                                    {data.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                                            <span className="text-green-500 text-base shrink-0">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <Link
                                        href="/contact"
                                        className="block w-full bg-black text-white text-center font-bold py-3 rounded-full hover:bg-gray-800 transition-colors text-sm"
                                    >
                                        Get a Free Quote
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQs */}
                    <section className="mb-12 md:mb-16">
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {data.faqs.map((faq, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">
                                        {faq.q}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Other Services */}
                    <section>
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
                            Explore Other Services
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(SERVICES)
                                .filter(([slug]) => slug !== service)
                                .map(([slug, s]) => (
                                    <Link
                                        key={slug}
                                        href={`/services/${slug}`}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all"
                                    >
                                        {s.title.split(" in ")[0]}
                                    </Link>
                                ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
