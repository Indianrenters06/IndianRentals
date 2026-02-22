"use client";
import DynamicCategoryPage from '../../../components/DynamicCategoryPage';
import { TbCamera, TbVideo, TbPrinter } from 'react-icons/tb';
import { MdOutlineCameraRoll } from 'react-icons/md';
import { BiCamera, BiCameraMovie } from 'react-icons/bi';

const filterChips = [
    { label: "DSLR", Icon: TbCamera },
    { label: "Video", Icon: TbVideo },
    { label: "Instant", Icon: MdOutlineCameraRoll },
    { label: "Go-Pro", Icon: BiCameraMovie },
    { label: "Lenses", Icon: BiCamera },
    { label: "Printer", Icon: TbPrinter },
];

const fallbackItems = [
    { name: "DSLR Camera", slug: "camera" },
    { name: "Video Camera", slug: "video-camera" },
    { name: "Instant Camera", slug: "instant-camera" },
    { name: "Go-Pro", slug: "gopro" },
    { name: "Camera Lenses", slug: "lenses" },
    { name: "Photo Printer", slug: "photo-printer" },
];

export default function DSLRPage() {
    return (
        <DynamicCategoryPage
            categoryName="DSLR"
            displayTitle="DSLR Cameras"
            categorySlug="dslr"
            filterChips={filterChips}
            fallbackItems={fallbackItems}
        />
    );
}
