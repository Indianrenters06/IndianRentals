import PolicyPage from '@/components/PolicyPage';

const FALLBACK = `<h2>Shipping &amp; Delivery</h2>
<p>We deliver rental products across major Indian cities within 48–72 hours of order confirmation and KYC approval.</p>
<h3>Delivery Timeline</h3>
<p>Metro cities: 24–48 hours. Tier-2 cities: 48–72 hours. Remote areas: 72–96 hours.</p>
<h3>Delivery Charges</h3>
<p>Free delivery on all rental orders above ₹500/month. A nominal delivery fee applies for smaller orders.</p>
<h3>Product Condition</h3>
<p>All products are professionally cleaned, tested, and packed before dispatch. You will receive a condition report with your delivery.</p>
<h3>Reverse Logistics</h3>
<p>At the end of your rental period, we arrange a pickup from your registered address at no extra cost.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='shipping' title={'Shipping & Delivery'} image={'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg'} fallbackHtml={FALLBACK} />;
}
