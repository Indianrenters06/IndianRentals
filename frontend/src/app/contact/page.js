import { notFound } from 'next/navigation';
import ContactPage from './ContactPage';
import defaults from '@/config/contact-defaults.json';
import { loadCmsPage } from '@/lib/cmsPreview';
import { decodeLegacyContactContent } from '@/lib/legacyCmsContent';
export async function generateMetadata({ searchParams }) {
    const previewToken = (await searchParams)?.cmsPreview;
    const cms = await loadCmsPage('contact', previewToken) || {};
    return { title: { absolute: cms.metaTitle || 'Contact Us | IndianRenters' }, description: cms.metaDescription || 'Talk to IndianRenters about technology rentals, existing orders and support. Find your local branch and send an enquiry.', alternates: { canonical: '/contact' }, ...(previewToken ? { robots: { index: false, follow: false } } : {}) };
}
export default async function Page({ searchParams }) {
    const previewToken = (await searchParams)?.cmsPreview;
    const cms = await loadCmsPage('contact', previewToken);
    if (cms === null) notFound();
    return <ContactPage content={{ ...defaults, ...(cms.contactContent || decodeLegacyContactContent(cms.pageContent) || {}) }} />;
}
