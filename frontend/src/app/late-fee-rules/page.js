import PolicyPage from '@/components/PolicyPage';

const FALLBACK_CONTENT = `<h2>Late Fee Rules</h2>
<p>We understand that situations can arise. However, to ensure fair access for all customers, late returns are subject to the following fee structure.</p>
<h3>Grace Period</h3>
<p>A grace period of 1 day is provided after your rental end date at no additional cost.</p>
<h3>Late Fee Charges</h3>
<p>After the grace period, a late fee will be charged per day until the product is returned. The exact per-day charge is based on the product category.</p>
<h3>How to Avoid Late Fees</h3>
<p>You can extend your rental period directly from your account dashboard before the rental end date to avoid any late fee charges.</p>`;

export default function Page() {
    return <PolicyPage cmsKey='late-fee-rules' title={"Late Fee Rules"} image={"https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png"} fallbackHtml={FALLBACK_CONTENT} />;
}
