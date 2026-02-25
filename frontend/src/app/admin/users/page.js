'use client';

import { useState, useEffect } from 'react';
import {
    FiSearch, FiFilter, FiDownload, FiEdit2, FiTrash2,
    FiMail, FiPhone, FiMapPin, FiCalendar, FiMoreVertical
} from 'react-icons/fi';
import {
    Input,
    Select,
    SelectItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Avatar,
    Chip
} from "@heroui/react";

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
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
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' ||
            (filterRole === 'admin' && user.isAdmin) ||
            (filterRole === 'user' && !user.isAdmin);
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage all registered users</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="bordered" startContent={<FiDownload className="w-4 h-4" />}>
                                Export Users
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1 max-w-md relative">
                            <Input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                startContent={<FiSearch className="text-gray-400 w-5 h-5 pointer-events-none" />}
                                classNames={{
                                    inputWrapper: "bg-white border-1 border-gray-300 shadow-none",
                                }}
                            />
                        </div>
                        <Select
                            selectedKeys={[filterRole]}
                            onSelectionChange={(keys) => setFilterRole(Array.from(keys)[0])}
                            className="w-48"
                            aria-label="Filter Roles"
                            classNames={{
                                trigger: "bg-white border-1 border-gray-300 shadow-none",
                            }}
                        >
                            <SelectItem key="all" value="all">All Roles</SelectItem>
                            <SelectItem key="admin" value="admin">Admins</SelectItem>
                            <SelectItem key="user" value="user">Users</SelectItem>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <Card key={user._id} className="shadow-sm border-none p-2 bg-white hover:shadow-md transition-shadow">
                            {/* User Header */}
                            <CardHeader className="flex items-start justify-between pb-0">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        name={user.name?.charAt(0).toUpperCase() || 'U'}
                                        classNames={{
                                            base: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold",
                                        }}
                                        size="md"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user.name || 'Unnamed User'}</h3>
                                        <Chip
                                            size="sm"
                                            color={user.isAdmin ? "secondary" : "primary"}
                                            variant="flat"
                                        >
                                            {user.isAdmin ? 'Admin' : 'User'}
                                        </Chip>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Button isIconOnly variant="light" size="sm">
                                        <FiMoreVertical className="w-5 h-5 text-gray-500" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* User Details */}
                            <CardBody className="space-y-3 pt-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FiMail className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiPhone className="w-4 h-4 text-gray-400" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                {user.city && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiMapPin className="w-4 h-4 text-gray-400" />
                                        <span>{user.city}, {user.state || 'India'}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FiCalendar className="w-4 h-4 text-gray-400" />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardBody>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-2 px-3 pb-3 border-t border-gray-100 pt-4">
                                <Button className="flex-1 text-indigo-600 bg-indigo-50 font-medium" onPress={() => { }} startContent={<FiEdit2 />}>
                                    Edit
                                </Button>
                                <Button
                                    className="flex-1 text-red-600 bg-red-50 font-medium"
                                    onPress={() => handleDeleteUser(user._id)}
                                    startContent={<FiTrash2 />}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
