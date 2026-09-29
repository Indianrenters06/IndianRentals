import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRightIcon, ArrowUpRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import FaqSection from '@/components/FaqSection';
import { SITE_URL, SITE_NAME } from '@/config/site';
import ServiceProductPreview from './ServiceProductPreview';
import { SERVICES, SERVICE_CITIES } from './serviceData';
import { loadCmsPage } from '@/lib/cmsPreview';
import { decodeLegacyServiceContent } from '@/lib/legacyCmsContent';

export function generateStaticParams() {
    return Object.keys(SERVICES).map((service) => ({ service }));
}

export async function generateMetadata({ params, searchParams }) {
    const { service } = await params;
    const previewToken = (await searchParams)?.cmsPreview;
    const cms = SERVICES[service] ? await loadCmsPage(`service-${service}`, previewToken) : null;
    const data = SERVICES[service] && cms !== null ? { ...SERVICES[service], ...(cms.serviceContent || decodeLegacyServiceContent(cms.pageContent) || {}) } : null;
    if (!data) return {};
    const url = `${SITE_URL}/services/${service}`;
    const imageUrl = new URL(data.image, SITE_URL).toString();
    return {
        title: cms.metaTitle || data.title,
        description: cms.metaDescription || data.description,
        keywords: data.keywords,
        alternates: { canonical: url },
        ...(previewToken ? { robots: { index: false, follow: false } } : {}),
        openGraph: {
            title: cms.metaTitle || `${data.title} | ${SITE_NAME}`,
            description: cms.metaDescription || data.description,
            url,
            images: [{ url: imageUrl, width: 1254, height: 1254, alt: data.imageAlt }],
        },
    };
}

const rentalSteps = [
    { title: 'Choose the equipment', description: 'Browse the catalogue or tell us the setup you need.' },
    { title: 'Confirm your rental', description: 'Agree on the item, duration, deposit and delivery details.' },
    { title: 'Put it to work', description: 'We deliver and set it up, with maintenance covered during the rental.' },
];

const rentalDetails = [
    { title: 'Delivery and setup', description: 'Free doorstep delivery and installation are included.' },
    { title: 'Care during your rental', description: 'Equipment is quality-checked before delivery. Maintenance and repairs are covered while you rent.' },
    { title: 'Deposit and return', description: 'A refundable security deposit applies. We confirm the terms before booking and handle returns or swaps.' },
];

const actionClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[background-color,color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] motion-reduce:transition-none';

export default async function ServicePage({ params, searchParams }) {
    const { service } = await params;
    if (!SERVICES[service]) notFound();
    const previewToken = (await searchParams)?.cmsPreview;
    const cms = await loadCmsPage(`service-${service}`, previewToken);
    if (cms === null) notFound();
    const data = { ...SERVICES[service], ...(cms.serviceContent || decodeLegacyServiceContent(cms.pageContent) || {}) };

    const quoteFirst = data.primaryAction === 'quote';
    const primaryHref = quoteFirst ? '/contact' : data.categoryHref;
    const primaryLabel = quoteFirst ? 'Talk about your rental' : data.categoryLabel;
    const secondaryHref = quoteFirst ? data.categoryHref : '/contact';
    const secondaryLabel = quoteFirst ? data.categoryLabel : 'Ask our team';
    const relatedServices = Object.entries(SERVICES).filter(([slug]) => slug !== service);
    const serviceJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data.title,
        description: data.description,
        provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        areaServed: SERVICE_CITIES.map((name) => ({ '@type': 'City', name })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />
            <div className="bg-white pb-20 font-sans text-[#141414]">
                <div className="mx-auto w-full max-w-[1200px] px-5 pt-6 md:px-8 md:pt-9">
                    <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[13px] text-[#545454] md:mb-6">
                        <Link href="/services" className="rounded-sm underline-offset-4 hover:text-[#141414] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">Rental services</Link>
                        <span aria-hidden="true">/</span><span className="font-medium text-[#141414]">{data.title}</span>
                    </nav>

                    <section aria-labelledby="service-title" className="grid overflow-hidden rounded-[26px] bg-[#f6f6f6] lg:min-h-[540px] lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px]">
                        <div className="flex flex-col justify-center px-6 pb-5 pt-9 sm:px-9 lg:px-14 lg:py-16">
                            <h1 id="service-title" className="max-w-[690px] text-[clamp(2.4rem,5vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.045em]">{data.headline}</h1>
                            <p className="mt-5 max-w-[530px] text-[16px] leading-[1.6] text-[#333333] sm:text-[18px]">{data.description}</p>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link href={primaryHref} className={`${actionClass} bg-[#ffcf46] text-[#141414] hover:bg-[#f5c236]`}>
                                    {primaryLabel}<ArrowUpRightIcon className="size-[18px] stroke-2" aria-hidden="true" />
                                </Link>
                                <Link href={secondaryHref} className={`${actionClass} border border-[#141414] bg-transparent text-[#141414] hover:bg-[#141414] hover:text-white`}>{secondaryLabel}</Link>
                            </div>
                            <p className="mt-6 flex items-center gap-2 text-[13px] leading-5 text-[#545454]">
                                <CheckCircleIcon className="size-[18px] shrink-0 stroke-[1.8] text-[#141414]" aria-hidden="true" />Delivery, setup and maintenance included
                            </p>
                        </div>
                        <div className="relative aspect-[5/4] min-h-[280px] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[540px]">
                            <Image src={data.image} alt={data.imageAlt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover" />
                        </div>
                    </section>

                    <section aria-labelledby="equipment-heading" className="pt-16 md:pt-24">
                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 id="equipment-heading" className="text-[30px] font-semibold leading-tight tracking-[-0.035em] md:text-[40px]">Find the right equipment</h2>
                                <p className="mt-2 max-w-[610px] text-[16px] leading-6 text-[#545454]">See current listings, then choose the device and rental details that fit your plans.</p>
                            </div>
                            <Link href={data.categoryHref} className="inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold underline decoration-[#b7b7b7] underline-offset-4 transition-colors hover:decoration-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] sm:self-auto">
                                {data.categoryLabel}<ArrowUpRightIcon className="size-[18px] stroke-2" aria-hidden="true" />
                            </Link>
                        </div>
                        <ServiceProductPreview category={data.catalogueCategory} keyword={data.catalogueKeyword} categoryHref={data.categoryHref} categoryLabel={data.categoryLabel} fallbackImage={data.image} />
                    </section>

                    <section aria-labelledby="use-heading" className="pt-16 md:pt-24">
                        <div className="border-t border-[#d8d8d8] pt-7 md:pt-9">
                            <h2 id="use-heading" className="max-w-[660px] text-[30px] font-semibold leading-tight tracking-[-0.035em] md:text-[40px]">Made for the way you work</h2>
                            <div className="mt-7 grid gap-6 sm:grid-cols-3 sm:gap-8 md:mt-10">
                                {data.useCases.map((item) => (
                                    <div key={item.title} className="border-t border-[#d8d8d8] pt-5">
                                        <h3 className="text-[18px] font-semibold leading-snug">{item.title}</h3>
                                        <p className="mt-3 max-w-[320px] text-[15px] leading-6 text-[#545454]">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="process-heading" className="pt-16 md:pt-24">
                        <div className="rounded-[26px] bg-[#f6f6f6] px-6 py-9 sm:px-9 md:rounded-[32px] md:px-12 md:py-12">
                            <h2 id="process-heading" className="text-[30px] font-semibold leading-tight tracking-[-0.035em] md:text-[40px]">How your rental works</h2>
                            <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-8">
                                {rentalSteps.map((step, index) => (
                                    <div key={step.title} className="border-t border-[#c9c9c9] pt-5">
                                        <span className="text-[14px] font-semibold text-[#545454]">0{index + 1}</span>
                                        <h3 className="mt-5 text-[19px] font-semibold leading-snug">{step.title}</h3>
                                        <p className="mt-2 max-w-[330px] text-[15px] leading-6 text-[#545454]">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="included-heading" className="grid gap-8 pt-16 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:pt-24">
                        <div>
                            <h2 id="included-heading" className="max-w-[390px] text-[30px] font-semibold leading-tight tracking-[-0.035em] md:text-[40px]">Support from delivery to return.</h2>
                            <p className="mt-4 max-w-[390px] text-[16px] leading-7 text-[#545454]">We make the rental terms clear before you confirm, so you know what to expect at each stage.</p>
                        </div>
                        <div className="border-t border-[#d8d8d8]">
                            {rentalDetails.map((detail) => (
                                <div key={detail.title} className="grid gap-2 border-b border-[#d8d8d8] py-5 sm:grid-cols-[180px_1fr] sm:gap-8">
                                    <h3 className="text-[16px] font-semibold">{detail.title}</h3>
                                    <p className="text-[15px] leading-6 text-[#545454]">{detail.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <FaqSection cmsData={{ faqItems: data.faqs.map(({ q, a }) => ({ question: q, answer: a })), faqSubtitle: 'Good to know', faqTitle: `Everything you need to know about ${data.title.replace(/ in India$/, '').toLowerCase()}` }} pageName={`service-${service}`} />

                    <section aria-labelledby="quote-heading" className="mt-16 rounded-[26px] bg-[#141414] px-6 py-10 text-white sm:px-9 md:mt-24 md:flex md:items-end md:justify-between md:gap-10 md:rounded-[32px] md:px-12 md:py-12">
                        <div>
                            <h2 id="quote-heading" className="max-w-[620px] text-[32px] font-semibold leading-[1.1] tracking-[-0.04em] md:text-[44px]">Have a particular setup in mind?</h2>
                            <p className="mt-4 max-w-[570px] text-[16px] leading-7 text-[#d0d0d0]">Tell us what you need, where you need it and for how long. We will help you find a suitable rental.</p>
                        </div>
                        <Link href="/contact" className={`${actionClass} mt-7 shrink-0 bg-[#ffcf46] text-[#141414] hover:bg-[#f5c236] md:mt-0`}>
                            Talk to our team<ArrowRightIcon className="size-[18px] stroke-2" aria-hidden="true" />
                        </Link>
                    </section>

                    <section aria-labelledby="related-heading" className="pt-16 md:pt-24">
                        <h2 id="related-heading" className="text-[25px] font-semibold tracking-[-0.03em] md:text-[32px]">Explore other rentals</h2>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedServices.map(([slug, related]) => (
                                <Link key={slug} href={`/services/${slug}`} className="group flex min-h-16 items-center justify-between gap-4 rounded-[16px] border border-[#e5e5e5] px-5 py-4 text-[15px] font-semibold transition-[background-color,border-color] duration-200 hover:border-[#b7b7b7] hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                                    {related.title.replace(' in India', '')}
                                    <ArrowUpRightIcon className="size-[18px] shrink-0 stroke-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
