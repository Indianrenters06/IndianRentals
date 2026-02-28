'use client';
import ComingSoon from "../../../../components/ComingSoon";
import { XCircle } from "@phosphor-icons/react";
export default function Page() {
    return <ComingSoon title="Failed Payments" subtitle="Review failed or declined payment attempts." icon={XCircle} />;
}
