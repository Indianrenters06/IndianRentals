"use client";
import DynamicCategoryPage from '../../../components/DynamicCategoryPage';
import { TbDeviceLaptop, TbDeviceDesktop, TbServer, TbPrinter, TbDeviceImac } from 'react-icons/tb';
import { MdOutlineStoreMallDirectory } from 'react-icons/md';
import { BiServer } from 'react-icons/bi';

const filterChips = [
    { label: "Laptop", Icon: TbDeviceLaptop },
    { label: "Computer", Icon: TbDeviceDesktop },
    { label: "Server", Icon: BiServer },
    { label: "Monitor", Icon: TbDeviceImac },
    { label: "Printer", Icon: TbPrinter },
    { label: "All In One", Icon: TbDeviceImac },
    { label: "Storage", Icon: TbServer },
    { label: "Accessories", Icon: MdOutlineStoreMallDirectory },
];

const fallbackItems = [
    { name: "Laptop", slug: "laptop" },
    { name: "Computer", slug: "computer" },
    { name: "Server", slug: "server" },
    { name: "Workstation", slug: "workstation" },
    { name: "Storage", slug: "storage" },
    { name: "Monitor / TFT", slug: "monitor" },
    { name: "UPS", slug: "ups" },
    { name: "Printer & Scanner", slug: "printer" },
    { name: "All In One", slug: "all-in-one" },
    { name: "Computer Accessories", slug: "accessories" },
];

export default function ITProductsPage() {
    return (
        <DynamicCategoryPage
            categoryName="IT Products"
            displayTitle="IT Products"
            categorySlug="it-products"
            filterChips={filterChips}
            fallbackItems={fallbackItems}
        />
    );
}
