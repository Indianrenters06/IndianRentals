import CheckoutPreview from '@/components/CheckoutPreview';
import { privateRobots } from '@/lib/seo.mjs';

export const metadata = {
    title: 'Checkout design preview',
    robots: privateRobots,
};

export default function CheckoutDesignPreviewPage() {
    return <CheckoutPreview />;
}
