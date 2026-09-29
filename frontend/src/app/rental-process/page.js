import RentalProcessPageClient from './RentalProcessPageClient';
import { getCmsMetadata } from '@/lib/policyMetadata';

export async function generateMetadata({ searchParams }) {
    const previewToken = (await searchParams)?.cmsPreview;
    return getCmsMetadata('rental-process', 'Rental Process', '/rental-process', 'Learn how to choose equipment, confirm your rental and receive it with IndianRenters.', previewToken);
}

export default function RentalProcessPage() {
    return <RentalProcessPageClient />;
}
