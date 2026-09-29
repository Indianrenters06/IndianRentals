import AboutPageClient from './AboutPageClient';
import { getCmsMetadata } from '@/lib/policyMetadata';

export async function generateMetadata({ searchParams }) {
    const previewToken = (await searchParams)?.cmsPreview;
    return getCmsMetadata('about', 'About Us', '/about', 'Learn about IndianRenters and how we help teams rent equipment for work and events.', previewToken);
}

export default function AboutPage() {
    return <AboutPageClient />;
}
