'use client';

import OrdersTable from './_components/OrdersTable';

export const dynamic = 'force-dynamic';

export default function OrdersManagement() {
    return <OrdersTable initialStatus="all" title="All" showSummary />;
}
