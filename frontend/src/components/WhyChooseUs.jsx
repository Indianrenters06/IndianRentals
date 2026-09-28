"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import proofStyles from './WhyChooseUs.module.css';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

import { API } from '@/services/apiConfig';

const WhyChooseUs = ({ cmsData = null, overrideBg, overridePaddingTop, overridePaddingBottom }) => {
    const sectionRef = useRef(null);
    const [fetchedCms, setFetchedCms] = useState(null);
    const [loading, setLoading] = useState(!cmsData);
    const cms = cmsData || fetchedCms;

    useEffect(() => {
        if (cmsData) return;
        fetch(`${API}/api/cms/homepage`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { setFetchedCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [cmsData]);

    useEffect(() => {
        if (loading || cms?.whyChooseUsEnabled === false || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let disposed = false;
        let context;
        const observer = new IntersectionObserver(async ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const { gsap } = await import('gsap');
            if (disposed || !sectionRef.current) return;
            context = gsap.context(() => {
                gsap.from('[data-proof-value]', { y: 14, duration: .65, stagger: .08, ease: 'expo.out' });
                gsap.from('[data-proof-image]', { scale: 1.045, duration: 1.1, ease: 'expo.out' });
            }, sectionRef);
        }, { threshold: .18 });
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => { disposed = true; observer.disconnect(); context?.revert(); };
    }, [loading, cms?.whyChooseUsEnabled]);

    // Handle both Homepage and About page field mappings
    const title = (cmsData ? (cms?.aboutWhyTitle || cms?.whyChooseUsTitle) : cms?.whyChooseUsTitle) || "Why Choose Us?";
    const subtitle = (cmsData ? (cms?.aboutWhyText || cms?.whyChooseUsSubtitle) : cms?.whyChooseUsSubtitle) || "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.";
    const configuredImage = cmsData ? (cms?.aboutWhyImage || cms?.whyChooseUsImage) : cms?.whyChooseUsImage;
    const legacyHomepageImage = "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg";
    const usesDefaultImage = !cmsData && (!configuredImage || configuredImage === legacyHomepageImage || configuredImage === "/images/rental-equipment-studio.png");
    const image = usesDefaultImage
        ? "/images/why-choose-creator.png"
        : configuredImage || legacyHomepageImage;

    const imageAlt = usesDefaultImage ? "Creative professional working on a laptop with camera equipment nearby" : title;

    const stats = [
        { label: (cmsData ? cms?.aboutWhyStat1Label : cms?.statsDevicesLabel) || "Orders Served", value: (cmsData ? cms?.aboutWhyStat1Value : cms?.statsDevices) || "90k+" },
        { label: (cmsData ? cms?.aboutWhyStat2Label : cms?.statsCustomersLabel) || "Happy Customers", value: (cmsData ? cms?.aboutWhyStat2Value : cms?.statsCustomers) || "30k+" },
        { label: (cmsData ? cms?.aboutWhyStat3Label : cms?.statsCitiesLabel) || "Products Available", value: (cmsData ? cms?.aboutWhyStat3Value : cms?.statsCities) || "401+" },
    ];

    if (!cmsData && loading) return <div className="h-96 w-full animate-pulse bg-slate-50 rounded-3xl" />;
    if (cms && cms.whyChooseUsEnabled === false) return null;

    return (
        <section ref={sectionRef} className={proofStyles.section} aria-labelledby="why-choose-heading"
            style={{ background: overrideBg, paddingTop: overridePaddingTop, paddingBottom: overridePaddingBottom }}>
            <div className={proofStyles.container}>
                <h2 id="why-choose-heading" className={proofStyles.title}>{title}</h2>
                <dl className={proofStyles.stats}>
                    {stats.map((stat, index) => (
                        <div className={proofStyles.stat} key={index}>
                            <dt>{stat.label}</dt>
                            <dd data-proof-value>{stat.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className={proofStyles.story}>
                    <div className={proofStyles.imageFrame}>
                        <div className={proofStyles.imageClip}>
                            <Image src={image} alt={imageAlt} fill data-proof-image className={proofStyles.image}
                                sizes="(min-width: 1260px) 640px, (min-width: 768px) 55vw, calc(100vw - 52px)" />
                        </div>
                    </div>
                    <div className={proofStyles.copy}>
                        <p>{subtitle}</p>
                        <Link href="/products" className={proofStyles.action}>
                            Explore rentals <ArrowUpRightIcon width={20} height={20} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
