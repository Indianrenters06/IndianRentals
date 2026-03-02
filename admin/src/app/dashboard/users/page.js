'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MagnifyingGlass, Funnel, DownloadSimple, PencilSimple, Trash,
    Phone, MapPin, DotsThreeVertical,
    UserPlus, ShieldCheck, User
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

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState('profile');

    const handleView = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
        onOpen();
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
            } else {
                throw new Error("API failed");
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            // Mock data fallback
            setUsers([
                { _id: "1", name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 9876543210", city: "Mumbai", state: "Maharashtra", isAdmin: true, createdAt: "2023-01-15T10:00:00Z" },
                { _id: "2", name: "Sneha Menon", email: "sneha.m@example.com", phone: "+91 9876543211", city: "Bangalore", state: "Karnataka", isAdmin: false, createdAt: "2023-03-22T14:30:00Z" },
                { _id: "3", name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 9876543212", city: "Delhi", state: "Delhi", isAdmin: false, createdAt: "2023-05-10T09:15:00Z" },
                { _id: "4", name: "Priya Desai", email: "priya.d@example.com", phone: "+91 9876543213", city: "Pune", state: "Maharashtra", isAdmin: false, createdAt: "2023-07-05T16:45:00Z" },
                { _id: "5", name: "Vikram Singh", email: "vikram.s@example.com", phone: "+91 9876543214", city: "Jaipur", state: "Rajasthan", isAdmin: false, createdAt: "2023-08-11T11:20:00Z" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        setUsers(users.filter(u => u._id !== userId));
    };

    const exportCSV = () => {
        const headers = ["Name,Email,Phone,City,State,Role,Joined\n"];
        const rows = users.map(u =>
            `${u.name},${u.email},${u.phone || ""},${u.city || ""},${u.state || ""},${u.isAdmin ? "Admin" : "Customer"},${new Date(u.createdAt).toLocaleDateString()}`
        ).join("\n");
        const blob = new Blob([headers, rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'users_report.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'all' ||
                (filterRole === 'admin' && user.isAdmin) ||
                (filterRole === 'user' && !user.isAdmin);
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, filterRole]);

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
                            className="bg-linear-to-br from-indigo-500 to-purple-500 text-white font-semibold shrink-0"
                            size="sm"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{user.name || 'Unnamed User'}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                    </div>
                );
            case "role":
                return (
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs ${user.isAdmin
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}>
                        {user.isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.isAdmin ? 'Admin' : 'Customer'}
                    </div>
                );
            case "contact":
                return (
                    <div className="flex flex-col gap-1">
                        {user.phone ? (
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <Phone className="w-3 h-3 text-indigo-500" />
                                <span>{user.phone}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-500 italic">No phone</span>
                        )}
                        {user.city ? (
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
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
            case "actions":
                return (
                    <div className="flex justify-end items-center gap-2 pr-4">
                        <Tooltip content="Edit user" color="primary" delay={0}>
                            <Button isIconOnly size="sm" variant="light" color="primary" className="text-slate-400 hover:text-indigo-400">
                                <PencilSimple className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                        <Dropdown classNames={{ content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-50 shadow-xl" }}>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <DotsThreeVertical className="w-4 h-4" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="view" startContent={<User />} onPress={() => handleView(user, 'profile')}>View Profile</DropdownItem>
                                <DropdownItem key="orders" startContent={<MapPin />} onPress={() => handleView(user, 'orders')}>View Orders</DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<Trash className="text-danger" />}
                                    onPress={() => handleDeleteUser(user._id)}
                                >
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
                        Users <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Complete directory of all registered customers and administrators.</p>
                </motion.div>
                <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={exportCSV} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold text-sm bg-indigo-50 dark:bg-indigo-500/10 hover:border-indigo-400 transition-colors">
                        <DownloadSimple className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        <UserPlus className="w-4 h-4" />
                        Add New User
                    </button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 max-w-md relative group">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all h-11"
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <Select
                                selectedKeys={[filterRole]}
                                onSelectionChange={(keys) => setFilterRole(Array.from(keys)[0])}
                                variant="bordered"
                                placeholder="All Roles"
                                startContent={<Funnel className="text-slate-400" />}
                                aria-label="Filter Roles"
                                classNames={{
                                    trigger: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-slate-200 h-11 border-1",
                                    popoverContent: "z-[100] bg-white dark:bg-slate-900"
                                }}
                            >
                                <SelectItem key="all" value="all">All Roles</SelectItem>
                                <SelectItem key="admin" value="admin">Administrators</SelectItem>
                                <SelectItem key="user" value="user">Customers</SelectItem>
                            </Select>
                        </div>
                    </div>

                    <Table
                        aria-label="Users management table"
                        bottomContent={
                            filteredUsers.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                    <span className="text-sm text-slate-500">
                                        Showing {filteredUsers.length} total users
                                    </span>
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
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
                            th: "bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold py-4 uppercase tracking-wider h-12 pt-4",
                            td: "py-4 border-b border-slate-100 dark:border-slate-800/60 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/30 transition-colors",
                            tr: "group"
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="user">USER INFO</TableColumn>
                            <TableColumn key="role">ROLE</TableColumn>
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
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-1">No users found</h3>
                                    <p className="text-slate-500 text-sm text-center">We couldn't find any users matching your filters.</p>
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" classNames={{ backdrop: "bg-slate-900/50 backdrop-blur-sm" }}>
                <ModalContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800/60 pb-4 pt-5 px-6">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {modalType === 'profile' ? 'User Profile' : 'User Orders'}
                                </h2>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6">
                                {selectedUser && modalType === 'profile' && (
                                    <div className="space-y-8">
                                        <div className="flex items-start md:items-center gap-5 border-b border-slate-100 dark:border-slate-800/60 pb-6">
                                            <Avatar
                                                name={selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                                                className="bg-linear-to-br from-indigo-500 to-purple-500 text-white w-20 h-20 text-2xl shadow-lg shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate flex items-center gap-2">
                                                    {selectedUser.name || 'Unnamed User'}
                                                    {selectedUser.isAdmin && (
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
                                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center mb-4">
                                            <MapPin className="w-8 h-8 text-indigo-400" weight="duotone" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Order History for {selectedUser.name}</h3>
                                        <p className="text-slate-500 text-sm max-w-sm">
                                            We are currently developing the specific orders timeline view for each user. It will be available here soon.
                                        </p>
                                    </div>
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
        </div>
    );
}
