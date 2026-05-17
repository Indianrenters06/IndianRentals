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
import { Plus, PencilSimple, Trash, ShieldCheck, User, Phone, EnvelopeSimple, Lock } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const fetchRoles = async () => {
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
      console.error("Failed to load roles");
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchRoles();
  }, []);

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    const selectedRole = roles.find(r => r.id === selectedRoleId);
    
    setFormData({
      ...formData,
      role: selectedRoleId,
      adminPermissions: selectedRole ? selectedRole.permissions : []
    });
  };

  const handleAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({ name: "", email: "", phone: "", password: "", role: "staff", adminPermissions: [] });
    onOpen();
  };

  const handleEdit = (member) => {
    setIsEdit(true);
    setEditId(member._id);
    setFormData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      password: "", // Leave blank for security
      role: member.role || "staff",
      adminPermissions: member.adminPermissions || []
    });
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      
      const payload = { ...formData };
      
      // If editing and password is empty, don't send it
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/team/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/team`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? "Team member updated" : "Team member added");
        setFormData({ name: "", email: "", phone: "", password: "", role: "staff", adminPermissions: [] });
        fetchTeamMembers();
        onClose();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!confirm("Remove this team member?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/team/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Member removed");
        fetchTeamMembers();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to remove");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Members</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your company staff.</p>
        </div>
        <Button 
          color="primary" 
          variant="shadow" 
          className="h-12 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
          startContent={<Plus weight="bold" />}
          onPress={handleAdd}
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
                  <Chip size="sm" color={(item.role === 'admin' || item.role === 'super_admin') ? 'secondary' : 'primary'} variant="flat" className="capitalize">
                    {item.role.replace('_', ' ')}
                  </Chip>
                </TableCell>
                <TableCell>
                  {(item.role === 'admin' || item.role === 'super_admin') ? (
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
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      className="text-slate-500 hover:text-indigo-500"
                      onPress={() => handleEdit(item)}
                    >
                      <PencilSimple className="w-4 h-4" />
                    </Button>
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      className="text-slate-500 hover:text-red-500"
                      onPress={() => handleDeleteTeamMember(item._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

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
            <form onSubmit={handleSubmit} className="flex flex-col">
              <ModalHeader className="flex flex-col gap-1 py-5 px-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? "Edit Team Member" : "Add Team Member"}</h2>
                <p className="text-sm text-slate-500 font-normal">{isEdit ? "Update account details and role permissions." : "Create a new staff account and assign a role."}</p>
              </ModalHeader>
              <ModalBody className="py-6 px-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Full Name" 
                    variant="bordered" 
                    radius="xl"
                    isRequired 
                    value={formData.name}
                    onValueChange={v => setFormData({...formData, name: v})}
                    startContent={<User className="text-slate-400" />}
                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                  />
                  <Input 
                    label="Phone Number" 
                    variant="bordered" 
                    radius="xl"
                    isRequired 
                    value={formData.phone}
                    onValueChange={v => setFormData({...formData, phone: v})}
                    startContent={<Phone className="text-slate-400" />}
                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    variant="bordered" 
                    radius="xl"
                    isRequired 
                    value={formData.email}
                    onValueChange={v => setFormData({...formData, email: v})}
                    startContent={<EnvelopeSimple className="text-slate-400" />}
                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                  />
                  <Input 
                    label="Password" 
                    type="password" 
                    variant="bordered" 
                    radius="xl"
                    isRequired={!isEdit} 
                    value={formData.password}
                    onValueChange={v => setFormData({...formData, password: v})}
                    startContent={<Lock className="text-slate-400" />}
                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                    placeholder={isEdit ? "Leave blank to keep current" : ""}
                  />
                </div>

                <div className="mt-4">
                  <Select 
                    label="Assign Role" 
                    variant="bordered" 
                    radius="xl"
                    isRequired
                    selectedKeys={[formData.role]}
                    onSelectionChange={keys => setFormData({...formData, role: [...keys][0] || "staff"})}
                    startContent={<ShieldCheck className="text-slate-400" />}
                    classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                    popoverProps={{
                      classNames: {
                        content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl",
                      }
                    }}
                    description="Roles automatically determine which dashboard sections are accessible."
                  >
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id} textValue={role.name}>
                        <div className="flex flex-col">
                          <span className="font-semibold">{role.name}</span>
                          <span className="text-xs text-slate-500 line-clamp-1">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {formData.role !== 'super_admin' && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
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
              <ModalFooter className="py-4 px-6">
                <Button variant="light" onPress={onClose} className="font-semibold">
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  type="submit" 
                  isLoading={isSubmitting} 
                  variant="shadow"
                  className="h-12 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                >
                  {isEdit ? "Update Member" : "Create Member"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
