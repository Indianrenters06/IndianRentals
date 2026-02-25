'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    FiSearch, FiFilter, FiDownload, FiEdit2, FiTrash2,
    FiMail, FiPhone, FiMapPin, FiCalendar, FiMoreVertical,
    FiUserPlus, FiShield, FiUser
} from 'react-icons/fi';
import {
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
    Spinner
} from "@heroui/react";

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            // In our mock dashboard, we'll populate mock users until the backend is fully wired.
            // If API fails, fall back to stunning mock data.
            try {
                const response = await fetch('http://localhost:5000/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setUsers(data);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("API not reachable, falling back to mock users data");
            }

            // Mock data fallback
            setUsers([
                { _id: "1", name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 9876543210", city: "Mumbai", state: "Maharashtra", isAdmin: true, createdAt: "2023-01-15T10:00:00Z" },
                { _id: "2", name: "Sneha Menon", email: "sneha.m@example.com", phone: "+91 9876543211", city: "Bangalore", state: "Karnataka", isAdmin: false, createdAt: "2023-03-22T14:30:00Z" },
                { _id: "3", name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 9876543212", city: "Delhi", state: "Delhi", isAdmin: false, createdAt: "2023-05-10T09:15:00Z" },
                { _id: "4", name: "Priya Desai", email: "priya.d@example.com", phone: "+91 9876543213", city: "Pune", state: "Maharashtra", isAdmin: false, createdAt: "2023-07-05T16:45:00Z" },
                { _id: "5", name: "Vikram Singh", email: "vikram.s@example.com", phone: "+91 9876543214", city: "Jaipur", state: "Rajasthan", isAdmin: false, createdAt: "2023-08-11T11:20:00Z" },
                { _id: "6", name: "Neha Gupta", email: "neha.g@example.com", phone: "+91 9876543215", city: "Chennai", state: "Tamil Nadu", isAdmin: false, createdAt: "2023-09-30T08:00:00Z" },
                { _id: "7", name: "Ravi Patel", email: "ravi.p@example.com", phone: "+91 9876543216", city: "Ahmedabad", state: "Gujarat", isAdmin: false, createdAt: "2023-11-12T13:10:00Z" },
                { _id: "8", name: "Anjali Rao", email: "anjali.r@example.com", phone: "+91 9876543217", city: "Hyderabad", state: "Telangana", isAdmin: false, createdAt: "2024-01-05T15:25:00Z" },
                { _id: "9", name: "Karan Johar", email: "karan.j@example.com", phone: "+91 9876543218", city: "Mumbai", state: "Maharashtra", isAdmin: false, createdAt: "2024-02-18T10:50:00Z" }
            ]);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchUsers();
            } else {
                // If API fails, just remove from local state for mock testing
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setUsers(users.filter(u => u._id !== userId));
        }
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
                            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold shrink-0"
                            size="sm"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight text-white">{user.name || 'Unnamed User'}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                    </div>
                );
            case "role":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={user.isAdmin ? "secondary" : "default"}
                        startContent={user.isAdmin ? <FiShield className="w-3 h-3 ml-1" /> : <FiUser className="w-3 h-3 ml-1" />}
                        className="font-medium bg-secondary-500/10 text-secondary-400"
                    >
                        {user.isAdmin ? 'Admin' : 'Customer'}
                    </Chip>
                );
            case "contact":
                return (
                    <div className="flex flex-col gap-1">
                        {user.phone ? (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <FiPhone className="w-3 h-3 text-indigo-400" />
                                <span>{user.phone}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-500 italic">No phone</span>
                        )}
                        {user.city ? (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <FiMapPin className="w-3 h-3 text-indigo-400" />
                                <span>{user.city}, {user.state || 'India'}</span>
                            </div>
                        ) : null}
                    </div>
                );
            case "joined":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-300">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Tooltip content="Edit user" color="primary" delay={0}>
                            <Button isIconOnly size="sm" variant="light" color="primary" className="text-slate-400 hover:text-indigo-400">
                                <FiEdit2 className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-slate-300">
                                    <FiMoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="view" startContent={<FiUser />} className="text-slate-300">View Profile</DropdownItem>
                                <DropdownItem key="orders" startContent={<FiMapPin />} className="text-slate-300">View Orders</DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<FiTrash2 className="text-danger" />}
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
            <div className="flex items-center justify-center h-[80vh] w-full bg-slate-900/40">
                <Spinner size="lg" color="primary" label="Loading Users Data..." classNames={{ label: "text-slate-400 mt-4" }} />
            </div>
        );
    }

    return (
        <div className="bg-slate-900/40 min-h-[calc(100vh-80px)] w-full">
            {/* Header section with glassmorphism */}
            <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Users Management</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        A complete directory of all registered customers and administrators.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button color="secondary" variant="flat" startContent={<FiDownload className="w-4 h-4" />} className="font-semibold bg-indigo-500/10 text-indigo-400 border-none">
                        Export CSV
                    </Button>
                    <Button color="primary" variant="shadow" startContent={<FiUserPlus className="w-4 h-4" />} className="font-semibold shadow-indigo-500/30">
                        Add New User
                    </Button>
                </div>
            </div>

            <div className="px-8 pb-10 max-w-[1600px] mx-auto w-full">
                <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
                    {/* Filters Row */}
                    <div className="px-6 py-5 bg-slate-900/50 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 max-w-md">
                            <Input
                                isClearable
                                className="w-full"
                                placeholder="Search by name or email..."
                                startContent={<FiSearch className="text-slate-500" />}
                                value={searchTerm}
                                onClear={() => setSearchTerm('')}
                                onValueChange={setSearchTerm}
                                variant="bordered"
                                color="primary"
                                classNames={{
                                    inputWrapper: "border-slate-700 bg-slate-950/50 text-slate-200"
                                }}
                            />
                        </div>
                        <Select
                            className="w-full sm:w-48"
                            selectedKeys={[filterRole]}
                            onSelectionChange={(keys) => setFilterRole(Array.from(keys)[0])}
                            variant="bordered"
                            color="primary"
                            startContent={<FiFilter className="text-slate-500" />}
                            aria-label="Filter Roles"
                            classNames={{
                                trigger: "border-slate-700 bg-slate-950/50 text-slate-200"
                            }}
                        >
                            <SelectItem key="all" value="all" className="text-slate-300">All Roles</SelectItem>
                            <SelectItem key="admin" value="admin" className="text-slate-300">Administrators</SelectItem>
                            <SelectItem key="user" value="user" className="text-slate-300">Customers</SelectItem>
                        </Select>
                    </div>

                    <Table
                        aria-label="Users management table"
                        bottomContent={
                            filteredUsers.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-800/80 bg-slate-950/30">
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
                            table: "min-w-full w-full",
                            thead: "bg-slate-950",
                            th: "bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold py-4 uppercase tracking-wider",
                            td: "py-4 border-b border-slate-800/50 group-hover:bg-slate-800/30 transition-colors",
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
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                                        <FiSearch className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-200 mb-1">No users found</h3>
                                    <p className="text-slate-500 text-sm">We couldn't find any users matching your filters.</p>
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
                </div>
            </div>
        </div>
    );
}
