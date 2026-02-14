'use client';

import { useState, useEffect } from 'react';
import {
    FiUsers, FiPackage, FiShoppingCart, FiDollarSign,
    FiTrendingUp, FiActivity, FiFilter, FiDownload
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRentals: 0,
        activeNow: 0,
        recentRentals: [],
        lowStockProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('Oct 17, 2024 - Nov 6, 2024');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setLoading(false);
        }
    };

    // Chart data for revenue overview
    const revenueChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue',
                data: [3000, 3500, 2800, 4000, 5200, 4500, 4800, 3900, 5500, 6200, 5800, 6500],
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: 'rgb(99, 102, 241)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderRadius: 8,
                titleColor: '#fff',
                bodyColor: '#fff',
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return '₹' + context.parsed.y.toLocaleString();
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9CA3AF'
                }
            },
            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                    borderDash: [5, 5]
                },
                ticks: {
                    color: '#9CA3AF',
                    callback: function (value) {
                        return '₹' + (value / 1000) + 'k';
                    }
                }
            }
        }
    };

    const StatCard = ({ title, value, change, icon: Icon, trend }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                    {change && (
                        <div className="flex items-center gap-1">
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {change}
                            </span>
                            <span className="text-xs text-gray-500">from last month</span>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600" />
                </div>
            </div>
        </div>
    );

    const LeadProgressBar = ({ stage, count, percentage }) => (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage}</span>
                <span className="text-sm font-bold text-gray-900">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );

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
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <div className="flex items-center gap-6 mt-4">
                                <button className="text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-2">
                                    Overview
                                </button>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-2">
                                    Analytics
                                </button>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-2">
                                    Reports
                                </button>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-2">
                                    Notifications
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-600">📅</span>
                                <span className="text-sm font-medium text-gray-700">{dateRange}</span>
                            </div>
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <FiDownload className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats.totalRevenue?.toLocaleString() || '45,231'}`}
                        change="+25.1%"
                        trend="up"
                        icon={FiDollarSign}
                    />
                    <StatCard
                        title="Subscriptions"
                        value={`+${stats.totalRentals || '2350'}`}
                        change="+18.3%"
                        trend="up"
                        icon={FiShoppingCart}
                    />
                    <StatCard
                        title="Total Products"
                        value={`+${stats.totalProducts || '12,234'}`}
                        change="+19%"
                        trend="up"
                        icon={FiPackage}
                    />
                    <StatCard
                        title="Active Now"
                        value={`+${stats.activeNow || '573'}`}
                        change="+6%"
                        trend="up"
                        icon={FiActivity}
                    />
                </div>

                {/* Charts and Leads Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Overview</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">₹8000</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Bar data={revenueChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Leads to Clients */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Leads-to-clients</h2>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                Visit all
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">Deploy your new project in one-click.</p>

                        <LeadProgressBar stage="Lead" count={286} percentage={83} />
                        <LeadProgressBar stage="Qualified" count={286} percentage={83} />
                        <LeadProgressBar stage="Proposal" count={286} percentage={83} />
                        <LeadProgressBar stage="Negotiation" count={286} percentage={83} />
                    </div>
                </div>

                {/* Recent Projects and To-Do Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Projects */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Rentals</h2>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <FiFilter className="w-4 h-4" />
                                    Filter Projects...
                                </button>
                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                    View
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.recentRentals?.slice(0, 5).map((rental, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-medium text-gray-900">{rental.user?.name || 'Customer'}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                                    {rental.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                                    High
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* To-Do Lists */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">To-do lists</h2>
                        <p className="text-sm text-gray-600 mb-6">Manage your todays works here.</p>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Strictly Necessary</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-600">These cookies are essential in order to use the website and use its features.</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-600">These cookies allow the website to provide personalized functionality.</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Performance Cookies</h3>
                                    <label className="relative inline-flex items-cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-600">These cookies help to improve the performance of the website.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
