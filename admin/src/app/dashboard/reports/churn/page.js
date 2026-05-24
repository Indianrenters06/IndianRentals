'use client';

export const dynamic = 'force-dynamic';

import ComingSoon from "../../../../components/ComingSoon";
import { TrendDown } from "@phosphor-icons/react";
export default function Page() {
    return <ComingSoon title="Churn Report" subtitle="Identify customers at risk of leaving the platform." icon={TrendDown} />;
}
