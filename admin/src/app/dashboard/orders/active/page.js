"use client";
import OrdersTable from "../_components/OrdersTable";

export default function ActiveOrders() {
    return <OrdersTable initialStatus="delivered" title="Active" />;
}
