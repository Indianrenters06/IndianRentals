"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
} from "@heroui/react";
import { ShieldCheck, Plus } from "@phosphor-icons/react";

const PREDEFINED_ROLES = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all modules and configurations.",
    permissions: ["All Modules Access", "System Configurations", "Financials", "Team Management"]
  },
  {
    id: "admin",
    name: "Admin",
    description: "Similar to Super Admin but with different admin-level permissions.",
    permissions: ["CMS Management", "Products", "Inventory", "Users", "Orders", "Settings"]
  },
  {
    id: "operations_manager",
    name: "Operations Manager",
    description: "Orders, Inventory, Returns, Damaged items, Delivery flow.",
    permissions: ["Orders", "Inventory", "Products", "Delivery Management", "Returns"]
  },
  {
    id: "sales_executive",
    name: "Sales / KYC Executive",
    description: "Customers, KYC, Calls, Approvals, Customer notes.",
    permissions: ["Customers", "KYC Verification", "Customer Communications"]
  },
  {
    id: "finance_executive",
    name: "Finance Executive",
    description: "Payments, Refunds, Deposits, Late fees, GST, Invoices.",
    permissions: ["Payments", "Refunds", "Invoices", "Reports", "GST Configuration"]
  }
];

export default function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Roles & Permissions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage predefined roles and their associated system permissions.</p>
        </div>
        <Button 
          color="primary" 
          variant="shadow"
          className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
          startContent={<Plus weight="bold" />}
        >
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PREDEFINED_ROLES.map((role) => (
          <Card key={role.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <CardHeader className="flex gap-3 px-5 pt-5 pb-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold text-slate-900 dark:text-slate-100">{role.name}</p>
                <p className="text-xs text-slate-500">{role.permissions.length} permissions included</p>
              </div>
            </CardHeader>
            <CardBody className="px-5 py-4 flex-1 flex flex-col">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
                {role.description}
              </p>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm, idx) => (
                    <Chip key={idx} size="sm" variant="flat" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none">
                      {perm}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
