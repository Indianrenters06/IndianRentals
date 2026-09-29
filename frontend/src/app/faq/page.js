'use client';
import { cmsUrl } from '@/lib/cmsPreview';

import React, { useEffect, useState } from 'react';
import PageBanner from '@/components/PageBanner';
import FaqSection from '../../components/FaqSection';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FaqPage() {
    const [cms, setCms] = useState(null);
    useEffect(() => {
        window.fetch(cmsUrl('faq'))
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCms(d); })
            .catch(() => {});
    }, []);

    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776716131/e92cf0b55a28cc573a6ad7b73d746dd47431bb2e_1_jlph2i.png';
    const bannerTitle = cms?.bannerTitle || 'FAQs';

    return (
        <div className="font-sans text-gray-800">
            <PageBanner image={bannerImage} title={bannerTitle} showText={cms?.bannerShowText !== false} background={cms?.bannerBackground} className="mb-8 md:mb-16" />
            <FaqSection cmsData={cms} pageName="faq" />
        </div>
    );
}
