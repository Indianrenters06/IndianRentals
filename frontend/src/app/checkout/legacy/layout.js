import { privateRobots } from '@/lib/seo.mjs';

export const metadata = { title: 'Original checkout backup', robots: privateRobots };

export default function LegacyCheckoutLayout({ children }) {
    return children;
}
