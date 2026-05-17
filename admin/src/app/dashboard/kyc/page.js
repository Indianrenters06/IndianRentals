"use client";

import {  useState, useEffect , useMemo } from "react";
import { motion } from "framer-motion";
import { 
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Divider,
    Pagination, Tabs, Tab } from "@heroui/react";
import { Eye, CheckCircle, WarningCircle, User, IdentificationCard, FileText, Info } from "@phosphor-icons/react";

import { DownloadSimple, MagnifyingGlassPlus, X } from "@phosphor-icons/react";

export default function KYCManagement() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [zoomedDoc, setZoomedDoc] = useState(null);
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalMode, setModalMode] = useState("view"); // view or reject
    const [isMounted, setIsMounted] = useState(false);

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
        setIsMounted(true);
        fetchKYC();
    }, []);

    const filteredRequests = statusFilter === "all"
        ? kycRequests
        : kycRequests.filter(req => req.status?.toLowerCase() === statusFilter);


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
                fetchKYC();
                onClose();
            } else {
                throw new Error("Failed to update KYC");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderStatusChip = (status) => {
        switch (status) {
            case 'approved': return <Chip size="sm" color="success" variant="flat" className="font-bold">Approved</Chip>;
            case 'rejected': return <Chip size="sm" color="danger" variant="flat" className="font-bold">Rejected</Chip>;
            case 'pending': return <Chip size="sm" color="warning" variant="flat" className="font-bold">Pending Review</Chip>;
            default: return <Chip size="sm" variant="flat" className="font-bold">{status?.toUpperCase()}</Chip>;
        }
    };


    const [page, setPage] = useState(1);


    const rowsPerPage = 10;


    const [sortDescriptor, setSortDescriptor] = useState({ column: '_id', direction: 'descending' });



    const sortedItems = useMemo(() => {


        if (!Array.isArray(filteredRequests)) return [];


        return [...filteredRequests].sort((a, b) => {


            const first = a[sortDescriptor.column];


            const second = b[sortDescriptor.column];


            const cmp = first < second ? -1 : first > second ? 1 : 0;


            return sortDescriptor.direction === "descending" ? -cmp : cmp;


        });


    }, [sortDescriptor, filteredRequests]);



    const items = useMemo(() => {


        const start = (page - 1) * rowsPerPage;


        const end = start + rowsPerPage;


        return sortedItems.slice(start, end);


    }, [page, sortedItems]);



    if (!isMounted) return null;

    return (<div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        KYC <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Verification Center</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Review and manage all user documentation for platform trust & safety.
                    </p>
                </motion.div>
                <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 w-full md:w-auto overflow-x-auto">
                    {["all", "pending", "review", "approved", "rejected"].map(s => {
                        const isActive = statusFilter === s;
                        return (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`pb-3 text-sm font-bold capitalize relative whitespace-nowrap transition-colors ${
                                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                            >
                                {s === "review" ? "Under Review" : s === "all" ? "All Requests" : s}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeKycTab"
                                        className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-indigo-600 dark:bg-indigo-400"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardBody className="p-0">
                        <Table
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            bottomContent={
                                filteredRequests.length > 0 ? (
                                    <div className="flex w-full justify-center mt-4 mb-4">
                                        <Pagination
                                            isCompact
                                            showControls
                                            showShadow
                                            color="primary"
                                            page={page}
                                            total={Math.ceil(filteredRequests.length / rowsPerPage)}
                                            onChange={(page) => setPage(page)}
                                        />
                                    </div>
                                ) : null
                            }
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
                            <TableBody items={items} isLoading={loading} emptyContent={loading ? "Loading requests..." : `No KYC requests found.`}>
                                {(kyc) => (
                                    <TableRow key={kyc._id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{kyc.user?.name}</span>
                                                <span className="text-xs text-slate-500">{kyc.user?.email}</span>
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
                                                    className="font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg h-8 px-4"
                                                    startContent={<Eye weight="bold" size={14} />}
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

            {/* Verification Modal */}
            <Modal size="4xl" isOpen={isOpen} onOpenChange={onClose} scrollBehavior="inside"
                classNames={{
                    base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
                    header: "border-b border-slate-200 dark:border-slate-800",
                    footer: "border-t border-slate-200 dark:border-slate-800",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <IdentificationCard size={24} className="text-indigo-500" />
                                    <span className="text-xl font-bold">KYC Verification Review</span>
                                </div>
                                <p className="text-xs font-normal text-slate-500">UID: {selectedKyc?._id}</p>
                            </ModalHeader>
                            <ModalBody className="py-6">
                                {selectedKyc && (
                                    <div className="space-y-8">
                                        {/* User & Status Header */}
                                        <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                                    {selectedKyc.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{selectedKyc.user?.name}</h3>
                                                    <p className="text-sm text-slate-500">{selectedKyc.user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                                                <Chip size="sm" variant="flat" color={selectedKyc.status === 'approved' ? 'success' : selectedKyc.status === 'rejected' ? 'danger' : 'warning'}>
                                                    {selectedKyc.status?.toUpperCase()}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Personal Details */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                    <User size={16} /> Personal Information
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <p className="text-xs text-slate-400 mb-1">Full Name (on Document)</p>
                                                        <p className="text-sm font-semibold">{selectedKyc.personalDetails?.fullName || "Not provided"}</p>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <p className="text-xs text-slate-400 mb-1">Date of Birth</p>
                                                        <p className="text-sm font-semibold">{selectedKyc.personalDetails?.dob || "Not provided"}</p>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <p className="text-xs text-slate-400 mb-1">Document Type</p>
                                                        <p className="text-sm font-semibold flex items-center gap-2">
                                                            <IdentificationCard weight="bold" /> {selectedKyc.personalDetails?.idType || "Not provided"}
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <p className="text-xs text-slate-400 mb-1">Document ID Number</p>
                                                        <p className="text-sm font-mono font-bold tracking-wider">{selectedKyc.personalDetails?.idNumber || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Documents */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                    <FileText size={16} /> Verification Documents
                                                </h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {Object.entries(selectedKyc.documents || {}).map(([key, url]) => (
                                                        url && (
                                                            <div key={key} className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-video">
                                                                <img src={url} alt={key} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                    <p className="text-white text-xs font-bold uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                                    <Button size="sm" color="primary" variant="solid" startContent={<MagnifyingGlassPlus weight="bold" />} onPress={() => setZoomedDoc(url)}>Zoom & View</Button>
                                                                </div>
                                                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-white font-bold uppercase tracking-tighter">
                                                                    {key.replace(/([A-Z])/g, ' $1')}
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {modalMode === 'reject' && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 dark:bg-rose-500/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-500/20">
                                                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
                                                    <WarningCircle weight="bold" /> Rejection Reason
                                                </h4>
                                                <Textarea
                                                    placeholder="Explain why this KYC is being rejected (e.g. Blurry photo, mismatched ID number)..."
                                                    value={rejectionReason}
                                                    onValueChange={setRejectionReason}
                                                    variant="bordered"
                                                    classNames={{ input: "text-sm", inputWrapper: "bg-white dark:bg-slate-900" }}
                                                />
                                                <div className="flex gap-2 mt-4">
                                                    <Button size="sm" color="danger" className="font-bold px-6" onPress={() => handleUpdateStatus(selectedKyc._id, 'rejected')}>Confirm Rejection</Button>
                                                    <Button size="sm" variant="light" className="font-bold" onPress={() => setModalMode('view')}>Cancel</Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {modalMode === 'view' && selectedKyc?.status === 'pending' && (
                                    <div className="flex gap-2 w-full justify-between items-center">
                                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                            <Info size={18} weight="bold" />
                                            <span className="text-xs font-bold uppercase tracking-tight">Manual Verification Required</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button color="danger" variant="flat" className="font-bold px-6 rounded-xl" onPress={() => setModalMode('reject')}>Reject Application</Button>
                                            <Button color="success" variant="solid" className="font-bold px-8 !bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20" onPress={() => handleUpdateStatus(selectedKyc._id, 'approved')}>Approve KYC</Button>
                                        </div>
                                    </div>
                                )}
                                {selectedKyc?.status !== 'pending' && (
                                    <Button variant="flat" onPress={onClose} className="font-bold px-8 rounded-xl">Close Review</Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Document Zoom & Download Overlay */}
            {zoomedDoc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
                    <div className="relative max-w-5xl max-h-screen w-full h-full flex items-center justify-center">
                        <Button 
                            isIconOnly 
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full z-50"
                            onPress={() => setZoomedDoc(null)}
                        >
                            <X size={24} weight="bold" />
                        </Button>
                        
                        <img src={zoomedDoc} alt="Zoomed KYC Document" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
                        
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                            <Button
                                size="lg"
                                className="font-bold bg-indigo-600 text-white shadow-lg"
                                startContent={<DownloadSimple weight="bold" />}
                                onPress={async () => {
                                    try {
                                        const response = await fetch(zoomedDoc);
                                        const blob = await response.blob();
                                        const fileUrl = window.URL.createObjectURL(blob);
                                        const alink = document.createElement('a');
                                        alink.href = fileUrl;
                                        alink.download = "KYC_Document.jpg";
                                        alink.click();
                                    } catch (e) {
                                        window.open(zoomedDoc, '_blank');
                                    }
                                }}
                            >
                                Download Document
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
