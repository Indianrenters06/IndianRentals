"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUsers, FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiPackage, FiShoppingCart, FiArrowRight, FiZap,
  FiActivity, FiClock, FiCheckCircle, FiMoreVertical, FiDownload
} from "react-icons/fi";
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
  DropdownItem
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

  useEffect(() => {
    // Simulate initial load for 'wow' animation effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Detailed mock data
  const stats = [
    { label: "Total Revenue", value: "₹2,14,500", change: "+12.5%", isPositive: true, icon: FiDollarSign, color: "success" },
    { label: "Active Rentals", value: "384", change: "+18.1%", isPositive: true, icon: FiPackage, color: "primary" },
    { label: "Pending KYC", value: "42", change: "-5.2%", isPositive: false, icon: FiUsers, color: "warning" },
    { label: "Inventory Used", value: "68%", change: "+2.4%", isPositive: true, icon: FiActivity, color: "secondary" },
  ];

  const recentRentals = [
    { id: "RNT-1092", user: "Rahul Sharma", item: "MacBook Pro M3", amount: "₹8,500", status: "Active", date: "Today, 10:45 AM", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    { id: "RNT-1091", user: "Sneha Menon", item: "Sony A7IV Camera Kit", amount: "₹4,200", status: "Pending", date: "Today, 09:15 AM", avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
    { id: "RNT-1090", user: "Amit Kumar", item: "Dell UltraSharp 32\"", amount: "₹1,800", status: "Overdue", date: "Yesterday", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    { id: "RNT-1089", user: "Priya Desai", item: "iPad Pro 12.9\"", amount: "₹3,100", status: "Completed", date: "Yesterday", avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
    { id: "RNT-1088", user: "Vikram Singh", item: "DJI Mavic 3 Drone", amount: "₹12,400", status: "Active", date: "Oct 24", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
  ];

  // Chart configurations
  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [15000, 22000, 18000, 29000, 24000, 38000, 32000],
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
        label: 'New Users',
        data: [120, 150, 180, 210],
        backgroundColor: '#a78bfa', // Purple 400
        borderRadius: 6,
      },
      {
        label: 'New Rentals',
        data: [80, 110, 140, 170],
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
      case 'Active': return <Chip size="sm" color="success" variant="flat" startContent={<FiCheckCircle className="ml-1" />}>Active</Chip>;
      case 'Pending': return <Chip size="sm" color="warning" variant="flat" startContent={<FiClock className="ml-1" />}>Pending</Chip>;
      case 'Overdue': return <Chip size="sm" color="danger" variant="flat" startContent={<FiActivity className="ml-1" />}>Overdue</Chip>;
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
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Admin</span> 👋
          </h1>
          <p className="text-slate-400">Here's what's happening with your rental business today.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <Button color="secondary" variant="flat" startContent={<FiDownload className="w-4 h-4" />}>
            Generate Report
          </Button>
          <Button color="primary" variant="shadow" className="shadow-indigo-500/30 font-medium">
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
              <Card className="bg-slate-900 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors w-full">
                <CardBody className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-bold tracking-tight text-slate-100">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-400`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className={`flex items-center font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                      {stat.change}
                    </span>
                    <span className="text-slate-500">vs last month</span>
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
          <Card className="bg-slate-900 border border-slate-800 h-full w-full relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

            <CardHeader className="flex justify-between items-center px-6 py-5 border-b border-slate-800/60">
              <div>
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <p className="text-sm text-slate-400 font-medium">Weekly earnings and projections</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip size="sm" variant="flat" color="default" className="text-slate-300">This Week</Chip>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm" className="text-slate-400"><FiMoreVertical /></Button>
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
          <Card className="bg-slate-900 border border-slate-800 h-full w-full">
            <CardHeader className="px-6 py-5 border-b border-slate-800/60 flex justify-between">
              <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
            </CardHeader>
            <CardBody className="px-6 py-5 flex flex-col gap-6">
              <div className="h-[180px] w-full">
                <Bar data={activityChartData} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { display: false } } }} />
              </div>

              <div className="mt-2 space-y-4 flex-1">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300 font-medium">Storage Quota</span>
                    <span className="text-sm text-slate-400 font-medium">820 / 1000 GB</span>
                  </div>
                  <Progress value={82} color="secondary" className="h-2" classNames={{ indicator: "bg-gradient-to-r from-purple-500 to-indigo-500" }} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300 font-medium">Inventory Health</span>
                    <span className="text-sm text-slate-400 font-medium">92%</span>
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
        <Card className="bg-slate-900 border border-slate-800 w-full overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 gap-4 bg-slate-900/50">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Rentals</h3>
              <p className="text-sm text-slate-400">Latest activity across all your users.</p>
            </div>
            <div className="flex items-center gap-3">
              <AvatarGroup isBordered max={3} size="sm" className="hidden sm:flex">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              </AvatarGroup>
              <Button size="sm" variant="flat" color="primary" className="font-medium bg-indigo-500/10 text-indigo-400">View All</Button>
            </div>
          </CardHeader>

          <Table
            aria-label="Recent Rentals Table"
            classNames={{
              wrapper: "p-0 rounded-none shadow-none bg-transparent m-0",
              table: "w-full min-w-full",
              thead: "bg-slate-950",
              th: "text-slate-400 font-semibold uppercase text-xs tracking-wider py-4 border-b border-slate-800",
              td: "py-4 border-b border-slate-800/50",
              tr: "hover:bg-slate-800/30 transition-colors group"
            }}
          >
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATE & TIME</TableColumn>
              <TableColumn align="end">AMOUNT</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody items={recentRentals}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={item.avatar} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{item.user}</span>
                        <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-300 font-medium">{item.item}</span>
                  </TableCell>
                  <TableCell>
                    {renderStatusChip(item.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-400">{item.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-slate-200">{item.amount}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-200">
                            <FiMoreVertical />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Table Actions" variant="flat">
                          <DropdownItem key="view">View Details</DropdownItem>
                          <DropdownItem key="edit">Edit Order</DropdownItem>
                          <DropdownItem key="invoice">Download Invoice</DropdownItem>
                          <DropdownItem key="delete" className="text-danger" color="danger">Cancel Rental</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </div>
  );
}
