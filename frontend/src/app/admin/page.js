'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated and is admin
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        // Check if user has token and is admin
        if (!userInfo.token) {
            // Not logged in - redirect to login
            router.push('/login');
        } else if (!userInfo.isAdmin && userInfo.role !== 'admin') {
            // Logged in but not admin - redirect to home
            alert('Access denied. Admin privileges required.');
            router.push('/');
        } else {
            // Logged in as admin - redirect to dashboard
            router.push('/admin/dashboard');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        </div>
    );
}
