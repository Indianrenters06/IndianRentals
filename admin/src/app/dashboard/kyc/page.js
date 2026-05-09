"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Textarea
} from "@heroui/react";
import { ShieldCheck, Eye, CheckCircle, XCircle, DotsThreeVertical, Clock, FileText } from "@phosphor-icons/react";

export default function KYCManagement() {
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalMode, setModalMode] = useState("view"); // view or reject

    const fetchKYC = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/kyc/admin/all`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setKycRequests(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKYC();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/kyc/admin/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status, rejectionReason: status === 'rejected' ? rejectionReason : '' })
            });

            if (res.ok) {
                alert(`KYC marked as ${status}`);
                fetchKYC();
                onClose();
            } else {
                throw new Error("Failed to update KYC");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const renderStatusChip = (status) => {
        switch (status) {
            case 'approved': return <Chip size="sm" color="success" variant="flat">Approved</Chip>;
            case 'rejected': return <Chip size="sm" color="danger" variant="flat">Rejected</Chip>;
            case 'pending': return <Chip size="sm" color="warning" variant="flat">Pending Review</Chip>;
            default: return <Chip size="sm" variant="flat">{status}</Chip>;
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        KYC <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Verification Center</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Review and approve documentation for platform trust & safety.</p>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardBody className="p-0">
                        <Table
                            aria-label="KYC Requests Table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                thead: "bg-slate-50 dark:bg-slate-950/80",
                                th: "text-slate-500 font-semibold uppercase text-xs py-4 px-6 border-b border-slate-200 dark:border-slate-800",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>USER</TableColumn>
                                <TableColumn>TYPE</TableColumn>
                                <TableColumn>SUBMITTED ON</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={kycRequests} isLoading={loading} emptyContent={loading ? "Loading requests..." : "No KYC requests found."}>
                                {(kyc) => (
                                    <TableRow key={kyc._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(kyc.user?.name || "U")}`} size="sm" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{kyc.user?.name}</span>
                                                    <span className="text-xs text-slate-500">{kyc.user?.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium">{kyc.personalDetails?.idType || "Identity Proof"}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-500">{new Date(kyc.createdAt).toLocaleDateString()}</span>
                                        </TableCell>
                                        <TableCell>
                                            {renderStatusChip(kyc.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                    startContent={<Eye />}
                                                    onPress={() => {
                                                        setSelectedKyc(kyc);
                                                        setModalMode("view");
                                                        onOpen();
                                                    }}
                                                >
                                                    Review
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </motion.div>

            {/* Review Modal */}
            <Modal
                isOpen={isOpen && !!selectedKyc}
                onClose={() => {
                    onClose();
                    setSelectedKyc(null);
                    setModalMode("view");
                }}
                size="4xl"
                scrollBehavior="inside"
                className="dark:bg-slate-950 max-h-[90vh]"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between w-full pr-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="text-indigo-500" weight="bold" />
                                        <span className="text-slate-900 dark:text-slate-100">KYC Verification - {selectedKyc?.user?.name || "User Details"}</span>
                                    </div>
                                    <Chip size="sm" variant="flat" color={selectedKyc?.status === 'approved' ? 'success' : selectedKyc?.status === 'rejected' ? 'danger' : 'warning'}>
                                        {selectedKyc?.status?.toUpperCase()}
                                    </Chip>
                                </div>
                            </ModalHeader>
                            <ModalBody className="py-8 space-y-8 scrollbar-hide">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Personal Details</h4>
                                            <Card className="bg-slate-50 dark:bg-slate-950/50 border-none shadow-none">
                                                <CardBody className="p-4 space-y-3">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Full Name</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedKyc?.personalDetails?.fullName || selectedKyc?.user?.name}</span>
                                                    </div>
                                                    <Divider className="opacity-50" />
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">ID Type</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedKyc?.personalDetails?.idType || "N/A"}</span>
                                                    </div>
                                                    <Divider className="opacity-50" />
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">ID Number</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">{selectedKyc?.personalDetails?.idNumber || "N/A"}</span>
                                                    </div>
                                                    <Divider className="opacity-50" />
                                                    <div className="space-y-1">
                                                        <span className="text-sm text-slate-500">Address</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{selectedKyc?.personalDetails?.address || "No address provided"}</p>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>

                                        {selectedKyc?.status === 'rejected' && (
                                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
                                                <h4 className="text-sm font-bold text-rose-500 flex items-center gap-2">
                                                    <XCircle weight="bold" /> Previous Rejection Reason
                                                </h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedKyc.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Verification Documents</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedKyc?.documents && Object.entries(selectedKyc.documents).filter(([_, url]) => !!url).map(([key, url]) => (
                                                <div key={key} className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-4/3">
                                                        <img
                                                            src={url}
                                                            alt={key}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                                            onError={(e) => { e.target.src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found'; }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                                                            <Button
                                                                size="sm"
                                                                variant="shadow"
                                                                color="primary"
                                                                startContent={<Eye />}
                                                                onPress={() => window.open(url, '_blank')}
                                                                className="rounded-full font-bold h-10 px-6"
                                                            >
                                                                Preview
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!selectedKyc?.documents || Object.keys(selectedKyc.documents).length === 0) && (
                                                <div className="col-span-2 py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/20">
                                                    <FileText className="text-slate-300 text-3xl mb-2" />
                                                    <p className="text-sm text-slate-500">No documents submitted</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {modalMode === "reject" && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-4">
                                        <h4 className="text-sm font-bold text-rose-500 flex items-center gap-2 uppercase tracking-wide">
                                            <XCircle weight="bold" /> Decision: Reject Application
                                        </h4>
                                        <Textarea
                                            placeholder="Provide a detailed explanation for the user. Mention specific documents or information that need correction..."
                                            value={rejectionReason}
                                            onValueChange={setRejectionReason}
                                            variant="bordered"
                                            classNames={{
                                                input: "bg-white dark:bg-slate-950",
                                                inputWrapper: "border-slate-200 dark:border-slate-800 focus-within:!border-rose-500 transition-colors"
                                            }}
                                            minRows={3}
                                        />
                                    </motion.div>
                                )}
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-950/50">
                                {modalMode === "view" ? (
                                    <div className="flex justify-between w-full items-center">
                                        <Button variant="light" className="text-slate-500 font-medium" onPress={onClose}>
                                            Cancel Review
                                        </Button>
                                        <div className="flex gap-3">
                                            <Button
                                                color="danger"
                                                variant="flat"
                                                startContent={<XCircle weight="bold" />}
                                                onPress={() => setModalMode("reject")}
                                                className="h-12 px-6 rounded-xl font-bold"
                                            >
                                                Mark as Rejected
                                            </Button>
                                            <Button
                                                color="success"
                                                variant="shadow"
                                                className="h-12 px-8 rounded-xl text-white font-bold shadow-lg shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700"
                                                startContent={<CheckCircle weight="bold" />}
                                                onPress={() => handleUpdateStatus(selectedKyc._id, 'approved')}
                                            >
                                                Approve Verification
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end w-full gap-3">
                                        <Button
                                            variant="light"
                                            className="h-12 px-6 rounded-xl font-medium text-slate-500"
                                            onPress={() => {
                                                setModalMode("view");
                                                setRejectionReason("");
                                            }}
                                        >
                                            Back to Review
                                        </Button>
                                        <Button
                                            color="danger"
                                            variant="shadow"
                                            className="h-12 px-8 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/30"
                                            onPress={() => handleUpdateStatus(selectedKyc._id, 'rejected')}
                                            isDisabled={!rejectionReason.trim()}
                                        >
                                            Confirm Rejection
                                        </Button>
                                    </div>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
