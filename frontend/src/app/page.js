import HomePageClient from './HomePageClient';
import { getCmsMetadata } from '@/lib/policyMetadata';

export async function generateMetadata({ searchParams }) {
  const previewToken = (await searchParams)?.cmsPreview;
  return getCmsMetadata('homepage', 'IndianRenters', '/', 'Rent laptops, MacBooks, cameras and office equipment with IndianRenters.', previewToken);
}

export default function Page() {
  return <HomePageClient />;
}
