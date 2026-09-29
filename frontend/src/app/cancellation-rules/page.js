import PolicyPage from '@/components/PolicyPage';
import { getPolicyMetadata } from '@/lib/policyMetadata';

export async function generateMetadata() {
    return getPolicyMetadata("cancellation-rules", "Cancellation Rules", "/cancellation-rules");
}

const FALLBACK_CONTENT = `<h2>Cancellation Rules</h2>
<p>We aim to make cancellations as easy as possible while maintaining fairness to our operations team.</p>
<h3>Free Cancellation</h3>
<p>Orders can be cancelled free of charge if the request is made before the product is dispatched for delivery.</p>
<h3>Cancellation After Dispatch</h3>
<p>If the product has already been dispatched, a cancellation fee may apply to cover delivery and restocking costs.</p>
<h3>How to Cancel</h3>
<p>You can cancel your order directly from your account under "My Orders". For urgent cancellations, please contact our support team immediately.</p>
<h3>Refunds on Cancellation</h3>
<p>Refunds for eligible cancellations will be processed within 5-7 business days to the original payment method.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='cancellation-rules' title={"Cancellation Rules"} image={"https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png"} fallbackHtml={FALLBACK_CONTENT} />;
}
