"use client";
import { cmsUrl } from '@/lib/cmsPreview';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './FaqSection.module.css';

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
    // CMS data fetched here; ignored when the parent passes cmsData directly.
    const [fetchedCms, setFetchedCms] = useState(null);
    const [fetching, setFetching] = useState(!cmsData);
    const [enabled, setEnabled] = useState(true);
    const cms = cmsData || fetchedCms;
    const loading = !cmsData && fetching;

    useEffect(() => {
        if (cmsData) return;

        if (pageName === 'homepage') {
            window.fetch(cmsUrl('homepage'))
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    setFetchedCms(data);
                    if (data && data.homepageFaqEnabled === false) setEnabled(false);
                    setFetching(false);
                })
                .catch(() => setFetching(false));
            return;
        }

        const fetches = [
            window.fetch(cmsUrl('faq')).then(res => res.ok ? res.json() : null)
        ];

        if (pageName) {
            fetches.push(
                window.fetch(cmsUrl(pageName)).then(res => res.ok ? res.json() : null)
            );
        }

        Promise.all(fetches)
            .then(([faqData, pageData]) => {
                setFetchedCms(faqData);
                if (pageData && pageData.faqSectionEnabled === false) {
                    setEnabled(false);
                }
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, [cmsData, pageName]);

    const isHomepage = pageName === 'homepage';
    const isFaqPage = pageName === 'faq';

    let displayFaqs;
    if (isHomepage) {
        displayFaqs = cms?.homepageFaqItems && cms.homepageFaqItems.length > 0 ? cms.homepageFaqItems : faqs;
    } else {
        displayFaqs = cms?.faqItems && cms.faqItems.length > 0 ? cms.faqItems : faqs;
    }

    if (!isFaqPage) {
        displayFaqs = displayFaqs.slice(0, limit || 5);
    } else if (limit) {
        displayFaqs = displayFaqs.slice(0, limit);
    }

    // 1st FAQ is mandatorily open by default — and again whenever the list
    // changes size (e.g. CMS items replace the fallback ones). Reset during
    // render rather than in an effect, so there's no extra flash/re-render.
    const [activeIndices, setActiveIndices] = useState(displayFaqs.length > 0 ? [0] : []);
    const [faqCount, setFaqCount] = useState(displayFaqs.length);
    if (faqCount !== displayFaqs.length) {
        setFaqCount(displayFaqs.length);
        setActiveIndices(displayFaqs.length > 0 ? [0] : []);
    }

    const legacyHomepageHeading = isHomepage && cms?.homepageFaqTitle === 'Frequently Asked Questions'
        && cms?.homepageFaqSubtitle === 'Everything you need to know about renting with us.';
    const title = isHomepage
        ? (legacyHomepageHeading ? "Everything you need to know about renting with IndianRenters.com" : (cms?.homepageFaqTitle || "Everything you need to know about renting with IndianRenters.com"))
        : (cms?.faqTitle || "Everything you need to know about renting with IndianRenters.com");
    const subtitle = isHomepage
        ? (legacyHomepageHeading ? "Welcome to FAQ!" : (cms?.homepageFaqSubtitle || "Welcome to FAQ!"))
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
            className={`w-full bg-white flex items-center ${isHomepage ? styles.homepage : 'py-[48px] lg:py-[100px]'}`}
        >
            {/* Homepage spacing is responsive; other pages keep their existing section spacing. */}
            <div
                className="max-w-[1200px] mx-auto px-5 sm:px-6 w-full flex flex-col lg:flex-row items-start gap-8 lg:gap-[40px]"
            >
                {/* Left Column — Figma "Section Title" (node under FAQ frame): gap 20px, eyebrow above heading */}
                <div className="w-full lg:w-[442px] lg:shrink-0 flex flex-col gap-5">
                    {subtitle && (
                        <span
                            className="block text-[#333333] tracking-[-0.8px] text-[20px] leading-[26px] md:text-[27px] md:leading-[35px] font-semibold md:font-medium"
                            style={{ fontFamily: "'Mona Sans', sans-serif" }}
                        >
                            {subtitle}
                        </span>
                    )}
                    <h2
                        className="m-0 font-semibold text-[#333333] tracking-[-0.8px] text-[25px] leading-[31px] md:text-[36px] md:leading-[45px]"
                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                    >
                        {title}
                    </h2>
                </div>

                {/* Right Column — Figma "Accordion List" (width 718, border-bottom #EEEEEE) */}
                <div className="w-full lg:flex-1 border-b border-[#EEEEEE]">
                    {displayFaqs.map((faq, index) => {
                        const open = activeIndices.includes(index);
                        const answerId = `faq-answer-${pageName || 'default'}-${index}`;
                        return (
                            <div key={index} className="w-full flex flex-col items-start border-t border-[#EEEEEE]">
                                <button
                                    type="button"
                                    className={styles.question}
                                    onClick={() => toggleFaq(index)}
                                    aria-expanded={open}
                                    aria-controls={answerId}
                                >
                                    <span
                                        className="flex-1 font-bold text-[#333333] tracking-[-0.8px] text-[16px] md:text-[18px] leading-[24px] md:leading-[25px]"
                                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                                    >
                                        {faq.question}
                                    </span>
                                    <Image
                                        src="/icons/faq-chevron.svg"
                                        alt=""
                                        aria-hidden="true"
                                        width={28}
                                        height={28}
                                        className={`${styles.chevron} ${open ? '' : styles.closed}`}
                                    />
                                </button>
                                <div
                                    id={answerId}
                                    className={`${styles.answer} ${open ? styles.open : ''}`}
                                    aria-hidden={!open}
                                >
                                    <p
                                        className={styles.answerText}
                                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                                    >
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
