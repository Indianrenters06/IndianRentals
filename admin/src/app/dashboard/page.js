"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, ArrowRight, Zap } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Grid,
  Spinner,
} from "@heroui/react";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Revenue",
      value: "₹2,14,500",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Active Users",
      value: "1,452",
      change: "+5.2%",
      icon: Users,
      color: "text-indigo-400 bg-indigo-400/10",
      borderColor: "border-indigo-400/20",
    },
    {
      label: "Orders This Month",
      value: "384",
      change: "+18.1%",
      icon: ShoppingCart,
      color: "text-blue-400 bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      label: "Products Rented",
      value: "89",
      change: "-2.4%",
      icon: Package,
      color: "text-rose-400 bg-rose-400/10",
      borderColor: "border-rose-400/20",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-1092",
      customer: "Rahul S.",
      product: "MacBook Pro M3",
      status: "Active",
      amount: "₹8,500/m",
      statusColor: "success",
    },
    {
      id: "ORD-1091",
      customer: "Sneha M.",
      product: "Sony A7IV Lens Kit",
      status: "Pending",
      amount: "₹4,200/m",
      statusColor: "warning",
    },
    {
      id: "ORD-1090",
      customer: "Amit K.",
      product: "Dell UltraSharp 32",
      status: "Returned",
      amount: "₹1,800/m",
      statusColor: "default",
    },
    {
      id: "ORD-1089",
      customer: "Priya D.",
      product: "iPad Pro 12.9\"",
      status: "Active",
      amount: "₹3,100/m",
      statusColor: "success",
    },
  ];

  const quickActions = [
    { label: "Add New Product", icon: Package, color: "text-indigo-400" },
    { label: "Manage Users", icon: Users, color: "text-purple-400" },
    { label: "View Financial Report", icon: DollarSign, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <CardBody className="overflow-visible py-4 gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-bold mt-2 text-slate-100">{stat.value}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} border ${stat.borderColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm gap-2">
                    <span className={`flex items-center font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {stat.change}
                    </span>
                    <span className="text-slate-500">from last month</span>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
            <CardHeader className="flex justify-between items-center pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Recent Orders</h2>
                <p className="text-sm text-slate-400 mt-1">Latest rental transactions</p>
              </div>
              <Button
                isIconOnly
                variant="light"
                className="text-indigo-400 hover:text-indigo-300"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardBody>
              <Table
                aria-label="Recent orders table"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  table: "text-slate-300",
                  thead: "[&>tr]:first:shadow-none",
                  th: "bg-slate-900/50 text-slate-400 font-medium border-b border-slate-700",
                  tr: "hover:bg-slate-700/20 transition-colors border-b border-slate-700/50",
                  td: "py-4 text-slate-300",
                }}
              >
                <TableHeader>
                  <TableColumn key="id" className="w-24">
                    Order ID
                  </TableColumn>
                  <TableColumn key="customer">Customer</TableColumn>
                  <TableColumn key="product">Product</TableColumn>
                  <TableColumn key="status" className="w-28">
                    Status
                  </TableColumn>
                  <TableColumn key="amount" className="text-right w-32">
                    Amount
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-slate-200">{row.id}</TableCell>
                      <TableCell className="text-slate-400">{row.customer}</TableCell>
                      <TableCell className="text-slate-300">{row.product}</TableCell>
                      <TableCell>
                        <Chip
                          variant="flat"
                          color={row.statusColor}
                          size="sm"
                          className="font-medium capitalize"
                        >
                          {row.status}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-200">{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-indigo-500/20 h-full">
            <CardHeader className="flex flex-col gap-2 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              </div>
            </CardHeader>
            <CardBody className="gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={i}
                    className="w-full justify-start bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 hover:text-white transition-all h-auto py-3"
                    variant="flat"
                  >
                    <Icon className={`w-5 h-5 mr-3 ${action.color}`} />
                    <span className="font-medium text-sm">{action.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-slate-300" />
                  </Button>
                );
              })}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Additional Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-slate-100">Performance Metrics</h2>
            <p className="text-sm text-slate-400 mt-1">Key indicators for this month</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Avg. Rental Duration", value: "24 days", icon: "📅" },
                { label: "Customer Satisfaction", value: "94.2%", icon: "⭐" },
                { label: "Return Rate", value: "3.2%", icon: "📊" },
              ].map((metric, i) => (
                <div key={i} className="text-center p-4 rounded-xl border border-slate-700/30 bg-slate-900/20">
                  <p className="text-2xl mb-2">{metric.icon}</p>
                  <p className="text-slate-400 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-100 mt-2">{metric.value}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
