'use client';
import ComingSoon from "../../../../components/ComingSoon";
import { Timer } from "@phosphor-icons/react";
export default function Page() {
    return <ComingSoon title="Late Fee Rules" subtitle="Configure penalties for overdue rentals." icon={Timer} />;
}
