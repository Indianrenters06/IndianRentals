import PolicyPage from '@/components/PolicyPage';

const FALLBACK_CONTENT = `<h2>Subscription Rules</h2>
<p>Our subscription plans give you access to premium rental products at a predictable monthly cost. Please read the following rules carefully.</p>
<h3>Auto-Renewal</h3>
<p>Subscriptions automatically renew at the end of each billing cycle unless cancelled at least 7 days before the renewal date.</p>
<h3>Cancellation of Subscription</h3>
<p>You can cancel your subscription anytime from your account dashboard. The cancellation will take effect at the end of the current billing period and no further charges will be made.</p>
<h3>Plan Upgrades & Downgrades</h3>
<p>You may upgrade or downgrade your subscription plan at any time. Changes will be reflected in your next billing cycle.</p>
<h3>Pausing a Subscription</h3>
<p>Subscriptions can be paused once per billing cycle for up to 30 days. Pausing does not extend your billing cycle.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='subscription-rules' title={"Subscription Rules"} image={"https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png"} fallbackHtml={FALLBACK_CONTENT} />;
}
