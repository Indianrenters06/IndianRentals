import { publicMetadata } from '@/lib/publicMetadata';
export async function generateMetadata({ params }) {
    const { sub } = await params;
    const name = sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return publicMetadata({ title: `${name} on Rent`, description: `Browse ${name} rentals and confirm available equipment, rental terms and delivery with IndianRenters.`, path: `/category/it-products/${encodeURIComponent(sub)}` });
}
export default function Layout({ children }) { return children; }
