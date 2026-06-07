"use client";
import React, { useState, useEffect } from 'react';
import { PiCaretDown, PiCaretUp } from 'react-icons/pi';

const faqs = [
    {
        question: "What is the minimum rental period?",
        answer: "The minimum rental period for our products is 1 month. You can choose from flexible tenures of 1, 3, 6, or 12 months."
    },
    {
        question: "Is maintenance included?",
        answer: "Yes, basic maintenance and support are included throughout your rental period. If you encounter any technical issues, simply reach out to our support team."
    },
    {
        question: "What if I want to extend my rental?",
        answer: "Extending your rental is easy! You can manage your rental period directly from your account dashboard or contact our customer service team before your current tenure ends."
    },
    {
        question: "What happens if the product gets damaged?",
        answer: "We understand accidents happen. Our rental agreement outlines policies for minor and major damages. We encourage you to review our full terms and conditions for details, or contact us for clarification."
    }
];

import { API } from '@/services/apiConfig';

const FaqSection = ({ cmsData, limit, pageName }) => {
    const [cms, setCms] = useState(cmsData || null);
    const [loading, setLoading] = useState(!cmsData);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        if (cmsData) {
            setCms(cmsData);
            setLoading(false);
            return;
        }

        if (pageName === 'homepage') {
            window.fetch(`${API}/api/cms/homepage?t=${Date.now()}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    setCms(data);
                    if (data && data.homepageFaqEnabled === false) setEnabled(false);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
            return;
        }

        const fetches = [
            window.fetch(`${API}/api/cms/faq?t=${Date.now()}`).then(res => res.ok ? res.json() : null)
        ];

        if (pageName) {
            fetches.push(
                window.fetch(`${API}/api/cms/${pageName}?t=${Date.now()}`).then(res => res.ok ? res.json() : null)
            );
        }

        Promise.all(fetches)
            .then(([faqData, pageData]) => {
                setCms(faqData);
                if (pageData && pageData.faqSectionEnabled === false) {
                    setEnabled(false);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [cmsData, pageName]);

    const isHomepage = pageName === 'homepage';
    let displayFaqs;
    if (isHomepage) {
        displayFaqs = cms?.homepageFaqItems && cms.homepageFaqItems.length > 0 ? cms.homepageFaqItems : faqs;
    } else {
        displayFaqs = cms?.faqItems && cms.faqItems.length > 0 ? cms.faqItems : faqs;
    }
    if (limit) {
        displayFaqs = displayFaqs.slice(0, limit);
    }
    const [activeIndices, setActiveIndices] = useState([]);

    useEffect(() => {
        // Update active indices when displayFaqs changes
        setActiveIndices(displayFaqs.map((_, i) => i));
    }, [displayFaqs.length]);

    const title = isHomepage
        ? (cms?.homepageFaqTitle || "Frequently Asked Questions")
        : (cms?.faqTitle || "Everything you need to know about renting with IndianRenters.com");
    const subtitle = isHomepage
        ? (cms?.homepageFaqSubtitle || "")
        : (cms?.faqSubtitle || "Welcome to FAQ!");

    const toggleFaq = (index) => {
        if (activeIndices.includes(index)) {
            setActiveIndices(activeIndices.filter(i => i !== index));
        } else {
            setActiveIndices([...activeIndices, index]);
        }
    };

    if (loading) return <div className="h-96 w-full animate-pulse bg-slate-50 rounded-3xl" />;
    if (!enabled) return null;

    return (
        <section 
            className="w-full border-t border-gray-100 bg-white"
            style={{
                minHeight: '568px',
                paddingTop: '48px',
                paddingBottom: '48px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <div
                className="max-w-[1200px] mx-auto px-5 sm:px-6 w-full flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-[100px]"
            >
                {/* Left Column */}
                <div
                    className="w-full lg:max-w-[442px] flex flex-col gap-[20px] lg:min-h-[190px]"
                >
                    {/* Heading — on mobile the eyebrow (subtitle) sits above the title */}
                    <h2
                        className="order-2 md:order-1 m-0 font-semibold text-[#333] tracking-[-0.02em] max-w-[442px] text-[25px] leading-[31px] md:text-[36px] md:leading-[45px]"
                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <span
                            className="order-1 md:order-2 block text-[#333] tracking-[-0.02em] max-w-[442px] font-semibold md:font-medium text-[20px] leading-[26px] md:text-[36px] md:leading-[45px]"
                            style={{ fontFamily: "'Mona Sans', sans-serif" }}
                        >
                            {subtitle}
                        </span>
                    )}
                </div>

                {/* Right Column - Accordion */}
                <div
                    className="w-full lg:flex-1 lg:max-w-[758px] lg:min-h-[568px] border-b border-[hsla(0,0%,69%,1)]"
                >
                    <div className="space-y-0">
                        {displayFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`w-full overflow-hidden border-t border-[hsla(0,0%,69%,1)] ${activeIndices.includes(index) ? 'h-auto md:min-h-[142px]' : 'h-auto md:h-[72px]'}`}
                            >
                                <button
                                    className="w-full flex items-center justify-between text-left focus:outline-none group gap-[24px] py-2 md:py-5 md:h-[72px]"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span
                                        className="group-hover:text-blue-600 transition-colors font-bold text-[#333] tracking-[0.01em] max-w-[702px] text-sm md:text-[18px] leading-[20px] md:leading-[25px]"
                                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                                    >
                                        {faq.question}
                                    </span>
                                    <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors text-[20px] md:text-[24px]">
                                        {activeIndices.includes(index) ? (
                                            <PiCaretUp />
                                        ) : (
                                            <PiCaretDown />
                                        )}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndices.includes(index) ? 'max-h-[500px] opacity-100 pb-3 md:pb-6' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p
                                        className="m-0 font-normal text-[hsla(0,0%,33%,1)] tracking-[0.01em] max-w-[758px] text-xs md:text-[14px] leading-[18px] md:leading-[23px]"
                                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                                    >
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
