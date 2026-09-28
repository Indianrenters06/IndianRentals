import { cache } from 'react';
import ContactPage from './ContactPage';
import defaults from '@/config/contact-defaults.json';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const load = cache(async () => {
    try {
        const res = await fetch(`${API}/api/cms/contact`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        if (!res.ok) return {};
        return await res.json();
    } catch { return {}; }
});
export async function generateMetadata() {
    const cms = await load();
    return { title: { absolute: cms.metaTitle || 'Contact Us | IndianRenters' }, description: cms.metaDescription || 'Talk to IndianRenters about technology rentals, existing orders and support. Find your local branch and send an enquiry.', alternates: { canonical: '/contact' } };
}
export default async function Page() {
    const cms = await load();
    return <ContactPage content={{ ...defaults, ...cms.contactContent }} />;
}
