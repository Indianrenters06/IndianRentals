'use client';
import ComingSoon from "../../../../components/ComingSoon";
import { ArrowClockwise } from "@phosphor-icons/react";
export default function Page() {
    return <ComingSoon title="Renewal Reminders" subtitle="Send timely alerts for upcoming rental renewals." icon={ArrowClockwise} />;
}
