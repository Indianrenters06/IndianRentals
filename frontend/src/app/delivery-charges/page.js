import PolicyPage from '@/components/PolicyPage';
import { getPolicyMetadata } from '@/lib/policyMetadata';

export async function generateMetadata() {
    return getPolicyMetadata("delivery-charges", "Delivery Charges", "/delivery-charges");
}

const FALLBACK_CONTENT = `<h2>Delivery Charges</h2>
<p>We offer doorstep delivery across major cities in India. Delivery charges vary based on your location and order value.</p>
<h3>Standard Delivery</h3>
<p>A standard delivery charge is applicable on all orders. This will be displayed at checkout based on your pincode.</p>
<h3>Free Delivery</h3>
<p>Free delivery is applicable on orders above a certain value. Check your cart for the current free delivery threshold.</p>
<h3>Express Delivery</h3>
<p>Express or same-day delivery may be available in select cities for an additional charge.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='delivery-charges' title={"Delivery Charges"} image={"https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png"} fallbackHtml={FALLBACK_CONTENT} />;
}
