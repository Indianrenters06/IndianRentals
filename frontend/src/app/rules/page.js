import PolicyPage from '@/components/PolicyPage';
import { getPolicyMetadata } from '@/lib/policyMetadata';

export async function generateMetadata() {
    return getPolicyMetadata("rules", "Rules & Charges", "/rules");
}

const FALLBACK_CONTENT = `<h2>Rules & Charges</h2>
<h3>Delivery Charges</h3>
<p>Base delivery charge is ₹100. We offer free delivery on orders above ₹2000.</p>
<h3>Late Fee Rules</h3>
<p>If you fail to return the rented equipment on time, a late fee of ₹50 per day will be charged after a 1-day grace period.</p>
<h3>Cancellation Rules</h3>
<p>Orders can be cancelled free of charge up to 24 hours before the scheduled delivery. Late cancellations may incur a fee.</p>
<h3>Subscription Rules</h3>
<p>Monthly subscriptions auto-renew unless cancelled at least 7 days prior to the billing cycle.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='rules' title={"Rules & Charges"} image={"https://res.cloudinary.com/dgkckcdk8/image/upload/v1746200213/banner_placeholder_x2qzpf.jpg"} fallbackHtml={FALLBACK_CONTENT} />;
}
