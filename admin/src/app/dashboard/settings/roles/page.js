"use client";

import { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Button, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Input, Textarea, Checkbox, CheckboxGroup, Spinner
} from "@heroui/react";
import { ShieldCheck, Plus, Trash, PencilSimple, Lock, Crown } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AVAILABLE_PERMISSIONS = [
  { id: "cms",           name: "CMS",           description: "Manage banners, pages, and blog posts." },
  { id: "products",      name: "Products",       description: "Manage products, categories, and inventory." },
  { id: "inventory",     name: "Inventory",      description: "Track stock, returns, and damaged items." },
  { id: "users",         name: "Customers",      description: "Manage user accounts and profiles." },
  { id: "kyc",           name: "KYC",            description: "Review and approve identity documents." },
  { id: "orders",        name: "Orders",         description: "Process rentals, extensions, and cancellations." },
  { id: "payments",      name: "Payments",       description: "Track transactions, refunds, and late fees." },
  { id: "coupons",       name: "Coupons",        description: "Manage promotional codes and discounts." },
  { id: "reports",       name: "Reports",        description: "View analytics and financial reports." },
  { id: "notifications", name: "Notifications",  description: "Send and manage system alerts." },
  { id: "settings",      name: "Settings",       description: "Configure site-wide variables and team." },
];

const CORE_ROLES = ["super_admin", "admin"];

const getCurrentUser = () => {
  try {
    const info = typeof window !== "undefined" ? localStorage.getItem("adminInfo") : null;
    return info ? JSON.parse(info) : null;
  } catch { return null; }
};

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const currentUser = getCurrentUser();
  const currentRole = currentUser?.role;
  const isSuperAdmin = currentRole === "super_admin";
  const isAdmin = currentRole === "admin" || isSuperAdmin;

  const [formData, setFormData] = useState({ name: "", description: "", permissions: [] });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setRoles(await res.json());
    } catch { toast.error("Failed to load roles"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRoles(); }, []);

  const openCreate = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({ name: "", description: "", permissions: [] });
    onOpen();
  };

  const openEdit = (role) => {
    if (CORE_ROLES.includes(role.id) && !isSuperAdmin) {
      toast.error("Only Super Admin can edit core system roles");
      return;
    }
    setIsEdit(true);
    setEditId(role._id);
    setFormData({ name: role.name, description: role.description || "", permissions: role.permissions });
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Role name is required");
    if (formData.permissions.length === 0) return toast.error("Select at least one permission");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const url = isEdit
        ? `${API}/api/admin/roles/${editId}`
        : `${API}/api/admin/roles`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? "Role updated" : "Role created");
        fetchRoles();
        onClose();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (role) => {
    if (CORE_ROLES.includes(role.id)) {
      toast.error("Core system roles cannot be deleted");
      return;
    }
    if (!confirm(`Delete the "${role.name}" role? Team members assigned to this role may lose access.`)) return;
    setDeleting(role._id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/admin/roles/${role._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { toast.success("Role deleted"); fetchRoles(); }
      else { const d = await res.json(); toast.error(d.message || "Failed to delete"); }
    } catch { toast.error("Something went wrong"); }
    finally { setDeleting(null); }
  };

  const roleColor = (role) => {
    if (role.id === "super_admin") return "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
    if (role.id === "admin") return "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
    return "text-slate-500 bg-slate-100 dark:bg-slate-800";
  };

  const chipColor = (role) => {
    if (role.id === "super_admin") return "warning";
    if (role.id === "admin") return "secondary";
    return "primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Roles & Permissions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage predefined roles and create custom access levels for your team.</p>
        </div>
        {isAdmin && (
          <Button
            color="primary"
            variant="shadow"
            className="h-12 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
            startContent={<Plus weight="bold" />}
            onPress={openCreate}
          >
            Add New Role
          </Button>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><Crown size={12} className="text-amber-500" weight="fill" /> Core system role (protected)</span>
        <span className="flex items-center gap-1.5"><Lock size={12} className="text-slate-400" /> Not editable by Admin</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" color="primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role) => {
            const isCore = CORE_ROLES.includes(role.id);
            const isSuperAdminRole = role.id === "super_admin";
            const canEdit = isSuperAdmin || !isCore;
            const canDelete = isAdmin && !isCore;

            return (
              <Card
                key={role._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col"
              >
                <CardHeader className="flex gap-3 px-5 pt-5 pb-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${roleColor(role)}`}>
                    {isSuperAdminRole
                      ? <Crown weight="fill" className="w-5 h-5" />
                      : <ShieldCheck weight="fill" className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{role.name}</p>
                        {isCore && <Chip size="sm" color={chipColor(role)} variant="flat" className="text-[10px] h-4 px-1 shrink-0">{isSuperAdminRole ? "Core" : "System"}</Chip>}
                      </div>
                      {isAdmin && (
                        <div className="flex gap-0.5 shrink-0">
                          {canEdit ? (
                            <Button
                              isIconOnly size="sm" variant="light" color="primary"
                              className="opacity-50 hover:opacity-100 transition-opacity"
                              onPress={() => openEdit(role)}
                            >
                              <PencilSimple weight="bold" size={14} />
                            </Button>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center opacity-30" title="Only Super Admin can edit this role">
                              <Lock size={14} className="text-slate-400" />
                            </div>
                          )}
                          {canDelete ? (
                            <Button
                              isIconOnly size="sm" variant="light" color="danger"
                              className="opacity-50 hover:opacity-100 transition-opacity"
                              isLoading={deleting === role._id}
                              onPress={() => handleDelete(role)}
                            >
                              <Trash weight="bold" size={14} />
                            </Button>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center opacity-20" title="Core roles cannot be deleted">
                              <Trash size={14} className="text-slate-400" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{role.permissions.length} modules accessible</p>
                  </div>
                </CardHeader>

                <CardBody className="px-5 py-4 flex-1 flex flex-col">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-2">
                    {role.description}
                  </p>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Module Access</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm, idx) => (
                        <Chip
                          key={idx} size="sm" variant="flat"
                          className={`text-[10px] capitalize border-none ${
                            isSuperAdminRole
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          }`}
                        >
                          {perm}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
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
              <ModalHeader className="py-5 px-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {isEdit ? "Edit Role" : "Create New Role"}
                  </h2>
                  <p className="text-sm text-slate-500 font-normal mt-0.5">
                    {isEdit ? "Update this role's name, description and module permissions." : "Define a new role and assign specific module permissions."}
                  </p>
                </div>
              </ModalHeader>

              <ModalBody className="py-6 px-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-5">
                  <Input
                    label="Role Name"
                    placeholder="e.g. Content Moderator"
                    variant="bordered"
                    radius="xl"
                    isRequired
                    value={formData.name}
                    onValueChange={v => setFormData({ ...formData, name: v })}
                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[56px]" }}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Briefly describe the purpose of this role..."
                    variant="bordered"
                    radius="xl"
                    value={formData.description}
                    onValueChange={v => setFormData({ ...formData, description: v })}
                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Module Permissions</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFormData({ ...formData, permissions: AVAILABLE_PERMISSIONS.map(p => p.id) })}
                          className="text-xs text-indigo-500 hover:underline font-semibold">Select All</button>
                        <span className="text-slate-300">|</span>
                        <button type="button" onClick={() => setFormData({ ...formData, permissions: [] })}
                          className="text-xs text-slate-400 hover:underline font-semibold">Clear</button>
                      </div>
                    </div>
                    <CheckboxGroup
                      color="primary"
                      value={formData.permissions}
                      onValueChange={val => setFormData({ ...formData, permissions: val })}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_PERMISSIONS.map((perm) => (
                          <div
                            key={perm.id}
                            onClick={() => {
                              const next = formData.permissions.includes(perm.id)
                                ? formData.permissions.filter(p => p !== perm.id)
                                : [...formData.permissions, perm.id];
                              setFormData({ ...formData, permissions: next });
                            }}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              formData.permissions.includes(perm.id)
                                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                            }`}
                          >
                            <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                              formData.permissions.includes(perm.id)
                                ? "border-indigo-500 bg-indigo-500"
                                : "border-slate-300 dark:border-slate-600"
                            }`}>
                              {formData.permissions.includes(perm.id) && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{perm.name}</p>
                              <p className="text-xs text-slate-400 leading-tight">{perm.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CheckboxGroup>
                    <p className="text-xs text-slate-400">{formData.permissions.length} of {AVAILABLE_PERMISSIONS.length} modules selected</p>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="py-4 px-6">
                <Button variant="light" onPress={onClose} className="font-semibold">Cancel</Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  variant="shadow"
                  className="h-11 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                >
                  {isEdit ? "Save Changes" : "Create Role"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
