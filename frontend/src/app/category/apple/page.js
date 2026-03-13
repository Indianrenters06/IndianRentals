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
    { name: "MacBook Pro", slug: "macbook-pro", image: "/macbook-pro-new.jpg" },
    { name: "iPhone", slug: "iphone", image: "/macbook-pro-new.jpg" }, // generic tech
    { name: "MacBook Air", slug: "macbook-air", image: "/macbook-pro-new.jpg" },
    { name: "iPad", slug: "ipad", image: "/ipad-new.jpg" },
    { name: "Apple Studio Display", slug: "studio-display", image: "/apple-xdr-display-new.jpg" },
    { name: "Apple XDR Display", slug: "xdr-display", image: "/apple-xdr-display-new.jpg" },
    { name: "Mac Pro", slug: "mac-pro", image: "/mac-pro-new.jpg" },
    { name: "iMac", slug: "imac", image: "/apple-xdr-display-new.jpg" },
    { name: "Mac Studio", slug: "mac-studio", image: "/mac-studio-new.jpg" },
    { name: "Mac Mini", slug: "mac-mini", image: "/mac-mini-new.jpg" },
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