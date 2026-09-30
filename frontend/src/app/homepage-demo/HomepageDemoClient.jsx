'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle, MapPin, Star } from '@phosphor-icons/react';
import RentalProcess from '@/components/RentalProcess';
import FaqSection from '@/components/FaqSection';
import { availableFirst, isProductOutOfStock } from '@/lib/productAvailability';
import { API } from '@/services/apiConfig';
import styles from './homepage-demo.module.css';

const categories = [
  { title: 'Apple products', image: '/macbook-pro-new.jpg', href: '/category/apple', alt: 'MacBook Pro' },
  { title: 'IT equipment', image: '/it-products-new.jpg', href: '/category/it-products', alt: 'Desktop computer' },
  { title: 'Cameras & lenses', image: '/images/services/camera.webp', href: '/category/dslr', alt: 'Camera and lens' },
  { title: 'AV & projectors', image: '/images/services/av.webp', href: '/category/av-products', alt: 'Projector and audio equipment' },
  { title: 'Office equipment', image: '/office-equipment-new.jpg', href: '/category/office-equipment', alt: 'Office equipment' },
  { title: 'All categories', image: '/images/rental-equipment-studio.png', href: '/categories', alt: 'Collection of rental equipment' },
];

const useCases = [
  { title: 'Set up for work', description: 'Laptops and MacBooks for the work in front of you.', image: '/images/home/offers/laptop-campaign.webp', href: '/services/laptop-rental', alt: 'Laptops on a dark workspace' },
  { title: 'Get the shot', description: 'Camera gear for a shoot, project or production.', image: '/images/home/offers/camera-campaign.webp', href: '/services/camera-rental', alt: 'Camera and lens on a studio table' },
  { title: 'Make the room ready', description: 'Screens, projectors and sound for your event.', image: '/images/home/offers/av-campaign.webp', href: '/services/av-equipment-rental', alt: 'Projector and microphones at an event' },
];

const cities = [
  ['Delhi', 'delhi'], ['Noida', 'noida'], ['Mumbai', 'mumbai'], ['Bangalore', 'bangalore'],
  ['Hyderabad', 'hyderabad'], ['Pune', 'pune'], ['Chennai', 'chennai'], ['Kolkata', 'kolkata'],
];

const demoFaq = {
  homepageFaqTitle: 'The questions worth answering before you rent.',
  homepageFaqSubtitle: 'Renting, made clearer',
  homepageFaqItems: [
    { question: 'Is the security deposit refundable?', answer: 'Yes. The deposit is refunded after the equipment is returned and checked, subject to the rental terms and any outstanding dues.' },
    { question: 'When do I complete KYC?', answer: 'You submit your details and requested documents during checkout. Your order can be dispatched after verification is approved.' },
    { question: 'When will my order arrive?', answer: 'Timing depends on the product and delivery city. Check availability and the delivery estimate for your order before you confirm it.' },
    { question: 'Are repairs and maintenance included?', answer: 'Maintenance and support are included during the rental period. Review the product plan and rental terms for the applicable conditions.' },
    { question: 'What if I need to return or extend my rental?', answer: 'You can discuss an extension with the team. Review the return policy and your plan terms before booking so you know how changes are handled.' },
  ],
};

function money(value) {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? `₹${amount.toLocaleString('en-IN')}` : null;
}

function RentalPlans() {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}/api/products?limit=8`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Products could not be loaded');
        return response.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.products || []);
        setProducts(availableFirst(items).slice(0, 4));
        setState('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState('error');
      });
    return () => controller.abort();
  }, []);

  return (
    <section className={styles.productsSection} aria-labelledby="rental-plans-title">
      <div className={styles.container}>
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="rental-plans-title">Explore rentals, with the details up front.</h2>
            <p>Compare the monthly rent and refundable deposit before opening a plan.</p>
          </div>
          <Link href="/products" className={styles.textLink}>Browse all products <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        {state === 'loading' ? (
          <div className={styles.productGrid} aria-label="Loading products">
            {[0, 1, 2, 3].map((item) => <div key={item} className={styles.productSkeleton} />)}
          </div>
        ) : state === 'error' || products.length === 0 ? (
          <div className={styles.productEmpty}>
            <p>Product details are unavailable right now.</p>
            <Link href="/products" className={styles.secondaryButton}>Open the full catalogue <ArrowRight aria-hidden="true" /></Link>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {products.map((product) => {
              const image = product.images?.[0] || product.image || '/images/placeholder.png';
              const rent = money(product.rentalPrice);
              const deposit = money(product.securityDeposit);
              const reviews = Number(product.numReviews ?? product.reviewCount ?? 0);
              const rating = Number(product.rating ?? 0);
              const unavailable = isProductOutOfStock(product);
              return (
                <article className={styles.productCard} key={product._id}>
                  <Link href={`/products/${product._id}`} className={styles.productImageLink} aria-label={`View ${product.name} rental plan`}>
                    <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 25vw" unoptimized className={styles.productImage} />
                    {unavailable && <span className={styles.stockBadge}>Out of stock</span>}
                  </Link>
                  <div className={styles.productBody}>
                    <h3><Link href={`/products/${product._id}`}>{product.name}</Link></h3>
                    {rating > 0 && reviews > 0 && <p className={styles.productRating}><Star weight="fill" aria-hidden="true" /> {rating.toFixed(1)} <span>({reviews} reviews)</span></p>}
                    <div className={styles.priceLine}><strong>{rent || 'See rental plan'}</strong>{rent && <span>/ month</span>}</div>
                    <p className={styles.depositLine}>{deposit ? `Refundable deposit ${deposit}` : 'Deposit shown in plan'}</p>
                    <p className={styles.deliveryLine}>{product.deliveryTime ? `Estimated delivery: ${product.deliveryTime}` : 'Delivery timing confirmed for your city'}</p>
                    <Link href={`/products/${product._id}`} className={styles.productAction}>View plan <ArrowUpRight aria-hidden="true" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomepageDemoClient() {
  return (
    <main className={styles.demoPage}>
      <section className={styles.hero} aria-labelledby="demo-hero-title">
        <div className={styles.heroCopy}>
          <h1 id="demo-hero-title">Rent laptops, cameras &amp; AV gear.</h1>
          <p className={styles.heroDescription}>For work, shoots and events, ready when you are. Choose a plan, complete verification and get ready to make it happen.</p>
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.primaryButton}>Explore rentals <ArrowUpRight aria-hidden="true" /></Link>
            <a href="#how-it-works" className={styles.heroSecondary}>How renting works <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image src="/images/homepage-demo/creative-workspace.webp" alt="Creative professional working with a laptop, camera and projector" fill priority sizes="(max-width: 900px) 100vw, 55vw" />
          <span className={styles.heroImageCaption}>Equipment for work, content and events</span>
        </div>
      </section>

      <section className={styles.proofStrip} aria-label="IndianRenters at a glance">
        <div className={styles.container}>
          <div><strong>28 years</strong><span>in the rental business</span></div>
          <div><strong>90,000+</strong><span>orders served</span></div>
          <div><strong>4.9 / 5</strong><span>from 1,050+ reviews</span></div>
          <div><strong>8 cities</strong><span>served across India</span></div>
        </div>
      </section>

      <section className={styles.categoriesSection} aria-labelledby="demo-categories-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="demo-categories-title">Find the right equipment for your next move.</h2>
              <p>Go straight to the category that fits your work.</p>
            </div>
            <Link href="/categories" className={styles.textLink}>All categories <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <Link href={category.href} key={category.title} className={styles.categoryTile}>
                <div className={styles.categoryImage}><Image src={category.image} alt={category.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 25vw" /></div>
                <span>{category.title}<ArrowUpRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RentalPlans />

      <div id="how-it-works" className={styles.processWrap}><RentalProcess /></div>

      <section className={styles.claritySection} aria-labelledby="demo-clarity-title">
        <div className={styles.container}>
          <div className={styles.clarityIntro}>
            <h2 id="demo-clarity-title">Know what happens before you book.</h2>
            <p>The displayed monthly rate covers the equipment. Your refundable deposit is separate; check the full order total before payment.</p>
            <Link href="/rental-process" className={styles.clarityLink}>See the full rental process <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.clarityList}>
            <div><CheckCircle aria-hidden="true" /><span><strong>Pick your rental period</strong><small>See the plan options and monthly rate on each product page.</small></span></div>
            <div><CheckCircle aria-hidden="true" /><span><strong>Review the refundable deposit</strong><small>The amount appears with the plan. It is returned after the equipment is checked and any outstanding dues are settled.</small></span></div>
            <div><CheckCircle aria-hidden="true" /><span><strong>Check charges and tax</strong><small>GST and any applicable collection charge may affect the total. Check the active delivery and setup offer alongside the itemized order before payment.</small></span></div>
            <div><CheckCircle aria-hidden="true" /><span><strong>Complete KYC before dispatch</strong><small>Submit the requested documents during checkout for review.</small></span></div>
            <div><CheckCircle aria-hidden="true" /><span><strong>Use it with support</strong><small>Maintenance and support are included during the rental period, subject to the plan terms.</small></span></div>
            <div><CheckCircle aria-hidden="true" /><span><strong>Know the return terms</strong><small>Cancel before dispatch for a refund of advance rent and deposit. For an early return, give 5 business days&apos; notice; rent is recalculated for the time used. See the <Link href="/return-policy">return policy</Link> for the full terms.</small></span></div>
          </div>
        </div>
      </section>

      <section className={styles.reviewSection} aria-labelledby="demo-review-title">
        <div className={styles.container}>
          <div>
            <h2 id="demo-review-title">A track record you can check.</h2>
            <p>Read customer experiences before you choose your plan.</p>
          </div>
          <div className={styles.reviewScore}><Star weight="fill" aria-hidden="true" /><strong>4.9</strong><span>from 1,050+ reviews</span><Link href="/reviews">Read customer reviews <ArrowUpRight aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className={styles.useCasesSection} aria-labelledby="demo-use-cases-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div><h2 id="demo-use-cases-title">Choose the job. Then choose the gear.</h2><p>Useful routes when you know what you need to do, but not the model yet.</p></div>
          </div>
          <div className={styles.useCaseGrid}>
            {useCases.map((item) => <Link className={styles.useCaseCard} href={item.href} key={item.title}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 33vw" />
              <span className={styles.useCaseContent}><strong>{item.title}</strong><small>{item.description}</small><span>Explore options <ArrowUpRight aria-hidden="true" /></span></span>
            </Link>)}
          </div>
        </div>
      </section>

      <section className={styles.citiesSection} aria-labelledby="demo-cities-title">
        <div className={styles.container}>
          <div className={styles.citiesIntro}><MapPin aria-hidden="true" /><h2 id="demo-cities-title">Rent in your city.</h2><p>Explore the service area near you. Product availability and delivery timing are confirmed for your order.</p></div>
          <div className={styles.cityGrid}>{cities.map(([name, slug]) => <Link href={`/locations/${slug}`} key={slug}>{name}<ArrowUpRight aria-hidden="true" /></Link>)}</div>
        </div>
      </section>

      <FaqSection pageName="homepage" cmsData={demoFaq} limit={5} />

      <section className={styles.finalCta} aria-labelledby="demo-final-title">
        <div className={styles.container}>
          <h2 id="demo-final-title">Ready to find your rental?</h2>
          <p>Browse the equipment, compare plans and choose what fits your next project.</p>
          <div><Link href="/products" className={styles.primaryButton}>Explore rentals <ArrowUpRight aria-hidden="true" /></Link><Link href="/contact" className={styles.finalSecondary}>Talk to the team <ArrowRight aria-hidden="true" /></Link></div>
        </div>
      </section>
    </main>
  );
}
