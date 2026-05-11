"use client";
import OrdersTable from "../_components/OrdersTable";

export default function CancelledOrders() {
    return <OrdersTable initialStatus="cancelled" title="Cancelled" />;
}
