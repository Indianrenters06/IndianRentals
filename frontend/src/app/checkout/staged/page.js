import StagedCheckout from '@/components/StagedCheckout';
import { privateRobots } from '@/lib/seo.mjs';

export const metadata = { title: 'Your rental checkout', robots: privateRobots };
export default async function StagedCheckoutPage({ searchParams }) {
    const query = await searchParams;
    return <StagedCheckout key={query?.orderId || (query?.new === '1' ? 'new' : 'resume')} />;
}
