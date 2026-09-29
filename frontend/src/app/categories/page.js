import CategoriesPageClient from './CategoriesPageClient';
import { getCmsMetadata } from '@/lib/policyMetadata';

export async function generateMetadata({ searchParams }) {
    const previewToken = (await searchParams)?.cmsPreview;
    return getCmsMetadata('categories-page', 'Equipment Rentals: Laptops, AV & Cameras', '/categories', 'Browse laptops, MacBooks, projectors, AV gear, office equipment and DSLR cameras for rent.', previewToken);
}

export default function CategoriesPage() {
    return <CategoriesPageClient />;
}
