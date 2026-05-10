"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Spinner
} from "@heroui/react";
import { ShieldCheck, Plus, Trash } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const AVAILABLE_PERMISSIONS = [
  { id: "cms", name: "CMS Management", description: "Manage banners, pages, and blog posts." },
  { id: "products", name: "Products", description: "Manage products, categories, and inventory." },
  { id: "inventory", name: "Inventory", description: "Track stock, returns, and damaged items." },
  { id: "users", name: "Customers", description: "Manage user accounts and profiles." },
  { id: "kyc", name: "KYC Verification", description: "Review and approve identity documents." },
  { id: "orders", name: "Orders", description: "Process rentals, extensions, and cancellations." },
  { id: "payments", name: "Payments", description: "Track transactions, refunds, and late fees." },
  { id: "coupons", name: "Coupons", description: "Manage promotional codes and discounts." },
  { id: "reports", name: "Reports", description: "View analytics and financial reports." },
  { id: "notifications", name: "Notifications", description: "Send and manage system alerts." },
  { id: "settings", name: "System Settings", description: "Configure site-wide variables and team." }
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: []
  });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/roles`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/roles`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("Custom role created");
        setFormData({ name: "", description: "", permissions: [] });
        fetchRoles();
        onClose();
      } else {
        toast.error(data.message || "Failed to create role");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (id) => {
    if (!confirm("Are you sure you want to delete this custom role? Users assigned to this role might lose access.")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/roles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Role deleted");
        fetchRoles();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Roles & Permissions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage predefined roles and create custom access levels for your team.</p>
        </div>
        <Button 
          color="primary" 
          variant="shadow"
          className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
          startContent={<Plus weight="bold" />}
          onPress={onOpen}
        >
          Create Custom Role
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <CardHeader className="flex gap-3 px-5 pt-5 pb-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-md font-bold text-slate-900 dark:text-slate-100">{role.name}</p>
                    {!role.isPredefined && (
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger" 
                        className="opacity-20 hover:opacity-100 transition-opacity"
                        onPress={() => handleDeleteRole(role._id)}
                      >
                        <Trash weight="bold" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{role.permissions.length} modules accessible</p>
                </div>
              </CardHeader>
              <CardBody className="px-5 py-4 flex-1 flex flex-col">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1 line-clamp-2">
                  {role.description}
                </p>
                
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Module Access</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm, idx) => (
                      <Chip key={idx} size="sm" variant="flat" className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none capitalize">
                        {perm}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="2xl"
        classNames={{
          backdrop: "bg-slate-900/50 backdrop-blur-sm",
          base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl",
          header: "border-b border-slate-100 dark:border-slate-800/60",
          footer: "border-t border-slate-100 dark:border-slate-800/60",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 py-5 px-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create Custom Role</h2>
                <p className="text-sm text-slate-500 font-normal">Define a unique role and assign specific module permissions.</p>
              </ModalHeader>
              <ModalBody className="py-6 px-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <Input 
                    label="Role Name" 
                    placeholder="e.g. Content Moderator" 
                    variant="bordered" 
                    isRequired 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <Textarea 
                    label="Description" 
                    placeholder="Briefly describe the purpose of this role..." 
                    variant="bordered"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Grant Module Permissions</p>
                    <CheckboxGroup
                      color="primary"
                      value={formData.permissions}
                      onValueChange={val => setFormData({...formData, permissions: val})}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {AVAILABLE_PERMISSIONS.map((perm) => (
                          <Checkbox key={perm.id} value={perm.id} classNames={{ label: "text-sm" }}>
                            <div className="flex flex-col">
                              <span>{perm.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal leading-tight">{perm.description}</span>
                            </div>
                          </Checkbox>
                        ))}
                      </div>
                    </CheckboxGroup>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="py-4 px-6">
                <Button variant="light" onPress={onClose} className="font-semibold">
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  type="submit" 
                  isLoading={isSubmitting} 
                  variant="shadow"
                  className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                >
                  Create Role
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
