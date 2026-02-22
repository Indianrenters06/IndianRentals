"use client";
import DynamicCategoryPage from '../../../components/DynamicCategoryPage';
import { TbDeviceProjector, TbDeviceTv, TbSpeaker, TbMicrophone, TbWall } from 'react-icons/tb';
import { MdOutlineTouchApp, MdOutlineVideocam } from 'react-icons/md';
import { BiSignal5 } from 'react-icons/bi';

const filterChips = [
    { label: "Projector", Icon: TbDeviceProjector },
    { label: "Television", Icon: TbDeviceTv },
    { label: "Sound System", Icon: TbSpeaker },
    { label: "Touch Screen", Icon: MdOutlineTouchApp },
    { label: "Conferencing", Icon: BiSignal5 },
    { label: "Microphone", Icon: TbMicrophone },
    { label: "LED Wall", Icon: TbWall },
    { label: "Video", Icon: MdOutlineVideocam },
];

const fallbackItems = [
    { name: "Projector", slug: "projector" },
    { name: "Television", slug: "tv" },
    { name: "Sound System", slug: "sound" },
    { name: "Touch Screen", slug: "touch-screen" },
    { name: "Conferencing Device", slug: "conferencing" },
    { name: "KIOSK", slug: "kiosk" },
    { name: "Microphone", slug: "mic" },
    { name: "Panaboard", slug: "panaboard" },
    { name: "DVD Player", slug: "dvd" },
    { name: "LED Wall", slug: "led-wall" },
];

export default function AVProductsPage() {
    return (
        <DynamicCategoryPage
            categoryName="AV Products"
            displayTitle="AV Products"
            categorySlug="av-products"
            filterChips={filterChips}
            fallbackItems={fallbackItems}
        />
    );
}
