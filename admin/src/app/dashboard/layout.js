"use client";

import { useState, useEffect } from "react";
import { Link } from "@heroui/react";
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  House, Users, Package, ShoppingCart, FileText,
  CreditCard, Calendar, Gear, CaretRight, CaretDown, CaretLeft,
  MagnifyingGlass, Bell, Sun, Moon, List, SignOut, ShieldCheck,
  Layout, Cube, Tag, ChartBar, ChatCenteredText
} from '@phosphor-icons/react';

import { useRouter } from "next/navigation";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [adminInfo, setAdminInfo] = useState({ name: 'Admin', role: 'admin', adminPermissions: [] });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/alerts`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }

      const countRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/alerts/unread-count`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        setUnreadCount(countData.count);
      }
    } catch (error) {
      // Intentionally omitting console.error to prevent Turbopack dev-overlay popups for generic disconnects
      console.log("Failed to load notifications", error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/alerts/read-all`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.log("Failed to mark all as read", error.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/alerts/${id}/read`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.log("Failed to mark as read", error.message);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedInfo = localStorage.getItem("adminInfo");
      if (storedInfo) {
        try {
          const parsed = JSON.parse(storedInfo);
          setAdminInfo(parsed.user || parsed);
        } catch (err) {
          console.error("Failed to parse admin data", err);
        }
      }

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Permission-aware menu items — each top-level item has a `permission` key
  // that maps to an adminPermissions value. Admins see everything; staff see only their sections.
  const isAdmin = adminInfo?.role === 'admin';
  const perms = adminInfo?.adminPermissions || [];
  const can = (section) => isAdmin || perms.includes(section);

  // Map URL prefixes to required permission keys
  const PATH_PERMISSION_MAP = [
    { prefix: '/dashboard/cms', permission: 'cms' },
    { prefix: '/dashboard/products', permission: 'products' },
    { prefix: '/dashboard/inventory', permission: 'inventory' },
    { prefix: '/dashboard/customers', permission: 'users' },
    { prefix: '/dashboard/kyc', permission: 'kyc' },
    { prefix: '/dashboard/orders', permission: 'orders' },
    { prefix: '/dashboard/payments', permission: 'payments' },
    { prefix: '/dashboard/coupons', permission: 'coupons' },
    { prefix: '/dashboard/reports', permission: 'reports' },
    { prefix: '/dashboard/notifications', permission: 'notifications' },
    { prefix: '/dashboard/settings', permission: 'settings' },
  ];

  // Guard: redirect staff away from sections they don't have permission for
  useEffect(() => {
    if (!adminInfo || adminInfo.role === 'admin') return; // admins pass freely
    if (adminInfo.role !== 'staff') return;

    const matched = PATH_PERMISSION_MAP.find(({ prefix }) => pathname?.startsWith(prefix));
    if (matched && !perms.includes(matched.permission)) {
      router.replace('/dashboard');
    }
  }, [pathname, adminInfo]);

  // Determine if current page is blocked for this user (for inline fallback)
  const isBlocked = (() => {
    if (!adminInfo || adminInfo.role === 'admin') return false;
    if (adminInfo.role !== 'staff') return false;
    const matched = PATH_PERMISSION_MAP.find(({ prefix }) => pathname?.startsWith(prefix));
    return matched ? !perms.includes(matched.permission) : false;
  })();

  const allMenuItems = [
    { name: 'Dashboard', icon: House, path: '/dashboard' },
    {
      name: 'CMS', icon: Layout, path: '/dashboard/cms', permission: 'cms',
      submenu: [
        { name: 'Homepage', path: '/dashboard/cms/homepage' },
        { name: 'Global Layout', path: '/dashboard/cms/layout' },
        { name: 'Blog', path: '/dashboard/cms/blog' },
        { name: 'Categories Page', path: '/dashboard/cms/categories-page' },
        { name: 'Product Page', path: '/dashboard/cms/product-page' },
        { name: '🖼️ Category Images', path: '/dashboard/cms/category-images' },
        { name: 'Static Pages', path: '/dashboard/cms/pages' },
        { name: '❓ Product FAQs', path: '/dashboard/cms/faq' },
      ]
    },
    {
      name: 'Products', icon: Package, path: '/dashboard/products', permission: 'products',
      submenu: [
        { name: 'Add Product', path: '/dashboard/products/add' },
        { name: 'All Products', path: '/dashboard/products' },
        { name: 'Categories', path: '/dashboard/products/categories' },
        { name: 'Subcategories', path: '/dashboard/products/subcategories' },
        { name: 'Add-ons', path: '/dashboard/products/addons' },
        { name: 'Variants', path: '/dashboard/products/variants' },
        { name: 'Bulk Upload', path: '/dashboard/products/bulk' },
        { name: 'SEO Management', path: '/dashboard/products/seo' },
      ]
    },
    {
      name: 'Inventory', icon: Cube, path: '/dashboard/inventory', permission: 'inventory',
      submenu: [
        { name: 'Available Stock', path: '/dashboard/inventory/available' },
        { name: 'Assigned Stock', path: '/dashboard/inventory/assigned' },
        { name: 'Returned Items', path: '/dashboard/inventory/returned' },
        { name: 'Damaged Items', path: '/dashboard/inventory/damaged' },
        { name: 'Manual Adjustment', path: '/dashboard/inventory/adjustment' },
        { name: 'Stock Alerts', path: '/dashboard/inventory/alerts' },
      ]
    },
    {
      name: 'Customers', icon: Users, path: '/dashboard/customers', permission: 'users',
      submenu: [
        { name: 'All Customers', path: '/dashboard/customers' },
        { name: 'Active Customers', path: '/dashboard/customers/active' },
        { name: 'Blocked Customers', path: '/dashboard/customers/blocked' },
        { name: 'Rental History', path: '/dashboard/customers/rentals' },
        { name: 'Payment History', path: '/dashboard/customers/payments' },
        { name: 'Wallet Balance', path: '/dashboard/customers/wallet' },
        { name: 'Blacklist', path: '/dashboard/customers/blacklist' },
      ]
    },
    { name: 'KYC', icon: ShieldCheck, path: '/dashboard/kyc', permission: 'kyc' },
    {
      name: 'Orders', icon: ShoppingCart, path: '/dashboard/orders', permission: 'orders',
      submenu: [
        { name: 'All Orders', path: '/dashboard/orders' },
        { name: 'Pending Orders', path: '/dashboard/orders/pending' },
        { name: 'Active Rentals', path: '/dashboard/orders/active' },
        { name: 'Return Requests', path: '/dashboard/orders/returns' },
        { name: 'Cancelled Orders', path: '/dashboard/orders/cancelled' },
        { name: 'Invoice Generation', path: '/dashboard/orders/invoices' },
      ]
    },
    {
      name: 'Payments', icon: CreditCard, path: '/dashboard/payments', permission: 'payments',
      submenu: [
        { name: 'All Transactions', path: '/dashboard/payments' },
        { name: 'Successful', path: '/dashboard/payments/successful' },
        { name: 'Failed', path: '/dashboard/payments/failed' },
        { name: 'Refunds', path: '/dashboard/payments/refunds' },
        { name: 'Late Fees', path: '/dashboard/payments/late-fees' },
        { name: 'Subscriptions', path: '/dashboard/payments/subscriptions' },
        { name: 'GST Reports', path: '/dashboard/payments/gst' },
      ]
    },
    {
      name: 'Coupons', icon: Tag, path: '/dashboard/coupons', permission: 'coupons',
      submenu: [
        { name: 'Create Coupon', path: '/dashboard/coupons/create' },
        { name: 'Active Coupons', path: '/dashboard/coupons/active' },
        { name: 'Expired Coupons', path: '/dashboard/coupons/expired' },
        { name: 'Usage Report', path: '/dashboard/coupons/report' },
        { name: 'Analytics', path: '/dashboard/coupons/analytics' },
      ]
    },
    {
      name: 'Reports', icon: ChartBar, path: '/dashboard/reports', permission: 'reports',
      submenu: [
        { name: 'Revenue', path: '/dashboard/reports/revenue' },
        { name: 'Rental Duration', path: '/dashboard/reports/duration' },
        { name: 'Category Performance', path: '/dashboard/reports/category' },
        { name: 'Customer LTV', path: '/dashboard/reports/ltv' },
        { name: 'Churn Report', path: '/dashboard/reports/churn' },
        { name: 'Inventory Utilization', path: '/dashboard/reports/inventory' },
      ]
    },
    {
      name: 'Notifications', icon: ChatCenteredText, path: '/dashboard/notifications', permission: 'notifications',
      submenu: [
        { name: 'Push Notifications', path: '/dashboard/notifications/push' },
        { name: 'Email Campaigns', path: '/dashboard/notifications/email' },
        { name: 'SMS Campaigns', path: '/dashboard/notifications/sms' },
        { name: 'Payment Reminders', path: '/dashboard/notifications/payment' },
        { name: 'Offer Campaigns', path: '/dashboard/notifications/offers' },
        { name: 'Renewal Reminders', path: '/dashboard/notifications/renewal' },
      ]
    },
    {
      name: 'Settings', icon: Gear, path: '/dashboard/settings', permission: 'settings',
      submenu: [
        { name: 'General Settings', path: '/dashboard/settings/general' },
        { name: 'Team Members', path: '/dashboard/settings/team' },
        { name: 'Roles & Permissions', path: '/dashboard/settings/roles' },
        { name: 'Logo & Branding', path: '/dashboard/settings/branding' },
        { name: 'Payment Gateway', path: '/dashboard/settings/payment-gateway' },
        { name: 'Email Templates', path: '/dashboard/settings/emails' },
        { name: 'SMS Templates', path: '/dashboard/settings/sms' },
      ]
    },
  ];

  const menuItems = allMenuItems.filter(item => !item.permission || can(item.permission));

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 border-none m-0 p-0 text-slate-800 dark:text-slate-100 h-screen overflow-hidden relative z-10 w-full transition-colors duration-300">
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${isMobile ? "fixed h-full z-50 left-0" : "sticky top-0 h-screen"
          } ${isSidebarOpen
            ? (isMobile ? "translate-x-0 w-72" : "w-72")
            : (isMobile ? "-translate-x-full w-72" : "w-0")
          } transition-all duration-300 border-r border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950 flex flex-col overflow-hidden`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/60 shrink-0 bg-transparent">
          <img
            src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path + '/'));
              const isSubmenuOpen = openMenus[item.name] || isActive;
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.name}>
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shadow-inner'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400'}`} />
                        <span className="font-medium text-sm text-left truncate tracking-wide">{item.name}</span>
                      </div>
                      {isSubmenuOpen ?
                        <CaretDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0" /> :
                        <CaretRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 shrink-0" />
                      }
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => { if (isMobile) setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shadow-inner'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400'}`} />
                        <span className="font-medium text-sm truncate tracking-wide">{item.name}</span>
                      </div>
                    </Link>
                  )}

                  {/* Render Submenu */}
                  {hasSubmenu && isSubmenuOpen && (
                    <div className="ml-9 mt-1 mb-2 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                      {item.submenu.map(subItem => {
                        const isSubActive = pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => { if (isMobile) setIsSidebarOpen(false); }}
                            className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 w-full text-left ${isSubActive
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium tracking-wide'
                              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-300'
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer with Sign Out */}
        <div className="mt-auto px-4 py-2 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/10 rounded-xl transition-colors text-sm font-bold tracking-wide"
          >
            <SignOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full relative bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/50 backdrop-blur-2xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              {isSidebarOpen ? <CaretRight className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                <MagnifyingGlass className="text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search Admin..."
                className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all w-64 focus:w-80 h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />

            <Dropdown placement="bottom-end"
              popoverProps={{
                classNames: {
                  content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-0 min-w-[320px]",
                }
              }}
            >
              <DropdownTrigger>
                <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:!bg-slate-800/80 rounded-xl transition-all">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-slate-900 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Notifications" variant="flat" className="p-0">
                <DropdownItem isReadOnly key="header" className="h-14 gap-2 opacity-100 hover:bg-transparent rounded-none border-b border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <Button size="sm" variant="light" color="primary" onClick={(e) => { e.preventDefault(); markAllAsRead(); }} className="text-xs">
                        Mark all read
                      </Button>
                    )}
                  </div>
                </DropdownItem>
                {notifications.length === 0 ? (
                  <DropdownItem isReadOnly key="empty" className="h-24 text-center text-slate-500 opacity-100 disabled pointer-events-none">
                    No new notifications
                  </DropdownItem>
                ) : (
                  notifications.slice(0, 5).map(note => (
                    <DropdownItem
                      key={note._id}
                      className={`py-3 rounded-none border-b border-slate-100 dark:border-slate-800/50 ${!note.isRead ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                      onClick={() => {
                        if (!note.isRead) markAsRead(note._id);
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm ${!note.isRead ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {note.title}
                        </span>
                        <span className="text-xs text-slate-500 line-clamp-2">{note.message}</span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </DropdownItem>
                  ))
                )}
                <DropdownItem key="view-all" className="h-12 text-center opacity-100 text-indigo-500 font-medium rounded-none hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  View All Notifications
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <div className="h-8 w-px bg-slate-300 dark:bg-slate-800"></div>

            <Dropdown placement="bottom-end"
              popoverProps={{
                classNames: {
                  content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-0",
                }
              }}
            >
              <DropdownTrigger>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  {/* Simple 'A' circle avatar — no external image */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-indigo-400/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 transition-transform group-hover:scale-105 select-none">
                      A
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
                  </div>
                  {/* Role only — no name */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider leading-none">
                      Admin
                    </span>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                {/* Profile header */}
                <DropdownItem isReadOnly key="header" className="h-auto py-3 opacity-100 cursor-default border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base shrink-0 select-none">
                      A
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Admin</span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">{adminInfo?.email || 'admin@indianrentals.com'}</span>
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem key="profile" className="text-slate-700 dark:text-slate-300" startContent={<ShieldCheck className="w-4 h-4" />}>
                  Profile Settings
                </DropdownItem>
                <DropdownItem key="company" className="text-slate-700 dark:text-slate-300" startContent={<Gear className="w-4 h-4" />}>
                  Global Config
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-red-600 dark:text-red-400" startContent={<SignOut className="w-4 h-4" />} onClick={handleLogout}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900/40 relative z-10 overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full">
            {isBlocked ? (
              <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Access Denied</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                  You don&apos;t have permission to access this section. Contact your administrator to request access.
                </p>
              </div>
            ) : children}
          </div>
        </div>
      </main>
    </div>
  );
}
