'use client';

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Skeleton, Pagination, Button } from "@heroui/react";
import { ShoppingCart, WarningCircle, CheckCircle, Clock, MagnifyingGlass, DownloadSimple } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RentalHistory() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "createdAt", direction: "descending" });

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/rentals`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to fetch rentals");
                const data = await res.json();
                setRentals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const getStatusColor = (status) => {
        const map = { Active: "success", Delivered: "success", Returned: "default", Pending: "warning", Approved: "primary", Shipped: "primary", Cancelled: "danger" };
        return map[status] || "default";
    };

    const exportCSV = () => {
        const headers = "Order ID,Customer,Email,Items,Amount,Status,Start Date,End Date\n";
        const rows = rentals.map(r =>
            `ORD-${r._id.toString().slice(-6).toUpperCase()},${r.user?.name || "Unknown"},${r.user?.email || ""},${r.orderItems?.length || 0},₹${r.totalPrice || 0},${r.status},${r.rentalPeriod?.startDate ? new Date(r.rentalPeriod.startDate).toLocaleDateString("en-IN") : "N/A"},${r.rentalPeriod?.endDate ? new Date(r.rentalPeriod.endDate).toLocaleDateString("en-IN") : "N/A"}`
        ).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "rental_history.csv"; a.click();
    };

    const downloadRental = (rental) => {
        const content = [
            `Rental Record`,
            `Generated: ${new Date().toLocaleString("en-IN")}`,
            ``,
            `Order ID: ORD-${rental._id.toString().slice(-6).toUpperCase()}`,
            `Customer: ${rental.user?.name || "Unknown"}`,
            `Email: ${rental.user?.email || "N/A"}`,
            `Items: ${rental.orderItems?.length || 0}`,
            `Total Amount: ₹${parseFloat(rental.totalPrice || 0).toLocaleString("en-IN")}`,
            `Status: ${rental.status}`,
            `Start Date: ${rental.rentalPeriod?.startDate ? new Date(rental.rentalPeriod.startDate).toLocaleDateString("en-IN") : "N/A"}`,
            `End Date: ${rental.rentalPeriod?.endDate ? new Date(rental.rentalPeriod.endDate).toLocaleDateString("en-IN") : "N/A"}`,
        ].join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `rental_${rental._id.toString().slice(-6)}.txt`; a.click();
    };

    const statuses = ["All", "Active", "Delivered", "Pending", "Returned", "Cancelled"];

    const sortedItems = useMemo(() => {
        let list = [...rentals];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(r => r.user?.name?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q) || r._id?.toString().toLowerCase().includes(q));
        }
        if (statusFilter !== "All") list = list.filter(r => r.status === statusFilter);
        return list.sort((a, b) => {
            const first = a[sortDescriptor.column]; const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [rentals, search, statusFilter, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Rental <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">History</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Track all active and past rentals across the user base.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <Chip size="lg" color="success" variant="flat" className="font-bold text-sm px-3">
                        {loading ? "..." : `${rentals.filter(r => r.status === "Active" || r.status === "Delivered").length} Active`}
                    </Chip>
                    <Chip size="lg" color="warning" variant="flat" className="font-bold text-sm px-3">
                        {loading ? "..." : `${rentals.filter(r => r.status === "Pending").length} Pending`}
                    </Chip>
                    <button type="button" onClick={exportCSV} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                        <DownloadSimple size={15} /> Export CSV
                    </button>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex flex-col md:flex-row gap-4">
                        <div className="relative group flex-1 max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or order ID..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {statuses.map(s => (
                                <button key={s} type="button" onClick={() => { setStatusFilter(s); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === s ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-400"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" /><p className="font-semibold">{error}</p>
                            <p className="text-sm text-slate-500">Check that the backend server is running.</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Rental history table" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}
                            bottomContent={sortedItems.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                    <span className="text-sm text-slate-500">Showing {items.length} of {sortedItems.length} rentals</span>
                                    <Pagination isCompact showControls showShadow color="primary" page={page} total={Math.ceil(sortedItems.length / rowsPerPage)} onChange={setPage} classNames={{ cursor: "bg-indigo-500 shadow-indigo-500/30" }} />
                                </div>
                            ) : null}
                            classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn key="_id" allowsSorting>ORDER ID</TableColumn>
                                <TableColumn key="user" allowsSorting>CUSTOMER</TableColumn>
                                <TableColumn>ITEMS</TableColumn>
                                <TableColumn key="rentalPeriod">RENTAL PERIOD</TableColumn>
                                <TableColumn key="totalPrice" allowsSorting>AMOUNT</TableColumn>
                                <TableColumn key="status" align="center" allowsSorting>STATUS</TableColumn>
                                <TableColumn align="center">DOWNLOAD</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No rental records found.">
                                {(rental) => (
                                    <TableRow key={rental._id}>
                                        <TableCell>
                                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                ORD-{rental._id.toString().slice(-6).toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar size="sm" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rental.user?.name || 'U')}&background=6366f1&color=fff`} />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rental.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-slate-500">{rental.user?.email || ""}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {rental.orderItems?.length || 0} item{rental.orderItems?.length !== 1 ? 's' : ''}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                {rental.rentalPeriod?.startDate ? (
                                                    <>
                                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                            {new Date(rental.rentalPeriod.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            → {rental.rentalPeriod?.endDate ? new Date(rental.rentalPeriod.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                                                        </span>
                                                    </>
                                                ) : <span className="text-xs text-slate-400">Not specified</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                ₹{parseFloat(rental.totalPrice || 0).toLocaleString("en-IN")}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip size="sm" color={getStatusColor(rental.status)} variant="flat"
                                                    startContent={["Active", "Delivered"].includes(rental.status) ? <CheckCircle weight="bold" /> : ["Pending", "Approved"].includes(rental.status) ? <Clock weight="bold" /> : null}
                                                    className="font-bold">
                                                    {rental.status}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <button type="button" title="Download Rental Record" onClick={() => downloadRental(rental)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                                                    <DownloadSimple size={15} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
