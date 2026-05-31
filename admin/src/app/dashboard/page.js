"use client";
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users, TrendUp, TrendDown, CurrencyInr,
  Package, ShoppingCart, ArrowRight, Zap,
  ChartLineUp, Clock, CheckCircle, DotsThreeVertical, DownloadSimple,
  Bell, WarningCircle, UserCheck, ShieldCheck
} from "@phosphor-icons/react";
import { downloadPDFInvoice } from "@/utils/pdfInvoice";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Spinner,
  Avatar,
  AvatarGroup,
  Progress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider
} from "@heroui/react";

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
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS modules
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
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();

  const [adminName, setAdminName] = useState("Admin");
  const [sortDescriptor, setSortDescriptor] = useState({ column: 'date', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedInfo = localStorage.getItem("adminInfo");
      if (storedInfo) {
        try {
          const parsed = JSON.parse(storedInfo);
          setAdminName(parsed.user?.name || parsed.name || "Admin");
        } catch (e) { }
      }
    }
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard stats");

        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

  // Derived stats using Real Data
  const stats = [
    { label: "Total Revenue", value: `₹${parseFloat(dashboardData?.totalRevenue || 0).toLocaleString()}`, change: "0%", isPositive: true, icon: CurrencyInr, color: "success" },
    { label: "Total Orders", value: (dashboardData?.totalRentals || 0).toLocaleString(), change: "0%", isPositive: true, icon: Package, color: "primary" },
    { label: "Active Users", value: (dashboardData?.activeNow || 0).toLocaleString(), change: "0%", isPositive: true, icon: Users, color: "secondary" },
    { label: "Pending KYC", value: (dashboardData?.pendingKYC || 0).toLocaleString(), change: "0%", isPositive: false, icon: ShieldCheck, color: "warning" },
  ];

  const recentRentals = dashboardData?.recentRentals?.map(rental => ({
    id: `RNT-${rental._id.toString().slice(-4).toUpperCase()}`,
    user: rental.user?.name || "Guest User",
    item: "Rental Order", // Backend stats API doesn't deeply populate product names inside recentRentals yet
    amount: `₹${parseFloat(rental.totalPrice || 0).toLocaleString()}`,
    status: rental.status || (rental.isPaid ? 'Active' : 'Pending'),
    date: new Date(rental.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" }),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rental.user?.name || "G")}&background=random`,
    _raw: rental
  })) || [];

  const sortedRentals = [...recentRentals].sort((a, b) => {
    const col = sortDescriptor.column;
    let aVal, bVal;
    if (col === 'amount') {
      aVal = parseFloat((a.amount || '').replace(/[₹,]/g, ''));
      bVal = parseFloat((b.amount || '').replace(/[₹,]/g, ''));
    } else if (col === 'date') {
      aVal = new Date(a._raw?.createdAt || 0).getTime();
      bVal = new Date(b._raw?.createdAt || 0).getTime();
    } else {
      aVal = (a[col] || '').toLowerCase();
      bVal = (b[col] || '').toLowerCase();
    }
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDescriptor.direction === 'ascending' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRentals.length / rowsPerPage));
  const paginatedRentals = sortedRentals.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Chart configurations
  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#818cf8', // Indigo 400
        backgroundColor: 'rgba(129, 140, 248, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#818cf8',
        borderWidth: 3,
      }
    ]
  };

  const activityChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Customers',
        data: [0, 0, 0, 0],
        backgroundColor: '#a78bfa', // Purple 400
        borderRadius: 6,
      },
      {
        label: 'New Rentals',
        data: [0, 0, 0, 0],
        backgroundColor: '#34d399', // Emerald 400
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(51, 65, 85, 0.2)',
          tickLength: 0,
        },
        ticks: {
          color: '#64748b',
          font: { family: "'Outfit', sans-serif", size: 12 }
        },
        border: { display: false }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: { family: "'Outfit', sans-serif", size: 12 }
        },
        border: { display: false }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case 'Active': return <Chip size="sm" color="success" variant="flat" startContent={<CheckCircle weight="bold" className="ml-1" />}>Active</Chip>;
      case 'Pending': return <Chip size="sm" color="warning" variant="flat" startContent={<Clock weight="bold" className="ml-1" />}>Pending</Chip>;
      case 'Overdue': return <Chip size="sm" color="danger" variant="flat" startContent={<ChartLineUp weight="bold" className="ml-1" />}>Overdue</Chip>;
      case 'Completed': return <Chip size="sm" color="default" variant="flat">Completed</Chip>;
      default: return <Chip size="sm" color="default" variant="flat">{status}</Chip>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <Spinner size="lg" color="secondary" label="Loading Dashboard Context..." classNames={{ label: "text-slate-400 mt-4" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">

      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{adminName}</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-100">Here's what's happening with your rental business today.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <Button
            variant="bordered"
            className="rounded-xl font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors h-10 px-4"
            startContent={<DownloadSimple className="w-4 h-4" />}
            onPress={() => window.location.href = '/dashboard/reports/revenue'}
          >
            Generate Report
          </Button>
          <Button
            color="primary"
            variant="shadow"
            className="rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 h-12 px-8 transition-all"
            onPress={() => window.location.href = '/dashboard/orders'}
          >
            + New Order
          </Button>
        </motion.div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full">
                <CardBody className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-slate-500 dark:text-slate-200 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-400`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className={`flex items-center font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.label === "Pending KYC" ? (
                        stat.isPositive ? <CheckCircle weight="bold" className="mr-1" /> : <WarningCircle weight="bold" className="mr-1" />
                      ) : (
                        stat.isPositive ? <TrendUp weight="bold" className="mr-1" /> : <TrendDown weight="bold" className="mr-1" />
                      )}
                      {stat.change}
                    </span>
                    {stat.label !== "Pending KYC" && <span className="text-slate-500 dark:text-slate-300">vs last month</span>}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full w-full relative overflow-hidden transition-colors duration-300">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

            <CardHeader className="flex justify-between items-center px-6 py-5 border-b border-slate-200 dark:border-slate-800/60">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-200 font-medium">Weekly earnings and projections</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip size="sm" variant="flat" color="default" className="text-slate-600 dark:text-slate-300">This Week</Chip>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm" className="text-slate-600 dark:text-slate-200"><DotsThreeVertical weight="bold" /></Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Chart Actions">
                    <DropdownItem key="monthly">View Monthly</DropdownItem>
                    <DropdownItem key="yearly">View Yearly</DropdownItem>
                    <DropdownItem key="export">Export Data</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-6 overflow-hidden">
              <div className="h-[280px] w-full">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Activity Breakdown & Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full w-full transition-colors duration-300">
            <CardHeader className="px-6 py-5 border-b border-slate-200 dark:border-slate-800/60 flex justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                  <WarningCircle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Alerts</h3>
              </div>
              <Chip size="sm" color="warning" variant="flat" className="font-semibold">{dashboardData?.recentNotifications?.length || 0} New</Chip>
            </CardHeader>
            <CardBody className="px-6 py-5 flex flex-col gap-4">
              {dashboardData?.recentNotifications && dashboardData.recentNotifications.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentNotifications.map((note, i) => (
                    <div key={i} className="flex gap-3 items-start group">
                      <div className={`mt-1 p-1.5 rounded-md ${note.type === 'order' ? 'bg-indigo-500/10 text-indigo-500' :
                        note.type === 'kyc' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-slate-500/10 text-slate-500'
                        }`}>
                        {note.type === 'order' ? <Package className="w-3.5 h-3.5" /> :
                          note.type === 'kyc' ? <ShieldCheck className="w-3.5 h-3.5" /> :
                            <Bell className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 line-clamp-1">{note.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-200 line-clamp-1">{note.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{(() => { const d = new Date(note.createdAt); const today = new Date(); const isToday = d.toDateString() === today.toDateString(); return isToday ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); })()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-slate-500">
                  <CheckCircle className="w-8 h-8 opacity-20 mb-2" weight="bold" />
                  <p className="text-sm">All systems clear!</p>
                </div>
              )}

              <Divider className="my-2 bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-700 dark:text-white font-medium">Pending Approvals</span>
                    <span className="text-sm text-slate-600 dark:text-slate-200 font-medium">{dashboardData?.pendingKYC || 0} Accounts</span>
                  </div>
                  <Progress
                    value={dashboardData?.pendingKYC > 0 ? (dashboardData.pendingKYC / (dashboardData.totalUsers || 1)) * 100 : 0}
                    color="warning"
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-700 dark:text-white font-medium">Inventory Health</span>
                    <span className="text-sm text-slate-600 dark:text-slate-200 font-medium">92%</span>
                  </div>
                  <Progress value={92} color="success" className="h-2" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Recent Rentals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full overflow-hidden transition-colors duration-300">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 gap-4 bg-slate-50 dark:bg-slate-900/50">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Rentals</h3>
              <p className="text-sm text-slate-500 dark:text-slate-100">Latest activity across all your customers.</p>
            </div>
            <div className="flex items-center gap-3">
              <AvatarGroup isBordered max={3} size="sm" className="hidden sm:flex">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              </AvatarGroup>
              <Button 
                size="sm" 
                variant="flat" 
                color="primary" 
                className="font-medium !bg-indigo-50 dark:!bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                onPress={() => router.push("/dashboard/orders")}
              >
                View All
              </Button>
            </div>
          </CardHeader>

          <Table
            aria-label="Recent Rentals Table"
            sortDescriptor={sortDescriptor}
            onSortChange={(d) => { setSortDescriptor(d); setCurrentPage(1); }}
            classNames={{
              wrapper: "p-0 rounded-none shadow-none bg-transparent m-0",
              table: "w-full min-w-full",
              thead: "bg-slate-100 dark:bg-slate-950",
              th: "text-slate-500 dark:text-slate-300 font-semibold uppercase text-xs tracking-wider py-4 border-b border-slate-200 dark:border-slate-800 cursor-pointer select-none",
              td: "py-4 border-b border-slate-100 dark:border-slate-800/50",
              tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
            }}
          >
            <TableHeader>
              <TableColumn key="user" allowsSorting>CUSTOMER</TableColumn>
              <TableColumn key="item">PRODUCT</TableColumn>
              <TableColumn key="status" allowsSorting>STATUS</TableColumn>
              <TableColumn key="date" allowsSorting>DATE & TIME</TableColumn>
              <TableColumn key="amount" allowsSorting align="end">AMOUNT</TableColumn>
              <TableColumn key="actions" align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody items={paginatedRentals} emptyContent={<div className="py-8 text-slate-500 dark:text-slate-200 text-sm text-center">No rentals found</div>}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={item.avatar} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.user}</span>
                        <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700 dark:text-white font-medium">{item.item}</span>
                  </TableCell>
                  <TableCell>
                    {renderStatusChip(item.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-500 dark:text-slate-200">{item.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.amount}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light" className="text-slate-500 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-200">
                            <DotsThreeVertical weight="bold" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Table Actions" variant="flat">
                          <DropdownItem key="view" onPress={() => router.push(`/dashboard/orders`)}>View Details</DropdownItem>
                          <DropdownItem key="edit" onPress={() => toast.error("Order editing logic will be implemented soon.")}>Edit Order</DropdownItem>
                          <DropdownItem key="invoice" onPress={() => downloadPDFInvoice(item._raw)}>Download Invoice</DropdownItem>
                          <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => toast.success("Requesting order cancellation...")}>Cancel Rental</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-sm text-slate-500 dark:text-slate-300">
              {sortedRentals.length === 0
                ? 'No entries'
                : `Showing ${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, sortedRentals.length)} of ${sortedRentals.length} entries`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={currentPage === 1}
                  onPress={() => setCurrentPage(p => p - 1)}
                  className="font-medium text-slate-600 dark:text-slate-200"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'solid' : 'flat'}
                    color={currentPage === page ? 'primary' : 'default'}
                    onPress={() => setCurrentPage(page)}
                    className={currentPage === page ? '!bg-indigo-600 text-white font-bold min-w-9' : 'text-slate-600 dark:text-slate-200 min-w-9'}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={currentPage === totalPages}
                  onPress={() => setCurrentPage(p => p + 1)}
                  className="font-medium text-slate-600 dark:text-slate-200"
                >
                  Next
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
