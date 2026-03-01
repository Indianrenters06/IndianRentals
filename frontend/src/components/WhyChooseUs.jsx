import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const WhyChooseUs = () => {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/cms/homepage`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { setCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const title = cms?.whyChooseUsTitle || "Why Choose Us?";
    const subtitle = cms?.whyChooseUsSubtitle || "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.";
    const image = cms?.whyChooseUsImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg";
    const stats = [
        { label: "Devices in Stock", value: cms?.statsDevices || "90k+" },
        { label: "Happy Customers", value: cms?.statsCustomers || "30k+" },
        { label: "Cities Covered", value: cms?.statsCities || "401+" },
    ];

    if (loading) return <div className="h-96 w-full animate-pulse bg-slate-50 rounded-3xl" />;

    return (
        <section className="py-10 md:py-20 bg-[#FFFDF7] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">

                    {/* Text Content - always first on mobile */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-semibold font-manrope text-gray-900">
                                {title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                                {subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-2">
                            {stats.map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{s.value}</h3>
                                    <p className="text-xs md:text-sm font-medium text-gray-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Content - below text on mobile, right side on desktop */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
