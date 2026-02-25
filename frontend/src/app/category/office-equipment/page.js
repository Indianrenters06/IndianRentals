"use client";
import DynamicCategoryPage from '../../../components/DynamicCategoryPage';
import { TbPrinter, TbScan } from 'react-icons/tb';
import { MdOutlineFax, MdOutlineBadge } from 'react-icons/md';
import { AiOutlineIdcard, AiOutlineBarcode } from 'react-icons/ai';
import { FiScissors } from 'react-icons/fi';


const filterChips = [
    { label: "Shredder", Icon: FiScissors },
    { label: "Counter", Icon: MdOutlineBadge },
    { label: "Lamination", Icon: AiOutlineIdcard },
    { label: "FAX", Icon: MdOutlineFax },
    { label: "Scanner", Icon: TbScan },
    { label: "Barcode", Icon: AiOutlineBarcode },
    { label: "Card Print", Icon: AiOutlineIdcard },
    { label: "POS", Icon: TbPrinter },
];

const fallbackItems = [
    { name: "Paper Shredder", slug: "shredder" },
    { name: "Note Counting Machine", slug: "counting-machine" },
    { name: "Lamination Machine", slug: "lamination" },
    { name: "FAX Machine", slug: "fax" },
    { name: "Barcode Scanner", slug: "scanner" },
    { name: "Barcode Printer", slug: "barcode-printer" },
    { name: "PVC Card Printer", slug: "card-printer" },
    { name: "POS Bill Printer", slug: "pos" },
];

export default function OfficeEquipmentPage() {
    return (
        <DynamicCategoryPage
            categoryName="Office Equipment"
            displayTitle="Office Equipment"
            categorySlug="office-equipment"
            filterChips={filterChips}
            fallbackItems={fallbackItems}
        />
    );
}
