'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { downloadPDFReport } from "@/utils/pdfReport";
import { downloadCustomerReport } from "@/utils/customerReport";
import SortSelect from "@/components/SortSelect";
import {
    MagnifyingGlass, Funnel, DownloadSimple, PencilSimple, Trash,
    Phone, MapPin, DotsThreeVertical, EnvelopeSimple,
    UserPlus, ShieldCheck, User, Key, CheckCircle,
    ProhibitInset, LockOpen, ToggleLeft, ToggleRight, Warning
} from '@phosphor-icons/react';
import {
    Card,
    CardBody,
    Input,
    Select,
    SelectItem,
    Button,
    Avatar,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Spinner,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider
} from "@heroui/react";
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_COLORS = {
    Pending: 'warning', Approved: 'primary', Shipped: 'secondary',
    Delivered: 'success', Active: 'success', Returned: 'default', Cancelled: 'danger',
};

function CustomerOrdersList({ userId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API}/api/admin/users/${userId}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, [userId]);

    if (loading) return (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
            <Spinner size="sm" color="secondary" /> Loading orders…
        </div>
    );

    if (orders.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor"><path d="M223.15,68.72l-88-48.18a14,14,0,0,0-14.3,0l-88,48.17a14,14,0,0,0-7.09,12.29V175a14,14,0,0,0,7.09,12.28l88,48.18a14,14,0,0,0,14.3,0l88-48.18A14,14,0,0,0,230.24,175V81A14,14,0,0,0,223.15,68.72ZM128,34l83.23,45.57L128,125.14,44.77,79.57ZM38,96.28l82,44.89V219.5L38,174.61Zm96,123.22V141.17l82-44.89V174.61Z"/></svg></div>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">No orders found</p>
            <p className="text-slate-400 text-sm mt-1">This customer hasn't placed any orders yet.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
            {orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Order Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <p className="text-xs font-mono text-slate-400">#{order._id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Chip size="sm" color={STATUS_COLORS[order.status] || 'default'} variant="flat">
                                {order.status}
                            </Chip>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    {/* Order Items */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {order.orderItems?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                                    <p className="text-xs text-slate-400">Qty: {item.qty} · ₹{item.price?.toLocaleString('en-IN')}/mo</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Order Footer */}
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500">
                        <span>{order.rentalPeriod?.durationMonths} month{order.rentalPeriod?.durationMonths !== 1 ? 's' : ''} rental</span>
                        <span>{order.isPaid ? 'Paid' : 'Unpaid'} · {order.paymentMethod}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CustomersManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const [sortDescriptor, setSortDescriptor] = useState({ column: 'createdAt', direction: 'descending' });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState('profile');
    const [fetchError, setFetchError] = useState(null);

    const [permissions, setPermissions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [statusAction, setStatusAction] = useState(null); // 'block'|'unblock'|'activate'|'deactivate'
    const { isOpen: isBlockOpen, onOpen: onBlockOpen, onOpenChange: onBlockOpenChange } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();

    const [addFormData, setAddFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        city: "",
        state: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleView = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
        onOpen();
    };

    // ── Status Actions (block / unblock / activate / deactivate) ────────────────
    const handleStatusChange = async (user, action, reason = '') => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${user._id}/status`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ action, reason })
                }
            );
            const data = await response.json();
            if (response.ok) {
                setUsers(prev => prev.map(u =>
                    u._id === data._id ? { ...u, isBlocked: data.isBlocked, isActive: data.isActive, blockedReason: data.blockedReason } : u
                ));
                const actionLabel = { block: 'blocked', unblock: 'unblocked', activate: 'activated', deactivate: 'deactivated' }[action] || 'updated';
                toast.success(`User ${actionLabel} successfully`);
            } else {
                toast.error(data.message || 'Failed to update user status');
            }
        } catch (err) {
            toast.error('Network error. Could not update status.');
        }
    };

    const openBlockModal = (user) => {
        setSelectedUser(user);
        setStatusAction('block');
        setBlockReason('');
        onBlockOpen();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setFetchError(null);
            } else {
                setFetchError(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn('Error fetching users from API:', error);
            setFetchError("Network or server error. Make sure the backend is running.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setUsers(prev => prev.filter(u => u._id !== userId));
                toast.success('Customer deleted successfully');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Network error. Could not delete user.');
        }
    };

    const exportPDF = () => {
        const headers = ["Name", "Email", "Phone", "City", "State", "Status", "Joined Date"];
        const data = users.map(u => [
            u.name || "-",
            u.email || "-",
            u.phone || "-",
            u.city || "-",
            u.state || "-",
            u.isBlocked ? 'Blocked' : u.isActive ? 'Active' : 'Inactive',
            new Date(u.createdAt).toLocaleDateString()
        ]);
        downloadPDFReport("Customers Report", headers, data, "customers_report");
    };

    const downloadUser = async (user) => {
        const toastId = toast.loading("Generating customer report...");
        try {
            await downloadCustomerReport(user);
            toast.success(`Report downloaded for ${user.name}`, { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to generate report", { id: toastId });
        }
    };

    const filteredUsers = useMemo(() => {
        let list = users.filter(user => {
            return user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        });
        return list.sort((a, b) => {
            const col = sortDescriptor.column;
            let first, second;
            if (col === 'name') { first = (a.name || '').toLowerCase(); second = (b.name || '').toLowerCase(); }
            else if (col === 'createdAt') { first = new Date(a.createdAt).getTime() || 0; second = new Date(b.createdAt).getTime() || 0; }
            else { first = a[col]; second = b[col]; }
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [users, searchTerm, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredUsers.slice(start, end);
    }, [page, filteredUsers]);

    const renderCell = (user, columnKey) => {
        switch (columnKey) {
            case "user":
                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            name={user.name?.charAt(0).toUpperCase() || 'U'}
                            className="bg-indigo-600 text-white font-semibold shrink-0"
                            size="sm"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{user.name || 'Unnamed User'}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                    </div>
                );

            case "contact":
                return (
                    <div className="flex flex-col gap-1">
                        {user.phone ? (
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-200">
                                <Phone className="w-3 h-3 text-indigo-500" />
                                <span>{user.phone}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-500 italic">No phone</span>
                        )}
                        {user.city ? (
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-200">
                                <MapPin className="w-3 h-3 text-indigo-500" />
                                <span>{user.city}, {user.state || 'India'}</span>
                            </div>
                        ) : null}
                    </div>
                );
            case "joined":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                );
            case "status":
                if (user.isBlocked) return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                        <ProhibitInset className="w-3 h-3" /> Blocked
                    </span>
                );
                if (!user.isActive) return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                        <ToggleLeft className="w-3 h-3" /> Inactive
                    </span>
                );
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                        <ToggleRight className="w-3 h-3" /> Active
                    </span>
                );
            case "actions":
                return (
                    <div className="flex justify-end items-center gap-2 pr-4">
                        <button type="button" title="Download Report" onClick={() => downloadUser(user)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                            <DownloadSimple size={15} />
                        </button>
                        <Dropdown classNames={{ content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-50 shadow-xl" }}>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <DotsThreeVertical className="w-4 h-4" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="view" startContent={<User />} onPress={() => handleView(user, 'profile')}>View Profile</DropdownItem>
                                <DropdownItem key="orders" startContent={<MapPin />} onPress={() => handleView(user, 'orders')}>View Orders</DropdownItem>
                                {/* Status actions */}
                                {!user.isBlocked ? (
                                    <DropdownItem key="block" className="text-red-600" color="danger" startContent={<ProhibitInset className="text-red-500" />} onPress={() => openBlockModal(user)}>
                                        Block User
                                    </DropdownItem>
                                ) : (
                                    <DropdownItem key="unblock" className="text-green-600" startContent={<LockOpen className="text-green-500" />} onPress={() => handleStatusChange(user, 'unblock')}>
                                        Unblock User
                                    </DropdownItem>
                                )}
                                {user.isActive && !user.isBlocked ? (
                                    <DropdownItem key="deactivate" className="text-amber-600" startContent={<ToggleLeft className="text-amber-500" />} onPress={() => handleStatusChange(user, 'deactivate')}>
                                        Deactivate
                                    </DropdownItem>
                                ) : (!user.isBlocked && !user.isActive) ? (
                                    <DropdownItem key="activate" className="text-green-600" startContent={<ToggleRight className="text-green-500" />} onPress={() => handleStatusChange(user, 'activate')}>
                                        Activate
                                    </DropdownItem>
                                ) : null}
                                <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash className="text-danger" />} onPress={() => handleDeleteUser(user._id)}>
                                    Delete User
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] w-full">
                <Spinner size="lg" color="primary" label="Loading Users Data..." classNames={{ label: "text-slate-500 mt-4" }} />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Customers <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Complete directory of all registered customers.</p>
                </motion.div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button color="secondary" className="font-semibold shadow-md shadow-indigo-500/20" startContent={
                        <DownloadSimple className="w-4 h-4" />
                    } onClick={exportPDF}>
                        Export PDF
                    </Button>
                    <button
                        type="button"
                        onClick={onAddOpen}
                        className="inline-flex items-center gap-2 h-12 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        <UserPlus className="w-5 h-5" weight="bold" />
                        Add New Customer
                    </button>
                </div>
            </div>

            {fetchError && (
                <div className="w-full bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-xl shadow-sm text-sm flex justify-between items-center">
                    <div>
                        <strong>Connection Issue: </strong>
                        Failed to load real users from the database. ({fetchError})
                    </div>
                    <Button size="sm" color="danger" variant="flat" onPress={fetchUsers}>Retry</Button>
                </div>
            )}

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative group">
                                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full h-[50px] pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm transition-all"
                                />
                            </div>
                        </div>
                        <SortSelect
                            className="h-[50px]"
                            value={`${sortDescriptor.column}:${sortDescriptor.direction}`}
                            onChange={(column, direction) => { setSortDescriptor({ column, direction }); setPage(1); }}
                            options={[
                                { value: "createdAt:descending", label: "Newest first" },
                                { value: "createdAt:ascending", label: "Oldest first" },
                                { value: "name:ascending", label: "Name A–Z" },
                                { value: "name:descending", label: "Name Z–A" },
                            ]}
                        />
                    </div>

                    <Table
                        aria-label="Customers management table"
                        bottomContent={
                            filteredUsers.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                    <span className="text-sm text-slate-500">
                                        Showing {filteredUsers.length} total customers
                                    </span>
                                    <Pagination
                                        radius="md" variant="flat"
                                        showControls

                                        color="primary"
                                        page={page}
                                        total={Math.ceil(filteredUsers.length / rowsPerPage)}
                                        onChange={(page) => setPage(page)}
                                        classNames={{
                                            cursor: "bg-indigo-500 shadow-indigo-500/30",
                                        }}
                                    />
                                </div>
                            ) : null
                        }
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none border-none bg-transparent",
                            thead: "bg-slate-50 dark:bg-slate-950",
                            th: "bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-200 text-xs font-semibold py-4 uppercase tracking-wider h-12 pt-4",
                            td: "py-4 border-b border-slate-100 dark:border-slate-800/60 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/30 transition-colors",
                            tr: "group"
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="user">USER INFO</TableColumn>
                            <TableColumn key="status">STATUS</TableColumn>
                            <TableColumn key="contact">CONTACT & LOCATION</TableColumn>
                            <TableColumn key="joined">JOINED DATE</TableColumn>
                            <TableColumn key="actions" align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={items}
                            emptyContent={
                                <div className="py-16 flex flex-col justify-center items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                        <MagnifyingGlass className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-1">No customers found</h3>
                                    <p className="text-slate-500 text-sm text-center">We couldn't find any customers matching your filters or failed to load them.</p>
                                </div>
                            }
                        >
                            {(item) => (
                                <TableRow key={item._id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside" classNames={{ backdrop: "bg-slate-900/50 backdrop-blur-sm" }}>
                <ModalContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800/60 pb-4 pt-5 px-6">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {modalType === 'profile' ? 'User Profile' : `Orders — ${selectedUser?.name}`}
                                </h2>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6">
                                {selectedUser && modalType === 'profile' && (
                                    <div className="space-y-8">
                                        <div className="flex items-start md:items-center gap-5 border-b border-slate-100 dark:border-slate-800/60 pb-6">
                                            <Avatar
                                                name={selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                                                className="bg-indigo-600 text-white w-20 h-20 text-2xl shadow-lg shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate flex items-center gap-2">
                                                    {selectedUser.name || 'Unnamed User'}
                                                    {(selectedUser.role === 'admin' || selectedUser.role === 'Admin' || selectedUser.isAdmin) && (
                                                        <Tooltip content="Administrator" size="sm" color="primary">
                                                            <ShieldCheck className="text-indigo-500" weight="fill" size={20} />
                                                        </Tooltip>
                                                    )}
                                                </h3>
                                                <p className="text-slate-500 font-medium truncate">{selectedUser.email}</p>
                                                <div className="mt-2 text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex items-center text-slate-500">
                                                    ID: {selectedUser._id}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <User size={16} /> Personal Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Phone Number</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedUser.phone || 'Not provided'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                        {selectedUser.city ? `${selectedUser.city}, ${selectedUser.state}` : 'Not provided'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5"><ShieldCheck size={14} /> Account Role</span>
                                                    <div className="inline-block mt-0.5">
                                                        <Chip size="sm" color={selectedUser.isAdmin ? "primary" : "default"} variant="flat" className="font-semibold">
                                                            {selectedUser.isAdmin ? 'Administrator' : 'Customer'}
                                                        </Chip>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5"><UserPlus size={14} /> Member Since</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedUser && modalType === 'orders' && (
                                    <CustomerOrdersList userId={selectedUser._id} />
                                )}
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800/60 pb-5 px-6">
                                <Button color="primary" variant="flat" onPress={onClose} className="font-semibold">
                                    Close Window
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Block User Modal */}
            <Modal isOpen={isBlockOpen} onOpenChange={onBlockOpenChange} size="sm" classNames={{ backdrop: "bg-slate-900/50 backdrop-blur-sm" }}>
                <ModalContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <Warning className="text-red-500" size={20} weight="fill" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Block User</h2>
                            </ModalHeader>
                            <ModalBody className="py-5">
                                <p className="text-sm text-slate-600 dark:text-slate-200 mb-3">
                                    Blocking <span className="font-bold text-slate-900 dark:text-slate-100">{selectedUser?.name}</span> will prevent them from logging in or using the platform.
                                </p>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reason (optional)</label>
                                <textarea
                                    value={blockReason}
                                    onChange={e => setBlockReason(e.target.value)}
                                    placeholder="e.g. Fraudulent activity, Terms violation..."
                                    rows={3}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-base text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400/50 resize-none"
                                />
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <Button variant="light" onPress={onClose} className="font-semibold text-slate-500">Cancel</Button>
                                <Button
                                    color="danger"
                                    onPress={async () => {
                                        await handleStatusChange(selectedUser, 'block', blockReason);
                                        onClose();
                                    }}
                                    startContent={<ProhibitInset size={16} weight="bold" />}
                                    className="font-bold"
                                >
                                    Block User
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Add New Customer Modal */}
            <Modal
                isOpen={isAddOpen}
                onOpenChange={onAddOpenChange}
                size="2xl"
                classNames={{
                    backdrop: "bg-slate-900/50 backdrop-blur-sm",
                    base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl",
                    header: "border-b border-slate-100 dark:border-slate-800/60",
                    footer: "border-t border-slate-100 dark:border-slate-800/60",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            try {
                                const token = localStorage.getItem('adminToken');
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                    body: JSON.stringify(addFormData)
                                });
                                if (res.ok) {
                                    fetchUsers();
                                    onClose();
                                    setAddFormData({ name: "", email: "", phone: "", password: "", city: "", state: "" });
                                    toast.success("Customer created successfully");
                                } else {
                                    const data = await res.json();
                                    toast.error(data.message || "Failed to create customer");
                                }
                            } catch (err) {
                                toast.error("Network error");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }} className="flex flex-col">
                            <ModalHeader className="flex flex-col gap-1 py-5 px-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add New Customer</h2>
                                <p className="text-sm text-slate-500 font-normal">Register a new customer account manually.</p>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        variant="bordered"
                                        radius="xl"
                                        isRequired
                                        value={addFormData.name}
                                        onValueChange={v => setAddFormData({ ...addFormData, name: v })}
                                        startContent={<User className="text-slate-400" />}
                                        classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        variant="bordered"
                                        radius="xl"
                                        isRequired
                                        value={addFormData.email}
                                        onValueChange={v => setAddFormData({ ...addFormData, email: v })}
                                        startContent={<EnvelopeSimple className="text-slate-400" />}
                                        classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    />
                                    <Input
                                        label="Phone Number"
                                        variant="bordered"
                                        radius="xl"
                                        value={addFormData.phone}
                                        onValueChange={v => setAddFormData({ ...addFormData, phone: v })}
                                        startContent={<Phone className="text-slate-400" />}
                                        classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        variant="bordered"
                                        radius="xl"
                                        isRequired
                                        value={addFormData.password}
                                        onValueChange={v => setAddFormData({ ...addFormData, password: v })}
                                        startContent={<Key className="text-slate-400" />}
                                        classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    />
                                    <Input
                                        label="City"
                                        variant="bordered"
                                        radius="xl"
                                        value={addFormData.city}
                                        onValueChange={v => setAddFormData({ ...addFormData, city: v })}
                                        startContent={<MapPin className="text-slate-400" />}
                                        classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    />
                                    <Input
                                        label="State"
                                        variant="bordered"
                                        radius="xl"
                                        value={addFormData.state}
                                        onValueChange={v => setAddFormData({ ...addFormData, state: v })}
                                        startContent={<MapPin className="text-slate-400" />}
                                        classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter className="py-4 px-6">
                                <Button variant="light" onPress={onClose} className="font-semibold">Cancel</Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    variant="shadow"
                                    className="h-12 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                                >
                                    Create Customer
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

