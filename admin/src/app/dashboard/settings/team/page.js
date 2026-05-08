"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner
} from "@heroui/react";
import { Plus, PencilSimple, Trash, ShieldCheck } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const PREDEFINED_ROLES = [
  {
    id: "admin",
    name: "Super Admin",
    description: "Full access to all modules.",
    permissions: [] // backend logic assumes admin has everything or we just pass all permissions
  },
  {
    id: "operations_manager",
    name: "Operations Manager",
    description: "Orders, Inventory, Returns, Damaged items, Delivery flow.",
    permissions: ["orders", "inventory", "products"]
  },
  {
    id: "sales_executive",
    name: "Sales / KYC Executive",
    description: "Customers, KYC, Calls, Approvals, Customer notes.",
    permissions: ["users", "kyc"]
  },
  {
    id: "finance_executive",
    name: "Finance Executive",
    description: "Payments, Refunds, Deposits, Late fees, GST, Invoices.",
    permissions: ["payments", "reports", "settings"]
  },
  {
    id: "staff",
    name: "Custom Admin / Staff",
    description: "Customized admin-level permissions.",
    permissions: []
  }
];

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
    adminPermissions: []
  });

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/team`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data);
      }
    } catch (error) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    const selectedRole = PREDEFINED_ROLES.find(r => r.id === selectedRoleId);
    
    setFormData({
      ...formData,
      role: selectedRoleId,
      adminPermissions: selectedRole ? selectedRole.permissions : []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      
      const payload = {
         ...formData,
         role: formData.role === "admin" ? "admin" : "staff", // "admin" gets full access, everything else is "staff" with specific permissions
         // Actually, if we want to store operations_manager as role, we can, but backend handles "staff" logic for permissions. Let's pass the selected role.
      };
      // Keep exact role name to display it nicely
      payload.role = formData.role;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/team`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("Team member added successfully");
        setFormData({ name: "", email: "", phone: "", password: "", role: "staff", adminPermissions: [] });
        fetchTeamMembers();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to add team member");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Members & Roles</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your company staff and their dashboard permissions</p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus weight="bold" />}
          onClick={onOpen}
          className="shadow-lg shadow-indigo-500/20"
        >
          Add Member
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-none shadow-sm">
        <Table aria-label="Team Members" removeWrapper>
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>PERMISSIONS</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={loading ? <Spinner /> : "No team members found"}
            items={teamMembers}
          >
            {(item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={item.role === 'admin' ? 'secondary' : 'primary'} variant="flat" className="capitalize">
                    {item.role.replace('_', ' ')}
                  </Chip>
                </TableCell>
                <TableCell>
                  {item.role === 'admin' ? (
                    <span className="text-xs text-slate-500 italic">Full Access</span>
                  ) : (
                    <div className="flex gap-1 flex-wrap max-w-xs">
                      {item.adminPermissions?.map((perm, idx) => (
                        <Chip key={idx} size="sm" variant="faded" className="text-[10px] h-5 capitalize">
                          {perm}
                        </Chip>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Chip size="sm" color="success" variant="dot">Active</Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-indigo-500">
                      <PencilSimple className="w-4 h-4" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-red-500">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Add Team Member</h2>
                <p className="text-sm text-slate-500 font-normal">Create a new staff account and assign a role.</p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Full Name" 
                    variant="bordered" 
                    isRequired 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <Input 
                    label="Phone Number" 
                    variant="bordered" 
                    isRequired 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    variant="bordered" 
                    isRequired 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                  <Input 
                    label="Password" 
                    type="password" 
                    variant="bordered" 
                    isRequired 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                <div className="mt-4">
                  <Select 
                    label="Assign Role" 
                    variant="bordered" 
                    isRequired
                    selectedKeys={[formData.role]}
                    onChange={handleRoleChange}
                    description="Roles automatically determine which dashboard sections are accessible."
                  >
                    {PREDEFINED_ROLES.map((role) => (
                      <SelectItem key={role.id} value={role.id} textValue={role.name}>
                        <div className="flex flex-col">
                          <span className="font-semibold">{role.name}</span>
                          <span className="text-xs text-slate-500">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {formData.role !== 'admin' && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      Granted Permissions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.adminPermissions.length > 0 ? (
                        formData.adminPermissions.map(perm => (
                          <Chip key={perm} color="primary" variant="flat" size="sm" className="capitalize">
                            {perm}
                          </Chip>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No specific sections assigned.</span>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  Create Member
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
