"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import { usePathname } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Sidebar,
  SidebarItem,
  SidebarSection,
  User,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  FiHome, FiUsers, FiPackage, FiShoppingCart, FiFileText,
  FiCreditCard, FiCalendar, FiSettings, FiChevronRight, FiChevronDown,
  FiSearch, FiBell, FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiShield,
  FiLayout, FiBox, FiTag, FiBarChart2, FiMessageSquare
} from 'react-icons/fi';

import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    {
      name: 'CMS', icon: FiLayout, path: '/dashboard/cms',
      submenu: [
        { name: 'Homepage', path: '/dashboard/cms/homepage' },
        { name: 'Blog', path: '/dashboard/cms/blog' },
        { name: 'Static Pages', path: '/dashboard/cms/pages' },
      ]
    },
    {
      name: 'Products', icon: FiPackage, path: '/dashboard/products',
      submenu: [
        { name: 'Add Product', path: '/dashboard/products/add' },
        { name: 'All Products', path: '/dashboard/products' },
        { name: 'Categories', path: '/dashboard/products/categories' },
        { name: 'Subcategories', path: '/dashboard/products/subcategories' },
        { name: 'Pricing Plans', path: '/dashboard/products/pricing' },
        { name: 'Add-ons', path: '/dashboard/products/addons' },
        { name: 'Variants', path: '/dashboard/products/variants' },
        { name: 'Bulk Upload', path: '/dashboard/products/bulk' },
        { name: 'SEO Management', path: '/dashboard/products/seo' },
      ]
    },
    {
      name: 'Inventory', icon: FiBox, path: '/dashboard/inventory',
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
      name: 'Users', icon: FiUsers, path: '/dashboard/users',
      submenu: [
        { name: 'All Users', path: '/dashboard/users' },
        { name: 'Active Users', path: '/dashboard/users/active' },
        { name: 'Blocked Users', path: '/dashboard/users/blocked' },
        { name: 'Rental History', path: '/dashboard/users/rentals' },
        { name: 'Payment History', path: '/dashboard/users/payments' },
        { name: 'Wallet Balance', path: '/dashboard/users/wallet' },
        { name: 'Blacklist', path: '/dashboard/users/blacklist' },
      ]
    },
    {
      name: 'KYC Mgt', icon: FiShield, path: '/dashboard/kyc',
      submenu: [
        { name: 'Pending', path: '/dashboard/kyc/pending' },
        { name: 'Under Review', path: '/dashboard/kyc/review' },
        { name: 'Approved', path: '/dashboard/kyc/approved' },
        { name: 'Rejected', path: '/dashboard/kyc/rejected' },
        { name: 'Document Viewer', path: '/dashboard/kyc/viewer' },
      ]
    },
    {
      name: 'Orders', icon: FiShoppingCart, path: '/dashboard/orders',
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
      name: 'Payments', icon: FiCreditCard, path: '/dashboard/payments',
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
      name: 'Coupons', icon: FiTag, path: '/dashboard/coupons',
      submenu: [
        { name: 'Create Coupon', path: '/dashboard/coupons/create' },
        { name: 'Active Coupons', path: '/dashboard/coupons/active' },
        { name: 'Expired Coupons', path: '/dashboard/coupons/expired' },
        { name: 'Usage Report', path: '/dashboard/coupons/report' },
        { name: 'Analytics', path: '/dashboard/coupons/analytics' },
      ]
    },
    {
      name: 'Reports', icon: FiBarChart2, path: '/dashboard/reports',
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
      name: 'Notifications', icon: FiMessageSquare, path: '/dashboard/notifications',
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
      name: 'Settings', icon: FiSettings, path: '/dashboard/settings',
      submenu: [
        { name: 'General Settings', path: '/dashboard/settings/general' },
        { name: 'Logo & Branding', path: '/dashboard/settings/branding' },
        { name: 'Payment Gateway', path: '/dashboard/settings/payment-gateway' },
        { name: 'GST Configuration', path: '/dashboard/settings/gst' },
        { name: 'Delivery Charges', path: '/dashboard/settings/delivery' },
        { name: 'Late Fee Rules', path: '/dashboard/settings/late-fees' },
        { name: 'Cancellation Rules', path: '/dashboard/settings/cancellations' },
        { name: 'Subscription Rules', path: '/dashboard/settings/subscriptions' },
        { name: 'Email Templates', path: '/dashboard/settings/emails' },
        { name: 'SMS Templates', path: '/dashboard/settings/sms' },
      ]
    },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex bg-slate-900 border-none m-0 p-0 text-slate-100 min-h-screen relative z-10 w-full">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-72" : "w-0"
          } transition-all duration-300 border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-3xl flex flex-col overflow-hidden h-screen sticky top-0`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-800/60 flex-shrink-0 bg-transparent">
          <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl mr-3 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-bold tracking-tighter">
            IR
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Indian<span className="text-indigo-400 font-light">Rentals</span>
          </span>
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
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                        <span className="font-medium text-sm text-left truncate tracking-wide">{item.name}</span>
                      </div>
                      {isSubmenuOpen ?
                        <FiChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" /> :
                        <FiChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
                      }
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                        <span className="font-medium text-sm truncate tracking-wide">{item.name}</span>
                      </div>
                    </Link>
                  )}

                  {/* Render Submenu */}
                  {hasSubmenu && isSubmenuOpen && (
                    <div className="ml-9 mt-1 mb-2 space-y-1 border-l border-slate-800 pl-3">
                      {item.submenu.map(subItem => {
                        const isSubActive = pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 w-full text-left ${isSubActive
                                ? 'bg-indigo-500/10 text-indigo-300 font-medium tracking-wide'
                                : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
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

        <div className="p-4 border-t border-slate-800/60 flex-shrink-0 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium tracking-wide"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative">
        {/* Header */}
        <header className="h-20 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-800/80 rounded-xl transition-colors text-slate-400 hover:text-slate-200"
            >
              {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex relative group">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors w-4 h-4" />
              <input
                type="text"
                placeholder="Search Admin..."
                className="bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all w-64 focus:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-800"></div>

            <Dropdown placement="bottom-end" className="bg-slate-900 border border-slate-800">
              <DropdownTrigger>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-200">Admin User</span>
                    <span className="text-xs text-slate-500">Superadmin</span>
                  </div>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      color: "secondary",
                      name: "AD",
                      size: "md",
                      className: "ring-offset-slate-950"
                    }}
                    className="transition-transform"
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="text-slate-300">
                  Profile Settings
                </DropdownItem>
                <DropdownItem key="company" className="text-slate-300">
                  Global Config
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-red-400" onClick={handleLogout}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full bg-slate-900/40 relative z-10 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
