"use client";
import OrdersTable from "../_components/OrdersTable";

export default function PendingOrders() {
    return <OrdersTable initialStatus="pending" title="Pending" />;
}
