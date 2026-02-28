'use client';
import ComingSoon from "../../../../components/ComingSoon";
import { CalendarCheck } from "@phosphor-icons/react";
export default function Page() {
    return <ComingSoon title="Subscriptions" subtitle="Monitor active and expired subscription plans." icon={CalendarCheck} />;
}
