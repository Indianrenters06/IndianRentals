import { publicMetadata } from '@/lib/publicMetadata';
export async function generateMetadata({ params }) {
    const { slug, sub } = await params;
    const name = (sub || slug).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return publicMetadata({ title: `${name} on Rent`, description: `Browse ${name} rentals with IndianRenters. Check current equipment, rental terms and delivery.`, path: `/category/${encodeURIComponent(slug)}${sub ? '/' + encodeURIComponent(sub) : ''}` });
}
export default function Layout({ children }) { return children; }
