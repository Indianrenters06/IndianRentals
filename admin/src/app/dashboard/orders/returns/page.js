"use client";
import OrdersTable from "../_components/OrdersTable";

export default function ReturnedOrders() {
    return <OrdersTable initialStatus="returned" title="Returned" />;
}
