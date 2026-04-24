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

const FaqSection = ({ cmsData }) => {
    const [cms, setCms] = useState(cmsData || null);
    const [loading, setLoading] = useState(!cmsData);

    useEffect(() => {
        if (cmsData) {
            setCms(cmsData);
            setLoading(false);
            return;
        }
        window.fetch(`${API}/api/cms/faq?t=${Date.now()}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { setCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [cmsData]);

    const displayFaqs = cms?.faqItems && cms.faqItems.length > 0 ? cms.faqItems : faqs;
    const [activeIndices, setActiveIndices] = useState(faqs.map((_, i) => i)); // Default to static length initially or handle dynamic

    useEffect(() => {
        // Update active indices when displayFaqs changes
        setActiveIndices(displayFaqs.map((_, i) => i));
    }, [displayFaqs.length]);

    const title = cms?.faqTitle || "Everything you need to know about renting with IndianRenters.com";
    const subtitle = cms?.faqSubtitle || "Welcome to FAQ!";

    const toggleFaq = (index) => {
        if (activeIndices.includes(index)) {
            setActiveIndices(activeIndices.filter(i => i !== index));
        } else {
            setActiveIndices([...activeIndices, index]);
        }
    };

    if (loading) return <div className="h-96 w-full animate-pulse bg-slate-50 rounded-3xl" />;

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
                className="max-w-[1200px] mx-auto px-4 md:px-8 w-full flex flex-col lg:flex-row justify-between items-start gap-[100px]"
            >
                {/* Left Column */}
                <div 
                    className="w-full lg:max-w-[442px] flex flex-col gap-[20px]"
                    style={{
                        minHeight: '190px'
                    }}
                >
                    <h2 
                        style={{
                            width: 'auto',
                            maxWidth: '442px',
                            height: 'auto',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '36px',
                            lineHeight: '45px',
                            letterSpacing: '-0.02em',
                            color: 'hsla(0, 0%, 20%, 1)',
                            margin: 0,
                            marginBottom: '12px'
                        }}
                    >
                        {title}
                    </h2>
                    <span 
                        className="block"
                        style={{
                            width: 'auto',
                            maxWidth: '442px',
                            height: 'auto',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '36px',
                            lineHeight: '45px',
                            letterSpacing: '-0.02em',
                            color: 'hsla(0, 0%, 20%, 1)'
                        }}
                    >
                        {subtitle}
                    </span>
                </div>

                {/* Right Column - Accordion */}
                <div 
                    className="w-full lg:flex-1 lg:max-w-[758px]"
                    style={{
                        minHeight: '568px',
                        borderBottom: '1px solid hsla(0, 0%, 69%, 1)'
                    }}
                >
                    <div className="space-y-0">
                        {displayFaqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className="w-full"
                                style={{
                                    borderTop: '1px solid hsla(0, 0%, 69%, 1)',
                                    height: activeIndices.includes(index) ? 'auto' : '72px',
                                    minHeight: activeIndices.includes(index) ? '142px' : '72px',
                                    overflow: 'hidden'
                                }}
                            >
                                <button
                                    className="w-full flex items-center justify-between text-left focus:outline-none group gap-[24px]"
                                    style={{
                                        height: '72px',
                                        paddingTop: '20px',
                                        paddingBottom: '20px'
                                    }}
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span 
                                        className="group-hover:text-blue-600 transition-colors"
                                        style={{
                                            width: 'auto',
                                            maxWidth: '702px',
                                            height: '25px',
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: '18px',
                                            lineHeight: '25px',
                                            letterSpacing: '0.01em',
                                            color: 'hsla(0, 0%, 20%, 1)'
                                        }}
                                    >
                                        {faq.question}
                                    </span>
                                    <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
                                        {activeIndices.includes(index) ? (
                                            <PiCaretUp size={24} />
                                        ) : (
                                            <PiCaretDown size={24} />
                                        )}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndices.includes(index) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    style={{
                                        paddingBottom: activeIndices.includes(index) ? '24px' : '0'
                                    }}
                                >
                                    <p 
                                        style={{
                                            width: 'auto',
                                            maxWidth: '758px',
                                            height: 'auto',
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            lineHeight: '23px',
                                            letterSpacing: '0.01em',
                                            color: 'hsla(0, 0%, 33%, 1)',
                                            margin: 0
                                        }}
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
