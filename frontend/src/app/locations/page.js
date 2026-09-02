import Link from "next/link";
import Image from "next/image";
import { SITE_URL, SITE_NAME } from "@/config/site";

export const metadata = {
    title: `Rental Locations Across India | ${SITE_NAME}`,
    description:
        "IndianRenters delivers tech equipment rentals — laptops, MacBooks, cameras, AV gear, and servers — across 8+ major Indian cities. Find your nearest location.",
    alternates: { canonical: `${SITE_URL}/locations` },
};

const CITIES = [
    { slug: "delhi",     name: "Delhi",     state: "Delhi",         image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80" },
    { slug: "mumbai",    name: "Mumbai",    state: "Maharashtra",   image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80" },
    { slug: "bangalore", name: "Bangalore", state: "Karnataka",     image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80" },
    { slug: "hyderabad", name: "Hyderabad", state: "Telangana",     image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80" },
    { slug: "noida",     name: "Noida",     state: "Uttar Pradesh", image: "https://images.unsplash.com/photo-1680374657222-df1b21f26a6e?w=600&q=80" },
    { slug: "pune",      name: "Pune",      state: "Maharashtra",   image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80" },
    { slug: "chennai",   name: "Chennai",   state: "Tamil Nadu",    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80" },
    { slug: "kolkata",   name: "Kolkata",   state: "West Bengal",   image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80" },
];

export default function LocationsPage() {
    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16 md:py-24 px-5">
                <div className="max-w-[1200px] mx-auto text-center">
                    <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">Pan-India Coverage</p>
                    <h1 className="text-3xl md:text-6xl font-bold mb-4 leading-tight">
                        We Deliver Across India
                    </h1>
                    <p className="text-gray-300 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Find your nearest IndianRenters service location and get tech equipment delivered to your door — 
                        same-day in major metro cities.
                    </p>
                </div>
            </section>

            {/* City Grid */}
            <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {CITIES.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/locations/${city.slug}`}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-200 block"
                        >
                            <Image
                                src={city.image}
                                alt={`Tech rentals in ${city.name}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110 brightness-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h2 className="text-white font-bold text-lg leading-tight">{city.name}</h2>
                                <p className="text-gray-300 text-xs">{city.state}</p>
                            </div>
                            <div className="absolute top-3 right-3 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                View →
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-[1200px] mx-auto px-5 md:px-8">
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                        Don't see your city?
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base mb-6 max-w-lg mx-auto">
                        We're expanding rapidly. Contact us and we'll do our best to arrange delivery to your location.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
}
