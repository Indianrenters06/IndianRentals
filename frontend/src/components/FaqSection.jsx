"use client";
import React, { useState } from 'react';
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

const FaqSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Left Column */}
                <div className="lg:col-span-5">
                    <span className="text-gray-600 font-medium text-lg mb-4 block font-manrope">Welcome to FAQ!</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-manrope">
                        Everything you need to know about renting with IndianRenters.com
                    </h2>
                </div>

                {/* Right Column - Accordion */}
                <div className="lg:col-span-7">
                    <div className="space-y-0">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 last:border-0">
                                <button
                                    className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="text-lg md:text-xl font-bold text-gray-900 font-manrope pr-8 group-hover:text-blue-600 transition-colors">
                                        {faq.question}
                                    </span>
                                    <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
                                        {activeIndex === index ? (
                                            <PiCaretUp size={24} />
                                        ) : (
                                            <PiCaretDown size={24} />
                                        )}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-gray-600 leading-relaxed font-manrope text-base">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqSection;
