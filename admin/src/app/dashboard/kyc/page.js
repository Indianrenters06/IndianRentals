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
import { FiShield, FiEye, FiCheckCircle, FiXCircle, FiMoreVertical, FiClock, FiFileText } from "react-icons/fi";

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
        <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        KYC <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Verification Center</span>
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
                                                    startContent={<FiEye />}
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
            <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" className="dark:bg-slate-950">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <FiShield className="text-amber-500" />
                            <span>KYC Verification - {selectedKyc?.user?.name}</span>
                        </div>
                    </ModalHeader>
                    <ModalBody className="py-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase text-slate-400">Personal Details</h4>
                                <div className="space-y-2">
                                    <p className="text-sm"><span className="text-slate-500">ID Type:</span> <span className="font-semibold">{selectedKyc?.personalDetails?.idType}</span></p>
                                    <p className="text-sm"><span className="text-slate-500">ID Number:</span> <span className="font-semibold">{selectedKyc?.personalDetails?.idNumber}</span></p>
                                    <p className="text-sm"><span className="text-slate-500">Address:</span> <span className="font-semibold">{selectedKyc?.personalDetails?.address}</span></p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase text-slate-400">Documents</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedKyc?.documents && Object.entries(selectedKyc.documents).map(([key, url]) => (
                                        <div key={key} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-square">
                                            <img src={url} alt={key} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Button isIconOnly size="sm" variant="flat" color="primary" onClick={() => window.open(url, '_blank')}>
                                                    <FiEye />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                                <p className="text-[10px] text-white text-center truncate uppercase">{key}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {modalMode === "reject" && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
                                <h4 className="text-sm font-bold text-rose-500">Rejection Reason</h4>
                                <Textarea
                                    placeholder="Explain why the KYC was rejected (this will be shown to the user)..."
                                    value={rejectionReason}
                                    onValueChange={setRejectionReason}
                                    variant="bordered"
                                />
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="border-t border-slate-200 dark:border-slate-800">
                        {modalMode === "view" ? (
                            <>
                                <Button color="danger" variant="flat" startContent={<FiXCircle />} onPress={() => setModalMode("reject")}>
                                    Reject
                                </Button>
                                <Button color="success" variant="shadow" className="text-white" startContent={<FiCheckCircle />} onPress={() => handleUpdateStatus(selectedKyc._id, 'approved')}>
                                    Approve KYC
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="light" onPress={() => setModalMode("view")}>Cancel</Button>
                                <Button color="danger" variant="shadow" onPress={() => handleUpdateStatus(selectedKyc._id, 'rejected')}>Confirm Rejection</Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
