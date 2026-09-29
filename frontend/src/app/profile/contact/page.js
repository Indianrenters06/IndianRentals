'use client';

import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { LOCATION_SUPPORT } from '@/config/locations';
import { profileTitleClassName } from '../profileTitle';

const helpOptions = [
    {
        title: 'Chat with our team',
        description: 'Message us on WhatsApp about an order, a rental, or anything else you need.',
        action: 'Chat on WhatsApp',
        icon: ChatBubbleLeftRightIcon,
        external: true,
    },
    {
        title: 'Send a query',
        description: 'Tell us what happened. Our support form sends your request to the team.',
        action: 'Open support form',
        href: '/contact?intent=support#contact-form',
        icon: EnvelopeIcon,
    },
    {
        title: 'Find an answer',
        description: 'Browse common questions about rentals, delivery, payments, and returns.',
        action: 'Browse FAQs',
        href: '/faq',
        icon: QuestionMarkCircleIcon,
    },
];

export default function GetInTouchPage() {
    return (
        <section className="pb-12 pt-1 sm:pb-16 lg:pt-0" aria-labelledby="support-title">
            <header className="mb-7 border-b border-[#dedede] pb-5">
                <h1 id="support-title" className={profileTitleClassName}>Get in touch</h1>
                <p className="mt-2 max-w-[650px] text-[15px] leading-6 text-[#545454]">
                    Choose the kind of help you need. We’ll point you to the right place.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                {helpOptions.map((option) => {
                    const Icon = option.icon;
                    const ActionIcon = option.external ? ArrowUpRightIcon : ArrowRightIcon;
                    const content = (
                        <>
                            <span className="flex size-11 items-center justify-center rounded-xl bg-[#f6f6f6] text-[#333333]">
                                <Icon className="size-6" aria-hidden="true" />
                            </span>
                            <span className="mt-5 block text-[18px] font-semibold tracking-[-0.02em] text-[#141414]">{option.title}</span>
                            <span className="mt-2 block flex-1 text-[14px] leading-6 text-[#545454]">{option.description}</span>
                            <span className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-4 text-[14px] font-semibold text-[#141414] transition-colors duration-150 group-hover:bg-[#f3bf35]">
                                {option.action}
                                <ActionIcon className="size-4" strokeWidth={2.25} aria-hidden="true" />
                            </span>
                        </>
                    );
                    const classes = 'group flex min-h-[260px] flex-col rounded-2xl border border-[#dedede] bg-white p-5 text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[#9e9e9e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] motion-reduce:transform-none md:min-h-[300px]';
                    return option.external ? (
                        <a key={option.title} href={LOCATION_SUPPORT.whatsappHref} target="_blank" rel="noopener noreferrer" className={classes} aria-label={`${option.action} (opens in a new tab)`}>{content}</a>
                    ) : (
                        <Link key={option.title} href={option.href} className={classes}>{content}</Link>
                    );
                })}
            </div>

            <p className="mt-6 text-[13px] leading-5 text-[#545454]">
                Prefer to call? <a href={`tel:${LOCATION_SUPPORT.phone.replaceAll('-', '')}`} className="font-semibold text-[#141414] underline underline-offset-4 hover:text-[#555555] focus-visible:outline-2 focus-visible:outline-[#141414]">{LOCATION_SUPPORT.phone}</a>
                <span className="mx-2" aria-hidden="true">·</span>{LOCATION_SUPPORT.hours}
            </p>
        </section>
    );
}
