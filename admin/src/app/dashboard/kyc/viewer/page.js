"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Spinner,
} from "@heroui/react";
import { Eye, FileText, ArrowLeft, MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function KYCViewer() {
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    const fetchKYC = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/kyc/admin/all`, {
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

    if (!isMounted) return null;

    const allDocuments = kycRequests.flatMap(kyc => 
        Object.entries(kyc.documents || {})
            .filter(([_, url]) => !!url)
            .map(([type, url]) => ({
                id: kyc._id,
                user: kyc.user,
                type,
                url,
                status: kyc.status
            }))
    );

    const filteredDocs = allDocuments.filter(doc => 
        doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.type?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors mb-2 text-sm font-medium"
                    >
                        <ArrowLeft /> Back
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Document <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Viewer</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Browse and inspect all submitted KYC documents.</p>
                </motion.div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                <input
                    type="text"
                    placeholder="Search by user or document type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <FileText className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                    <p className="text-slate-500">No documents found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocs.map((doc, i) => (
                        <motion.div 
                            key={`${doc.id}-${doc.type}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group">
                                <div className="aspect-4/3 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                                    <img 
                                        src={doc.url} 
                                        alt={doc.type}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found'; }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center duration-300 backdrop-blur-sm">
                                        <Button 
                                            size="sm" 
                                            variant="solid" 
                                            color="primary" 
                                            startContent={<Eye />}
                                            onPress={() => window.open(doc.url, '_blank')}
                                            className="rounded-full font-bold shadow-lg"
                                        >
                                            View Full Screen
                                        </Button>
                                    </div>
                                </div>
                                <CardBody className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                            {doc.type.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        <div className={`w-2 h-2 rounded-full ${
                                            doc.status === 'approved' ? 'bg-emerald-500' : 
                                            doc.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                                        }`} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{doc.user?.name || "Unknown User"}</p>
                                    <p className="text-xs text-slate-500 truncate">{doc.user?.email}</p>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
