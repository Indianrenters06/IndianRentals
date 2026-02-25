"use client";

import { useState } from "react";
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
import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, Package, ChevronDown, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
    { label: "Products", icon: Package, href: "/dashboard/products" },
    { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
    { label: "Customers", icon: Users, href: "/dashboard/customers" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 border-r border-slate-700 bg-slate-900/50 backdrop-blur-xl flex flex-col overflow-hidden`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-700 flex-shrink-0">
          <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg mr-3 shadow-lg shadow-indigo-500/30" />
          <span className="font-bold text-lg tracking-wide text-slate-100">
            Indian<span className="text-indigo-400">Rentals</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    item.active
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 z-10 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <h1 className="text-xl font-semibold text-slate-100">Dashboard Overview</h1>

          <Dropdown>
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  color: "primary",
                  name: "AD",
                  size: "sm",
                }}
                className="transition-transform cursor-pointer text-slate-100"
                description="admin@indianrentals.com"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="profile" description="View your profile">
                Profile
              </DropdownItem>
              <DropdownItem key="settings" description="Manage your settings">
                Settings
              </DropdownItem>
              <DropdownItem key="logout" color="danger" description="Sign out from your account">
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
