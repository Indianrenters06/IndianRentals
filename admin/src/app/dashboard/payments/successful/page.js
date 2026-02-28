'use client';
import ComingSoon from "../../../../components/ComingSoon";
import { CheckCircle } from "@phosphor-icons/react";
export default function Page() {
    return <ComingSoon title="Successful Payments" subtitle="All verified and confirmed payment transactions." icon={CheckCircle} />;
}
