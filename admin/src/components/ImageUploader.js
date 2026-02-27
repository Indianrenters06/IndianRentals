"use client";

/**
 * ImageUploader
 *
 * Reusable component for the admin panel.
 * Lets the user click or drag-and-drop images, uploads to POST /api/upload,
 * gets back a Cloudinary URL, and calls onUpload(url) / onUploadMany(urls[]).
 *
 * Props:
 *   onUpload(url)          – called with a single Cloudinary URL after upload
 *   onUploadMany(urls[])   – called with array; used when multiple=true
 *   multiple               – allow selecting multiple files at once (default false)
 *   label                  – optional label text above the dropzone
 *   existingUrl            – show an existing image as preview (single mode)
 *   className              – extra wrapper class
 */

import { useRef, useState } from "react";
import { Spinner } from "@heroui/react";
import { CloudArrowUp, Image as PhosphorImage, CheckCircle, Warning } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("adminToken") : null);

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export default function ImageUploader({
    onUpload,
    onUploadMany,
    multiple = false,
    label = "Product Image",
    existingUrl = "",
    className = "",
}) {
    const fileRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(existingUrl);
    const [previews, setPreviews] = useState([]);   // for multiple mode
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // ── Upload logic ──────────────────────────────────────────────────────────
    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;
        setError("");
        setUploading(true);
        setSuccess(false);

        try {
            const formData = new FormData();
            Array.from(files).forEach(f => formData.append("image", f));

            const res = await fetch(`${API}/api/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: formData,
            });

            if (!res.ok) {
                const e = await res.json();
                throw new Error(e.message || "Upload failed");
            }

            const data = await res.json();
            // data.images = [ url1, url2, … ]
            const urls = data.images || (data.image ? [data.image] : []);

            if (urls.length === 0) throw new Error("No URLs returned from server");

            if (!multiple) {
                setPreview(urls[0]);
                onUpload?.(urls[0]);
            } else {
                setPreviews(prev => {
                    const merged = [...prev, ...urls];
                    onUploadMany?.(merged);
                    return merged;
                });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // ── Event handlers ────────────────────────────────────────────────────────
    const handleFileChange = (e) => uploadFiles(e.target.files);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        uploadFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);

    const removeSingle = () => { setPreview(""); onUpload?.(""); };
    const removeMulti = (idx) => {
        setPreviews(prev => {
            const next = prev.filter((_, i) => i !== idx);
            onUploadMany?.(next);
            return next;
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {label}
                </p>
            )}

            {/* Drop zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && fileRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200
                    ${dragging
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 scale-[1.01]"
                        : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 bg-white dark:bg-slate-900/50"
                    }
                `}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept={ACCEPT}
                    multiple={multiple}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                        <Spinner size="md" color="secondary" />
                        <p className="text-sm font-medium text-slate-500">Uploading to Cloudinary…</p>
                    </div>
                ) : (
                    <>
                        <div className={`p-3 rounded-xl ${dragging ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                            <CloudArrowUp
                                size={32}
                                weight="duotone"
                                className={dragging ? "text-indigo-500" : "text-slate-400"}
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {dragging ? "Drop to upload" : "Click or drag & drop"}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                JPG, PNG, WebP {multiple ? "· select multiple files" : "· one file"}
                            </p>
                        </div>
                    </>
                )}

                {/* Status badges — overlaid top-right */}
                {success && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-sm">
                        <CheckCircle size={12} weight="fill" /> Uploaded!
                    </div>
                )}
                {error && !uploading && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold shadow-sm">
                        <Warning size={12} weight="fill" /> {error}
                    </div>
                )}
            </div>

            {/* Single-mode preview */}
            {!multiple && preview && (
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 group">
                    <img
                        src={preview}
                        alt="Uploaded preview"
                        className="w-full max-h-64 object-contain p-2"
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); removeSingle(); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-base font-bold shadow-lg hover:bg-red-600"
                        title="Remove image"
                    >
                        ×
                    </button>
                    <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80">
                        <p className="text-[10px] font-mono text-slate-400 truncate">{preview}</p>
                    </div>
                </div>
            )}

            {/* Multi-mode preview grid */}
            {multiple && previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {previews.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <img src={url} alt={`img-${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeMulti(idx)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md hover:bg-red-600"
                                title="Remove"
                            >
                                ×
                            </button>
                            {idx === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 text-[9px] font-bold text-center py-0.5 bg-indigo-600 text-white">
                                    PRIMARY
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
