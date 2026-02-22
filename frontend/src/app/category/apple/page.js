"use client";
import DynamicCategoryPage from '../../../components/DynamicCategoryPage';
import {
    TbDeviceDesktop, TbDeviceLaptop, TbDeviceImac,
    TbDeviceIpad, TbCamera, TbDeviceMobile
} from 'react-icons/tb';
import { BiServer } from 'react-icons/bi';

const filterChips = [
    { label: "Desktop", Icon: TbDeviceDesktop },
    { label: "MacBook", Icon: TbDeviceLaptop },
    { label: "All In One", Icon: TbDeviceImac },
    { label: "Tablet", Icon: TbDeviceIpad },
    { label: "Mac Studio", Icon: BiServer },
    { label: "iPad", Icon: TbDeviceIpad },
    { label: "Laptop", Icon: TbDeviceLaptop },
    { label: "DSLR Camera", Icon: TbCamera },
];

// Fallback static subcategories — used when DB has no subcategories seeded yet
const fallbackItems = [
    { name: "MacBook Pro", slug: "macbook-pro", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png" },
    { name: "iPhone", slug: "iphone", image: "https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=400&auto=format&fit=crop" },
    { name: "MacBook Air", slug: "macbook-air", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png" },
    { name: "iPad", slug: "ipad", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop" },
    { name: "Apple Studio Display", slug: "studio-display", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop" },
    { name: "Apple XDR Display", slug: "xdr-display", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop" },
    { name: "Mac Pro", slug: "mac-pro", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop" },
    { name: "iMac", slug: "imac", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop" },
    { name: "Mac Studio", slug: "mac-studio", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop" },
    { name: "Mac Mini", slug: "mac-mini", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop" },
];

export default function ApplePage() {
    return (
        <DynamicCategoryPage
            categoryName="Apple"
            displayTitle="Apple Products"
            categorySlug="apple"
            filterChips={filterChips}
            fallbackItems={fallbackItems}
        />
    );
}