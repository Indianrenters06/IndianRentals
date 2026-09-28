import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ComputerDesktopIcon, CameraIcon, VideoCameraIcon, DeviceTabletIcon, PrinterIcon, ServerStackIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SITE_URL, SITE_NAME } from '@/config/site';
import { LOCATIONS, LOCATION_SUPPORT, locationPhoneHref } from '@/config/locations';
import styles from './LocationPage.module.css';

const SERVICES = [
    { title: 'Laptops & workstations', icon: ComputerDesktopIcon, href: '/category/it-products', desc: 'Set up for your next project.' },
    { title: 'Cameras & lenses', icon: CameraIcon, href: '/category/dslr', desc: 'Bring your next idea into focus.' },
    { title: 'Apple products', icon: DeviceTabletIcon, href: '/category/apple', desc: 'MacBooks, iPads and more.' },
    { title: 'Audio & visual', icon: VideoCameraIcon, href: '/category/av-products', desc: 'Make your event heard and seen.' },
    { title: 'Office equipment', icon: PrinterIcon, href: '/category/office-equipment', desc: 'Keep your working day moving.' },
    { title: 'Servers & networking', icon: ServerStackIcon, href: '/products', desc: 'Build the setup your team needs.' },
];
const description = (name) => `Rent laptops, Apple products, cameras, AV and office equipment in ${name}. Find the right equipment for your work, your team or your next event.`;

export function generateStaticParams() {
    return Object.keys(LOCATIONS).map((city) => ({ city }));
}
export async function generateMetadata({ params }) {
    const slug = (await params).city.toLowerCase();
    const data = LOCATIONS[slug];
    if (!data) return {};
    return {
        title: { absolute: `Tech Rentals in ${data.name} | ${SITE_NAME}` },
        description: description(data.name),
        alternates: { canonical: `${SITE_URL}/locations/${slug}` },
        openGraph: { title: `Tech Rentals in ${data.name} | ${SITE_NAME}`, description: description(data.name),
            url: `${SITE_URL}/locations/${slug}`,
            images: [{ url: `${SITE_URL}/images/cities/${slug}.png`, alt: `${data.name} city illustration` }] },
    };
}
export default async function LocationPage({ params }) {
    const slug = (await params).city.toLowerCase();
    const data = LOCATIONS[slug];
    if (!data) notFound();
    const phoneHref = locationPhoneHref(data.phone);
    const jsonLd = {
        '@context': 'https://schema.org', '@type': data.address ? 'LocalBusiness' : 'Service',
        name: `${SITE_NAME} — ${data.name}`, description: description(data.name),
        url: `${SITE_URL}/locations/${slug}`, image: `${SITE_URL}/images/cities/${slug}.png`,
        ...(data.address ? {
            telephone: phoneHref.slice(4), email: LOCATION_SUPPORT.email,
            address: { '@type': 'PostalAddress', streetAddress: data.address, addressLocality: data.name, addressRegion: data.state, postalCode: data.pincode, addressCountry: 'IN' },
            geo: { '@type': 'GeoCoordinates', latitude: data.coordinates[0], longitude: data.coordinates[1] },
            openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:30' }],
        } : { provider: { '@type': 'Organization', name: SITE_NAME, telephone: phoneHref.slice(4), email: LOCATION_SUPPORT.email }, areaServed: { '@type': 'City', name: data.name } }),
    };
    return <div className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <div className={styles.heroBand}>
            <div className={styles.container}>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
                    <Link href="/">Home</Link><ChevronRightIcon aria-hidden="true" />
                    <Link href="/locations">Our locations</Link><ChevronRightIcon aria-hidden="true" />
                    <span aria-current="page">{data.name}</span>
                </nav>
                <section className={styles.hero} aria-labelledby="city-title">
                    <div className={styles.heroCopy}>
                        <span className={styles.eyebrow}><MapPinIcon aria-hidden="true" /> YOUR CITY. YOUR NEXT POSSIBILITY.</span>
                        <h1 id="city-title">Tech rentals.<br />Right here in <span>{data.name}.</span></h1>
                        <p>{description(data.name)}</p>
                        <div className={styles.actions}>
                            <Link href="#rentals" className="btn-primary">Explore rentals <ArrowRightIcon aria-hidden="true" /></Link>
                            <a href="#local-team" className={styles.textLink}>Talk to our team <ArrowUpRightIcon aria-hidden="true" /></a>
                        </div>
                        <p className={styles.heroNote}>You Name It, We Rent It.</p>
                    </div>
                    <div className={styles.cityArt}>
                        <Image src={`/images/cities/${slug}.png`} alt={`${data.landmark} illustration`} fill priority sizes="(min-width: 1024px) 480px, (min-width: 600px) 40vw, 90vw" />
                        <span className={styles.artLabel}><MapPinIcon aria-hidden="true" />{data.name}{data.state !== data.name ? `, ${data.state}` : ''}</span>
                    </div>
                </section>
            </div>
        </div>

        <section id="rentals" className={`${styles.container} ${styles.section}`} aria-labelledby="rentals-title">
            <header className={styles.sectionHeading}>
                <div><p className={styles.eyebrow}>FIND YOUR SETUP</p><h2 id="rentals-title">What will you create next?</h2></div>
                <p>From a single device to a full team setup.<br />Explore equipment to rent in {data.name}.</p>
            </header>
            <div className={styles.services}>
                {SERVICES.map(({ title, icon: Icon, href, desc }) => <Link href={href} key={title} className={styles.service}>
                    <Icon className={styles.serviceIcon} aria-hidden="true" />
                    <div><h3>{title}</h3><p>{desc}</p></div>
                    <ArrowUpRightIcon className={styles.serviceArrow} aria-hidden="true" />
                </Link>)}
            </div>
            <Link href="/products" className={styles.textLink}>Browse all equipment <ArrowRightIcon aria-hidden="true" /></Link>
        </section>

        <section id="local-team" className={styles.contactBand} aria-labelledby="contact-title">
            <div className={`${styles.container} ${styles.contactGrid}`}>
                <div className={styles.contactIntro}>
                    <p className={styles.eyebrow}>LET’S GET YOU SET UP</p>
                    <h2 id="contact-title">Big plans in {data.name}?<br />Start with a conversation.</h2>
                    <p>Tell us what you need, when you need it and how long for. Our team will help you choose your equipment and confirm availability, pricing and delivery.</p>
                    <Link href="/contact" className="btn-primary">Get a rental quote <ArrowRightIcon aria-hidden="true" /></Link>
                </div>
                <div className={styles.contactCard}>
                    <div className={styles.contactTitle}><MapPinIcon aria-hidden="true" /><h3>{data.address ? `${data.name} ${slug === 'noida' ? 'head office' : 'branch'}` : `Rentals in ${data.name}`}</h3></div>
                    {data.address ? <>
                        <address>{data.address}</address>
                        <a className={styles.textLink} href={`https://www.google.com/maps/search/?api=1&query=${data.coordinates.join(',')}`} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRightIcon aria-hidden="true" /></a>
                    </> : <p>Our central team can help arrange your rental in {data.name}. Contact us to confirm service availability at your address.</p>}
                    <div className={styles.contactDetails}>
                        <a href={phoneHref}><PhoneIcon aria-hidden="true" /><span><small>Call our team</small>{data.phone}</span><ArrowUpRightIcon aria-hidden="true" /></a>
                        <a href={`mailto:${LOCATION_SUPPORT.email}`}><EnvelopeIcon aria-hidden="true" /><span><small>Email us</small>{LOCATION_SUPPORT.email}</span><ArrowUpRightIcon aria-hidden="true" /></a>
                        <div><ClockIcon aria-hidden="true" /><span><small>Support hours</small>{LOCATION_SUPPORT.hours}</span></div>
                    </div>
                </div>
            </div>
        </section>

        <section className={`${styles.container} ${styles.section} ${styles.otherCities}`} aria-labelledby="cities-title">
            <header className={styles.sectionHeading}><div><p className={styles.eyebrow}>WHEREVER WORK TAKES YOU</p><h2 id="cities-title">Find us in your city.</h2></div><p>Explore our other service locations.</p></header>
            <nav aria-label="Other rental locations" className={styles.cityLinks}>
                {Object.entries(LOCATIONS).filter(([key]) => key !== slug).map(([key, item]) => <Link href={`/locations/${key}`} key={key}><MapPinIcon aria-hidden="true" />{item.name}<ArrowUpRightIcon aria-hidden="true" /></Link>)}
            </nav>
        </section>
    </div>;
}
