'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BriefcaseIcon,
    MapPinIcon,
    ClockIcon,
    SparklesIcon,
    CheckCircleIcon,
    XMarkIcon,
    ArrowRightIcon,
    BuildingOffice2Icon,
    HeartIcon,
    AcademicCapIcon,
    CurrencyRupeeIcon,
    DevicePhoneMobileIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { modalVariants, backdropVariants, slideUpVariants } from '@/lib/motion';

const PERKS = [
    {
        icon: DevicePhoneMobileIcon,
        title: 'Top-Tier Tech Hardware',
        description: 'Choose your weapon of choice — MacBook Pro M-series, high-performance PC workstation, dual 4K monitors, and ergonomic setups.',
        bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    {
        icon: CurrencyRupeeIcon,
        title: 'Competitive Pay & ESOPs',
        description: 'Top-of-market base compensation, performance bonuses, and meaningful stock options so everyone shares in our collective upside.',
        bg: 'bg-blue-50 text-[#0859C5] border-blue-200/60',
    },
    {
        icon: HeartIcon,
        title: 'Comprehensive Healthcare',
        description: 'Zero-deductible health insurance covering you and your immediate family, including mental wellness consultations.',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
        icon: AcademicCapIcon,
        title: 'Learning & Growth Stipend',
        description: '₹50,000 annual education grant for tech certifications, industry conferences, books, and masterclasses.',
        bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    },
    {
        icon: BuildingOffice2Icon,
        title: 'Hybrid & Flexible Work',
        description: 'Modern collaborative hubs in New Delhi, Bengaluru, and Mumbai with high autonomy and flexible work-from-home options.',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    },
    {
        icon: SparklesIcon,
        title: 'Rapid Meritocracy',
        description: 'Zero corporate red tape. Fast-track promotions based purely on business impact, innovation, and customer obsession.',
        bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
    },
];

const JOB_OPENINGS = [
    {
        id: 'eng-fullstack',
        title: 'Senior Full Stack Engineer',
        department: 'Engineering & Product',
        location: 'New Delhi (HQ) / Hybrid',
        type: 'Full-Time',
        experience: '3–6 Years',
        tag: 'Hot Opening',
        description: 'Build robust, scalable rental checkout workflows, microservices, and warehouse asset automation systems using Next.js, Node.js, and MongoDB.',
        requirements: [
            'Expertise in React 19, Next.js (App Router), and modern state management',
            'Strong proficiency with Node.js/Express REST APIs and MongoDB',
            'Experience building payment gateway integrations (Razorpay, Cashfree)',
            'Obsession with 60fps UI micro-interactions and performance optimization',
        ],
    },
    {
        id: 'ops-qc-lead',
        title: 'Hardware QC & Diagnostic Lead',
        department: 'Quality & Operations',
        location: 'New Delhi / Bengaluru',
        type: 'Full-Time',
        experience: '2–5 Years',
        tag: 'Urgent',
        description: 'Direct our technical testing laboratory, overseeing pre-dispatch stress tests, thermal diagnostics, and automated return data sanitization.',
        requirements: [
            'Extensive hands-on experience diagnosing Apple MacBooks, enterprise servers, and workstations',
            'Familiarity with DoD 5220.22-M drive sanitization and firmware flash recovery',
            'Strong leadership skills managing lab technicians and QA benchmarks',
        ],
    },
    {
        id: 'sales-enterprise',
        title: 'Enterprise Account Executive (B2B Leasing)',
        department: 'Corporate Sales',
        location: 'Mumbai / Hybrid',
        type: 'Full-Time',
        experience: '3–7 Years',
        tag: 'High Incentive',
        description: 'Drive strategic partnerships and hardware rental contracts with funded tech startups, MNCs, film production houses, and IT enterprises.',
        requirements: [
            'Proven track record in B2B corporate sales or enterprise IT leasing in India',
            'Strong rolodex of CTOs, procurement heads, and IT infrastructure managers',
            'Superb contract negotiation, presentation, and client retention skills',
        ],
    },
    {
        id: 'prod-designer',
        title: 'Product Designer (UI / UX)',
        department: 'Engineering & Product',
        location: 'Remote / New Delhi',
        type: 'Full-Time',
        experience: '2–5 Years',
        tag: 'Design',
        description: 'Design intuitive, frictionless mobile and desktop experiences that redefine how businesses and individuals browse and rent technology.',
        requirements: [
            'High-craft Figma mastery with systems-level design thinking',
            'Strong portfolio demonstrating e-commerce, checkout, or SaaS workflows',
            'Deep empathy for clean typography, micro-animations, and responsive behavior',
        ],
    },
    {
        id: 'logistics-supervisor',
        title: 'Hub Logistics & Dispatch Supervisor',
        department: 'Operations & Logistics',
        location: 'Bengaluru',
        type: 'Full-Time',
        experience: '2–4 Years',
        tag: 'Operations',
        description: 'Coordinate time-critical doorstep delivery fleets, asset tracking, and reverse logistics pickups across the metro Bengaluru region.',
        requirements: [
            'Hands-on experience in same-day dispatch or high-value electronics logistics',
            'Familiarity with warehouse management software and courier tracking APIs',
            'Problem solver adept at route optimization and customer delivery coordination',
        ],
    },
    {
        id: 'kyc-specialist',
        title: 'Customer Onboarding & KYC Specialist',
        department: 'Customer Success',
        location: 'New Delhi (HQ)',
        type: 'Full-Time',
        experience: '1–3 Years',
        tag: 'Growth',
        description: 'Ensure fast, frictionless customer onboarding by reviewing identity documents, business GSTINs, and fraud prevention checkpoints.',
        requirements: [
            'Experience in KYC validation, risk assessment, or customer verification',
            'Strong verbal and written communication in English and Hindi',
            'Detail-oriented with strict adherence to data security and privacy guidelines',
        ],
    },
];

const DEPARTMENTS = [
    'All Departments',
    'Engineering & Product',
    'Corporate Sales',
    'Operations & Logistics',
    'Quality & Operations',
    'Customer Success',
];

const LOCATIONS = ['All Locations', 'New Delhi (HQ)', 'Bengaluru', 'Mumbai', 'Remote'];

export default function CareersPage() {
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [selectedLoc, setSelectedLoc] = useState('All Locations');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeJob, setActiveJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        linkedin: '',
        resumeUrl: '',
        notes: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredJobs = JOB_OPENINGS.filter((job) => {
        const matchesDept = selectedDept === 'All Departments' || job.department === selectedDept;
        const matchesLoc =
            selectedLoc === 'All Locations' ||
            job.location.toLowerCase().includes(selectedLoc.toLowerCase().replace(' (hq)', ''));
        const matchesQuery =
            !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.department.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesLoc && matchesQuery;
    });

    const handleOpenApply = (job) => {
        setActiveJob(job);
        setIsApplying(true);
        setFormSubmitted(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setFormSubmitted(true);
        }, 800);
    };

    return (
        <div className="font-sans text-gray-800 pb-24">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-[#0A1628] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-600/20 via-[#FFCF46]/15 to-purple-600/20 blur-3xl pointer-events-none rounded-full" />

                <div className="max-w-[1150px] mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-[#FFCF46] mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#FFCF46] animate-pulse" />
                        We're Hiring Across India • Join Our Mission
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
                        Shape the Future of Tech Access &amp;{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCF46] via-amber-300 to-yellow-400">
                            Circular Hardware
                        </span>
                    </h1>

                    <p className="mt-6 text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                        Join India's premier device rental ecosystem powering 30,000+ startups, creators, and enterprise teams with on-demand computing.
                    </p>

                    {/* Stats Strip */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto text-center">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="text-2xl sm:text-3xl font-bold text-white">401+</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Cities Covered</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="text-2xl sm:text-3xl font-bold text-[#FFCF46]">90,000+</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Active Devices</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="text-2xl sm:text-3xl font-bold text-white">30,000+</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Happy Clients</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">4.9 ★</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Employee &amp; Client Score</p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="#open-roles"
                            className="px-8 py-3.5 rounded-xl bg-[#FFCF46] text-gray-950 font-bold text-sm sm:text-base hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95"
                        >
                            View Open Roles ({JOB_OPENINGS.length})
                        </a>
                        <a
                            href="#culture"
                            className="px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm sm:text-base hover:bg-white/20 transition-all backdrop-blur-sm border border-white/15 active:scale-95"
                        >
                            Why IndianRentals?
                        </a>
                    </div>
                </div>
            </div>

            {/* Perks & Benefits Section */}
            <div id="culture" className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#0859C5] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                        Culture &amp; Benefits
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">
                        Engineered for High Performance &amp; Happiness
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mt-3">
                        We invest in our people so they can do the most meaningful, fulfilling work of their careers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PERKS.map((perk, i) => {
                        const Icon = perk.icon;
                        return (
                            <div
                                key={i}
                                className="p-7 rounded-3xl bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${perk.bg}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0859C5] transition-colors">
                                        {perk.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2.5 leading-relaxed">
                                        {perk.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Job Openings Catalog */}
            <div id="open-roles" className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="border-t border-gray-200 pt-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/70">
                                Current Openings
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">
                                Explore Open Opportunities
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base mt-2">
                                Find your next career leap across our offices and distributed squads.
                            </p>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                            Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> positions
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 mb-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            {/* Search */}
                            <div className="sm:col-span-6">
                                <input
                                    type="text"
                                    placeholder="Search by role, keyword, or technology…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0859C5] focus:border-transparent transition"
                                />
                            </div>

                            {/* Dept Selector */}
                            <div className="sm:col-span-3">
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0859C5] text-gray-700"
                                >
                                    {DEPARTMENTS.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Selector */}
                            <div className="sm:col-span-3">
                                <select
                                    value={selectedLoc}
                                    onChange={(e) => setSelectedLoc(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0859C5] text-gray-700"
                                >
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Quick filter pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-200/60">
                            <span className="text-xs text-gray-500 font-semibold mr-1">Department:</span>
                            {DEPARTMENTS.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`text-xs px-3 py-1 rounded-lg font-medium transition ${
                                        selectedDept === dept
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                                    }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Jobs List */}
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-white border border-gray-200 rounded-3xl">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
                                <BriefcaseIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">No matching positions found</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                                We didn't find any openings matching your selected filters. Try broadening your search or send us an open application.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedDept('All Departments');
                                    setSelectedLoc('All Locations');
                                    setSearchQuery('');
                                }}
                                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                        <div className="space-y-2.5 max-w-2xl">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0859C5] border border-blue-100">
                                                    {job.department}
                                                </span>
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                                    {job.tag}
                                                </span>
                                            </div>

                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#0859C5] transition-colors">
                                                {job.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-1">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                                                    {job.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <ClockIcon className="w-4 h-4 text-gray-400" />
                                                    {job.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                                                    {job.experience}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                                            <button
                                                onClick={() => handleOpenApply(job)}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0859C5] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                Apply Now
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* General Application Banner */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#102340] text-white border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="space-y-3 max-w-xl text-center md:text-left">
                        <span className="text-xs uppercase font-bold tracking-widest text-[#FFCF46] bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
                            Open Application
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                            Don't see your specific role?
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                            We're always excited to connect with exceptional engineers, logistics leaders, hardware experts, and operators. Send us your resume and a short note on how you can make a difference.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <a
                            href="mailto:careers@indianrenters.com?subject=Open%20Application%20-%20IndianRentals"
                            className="px-8 py-4 rounded-xl bg-[#FFCF46] text-gray-950 font-bold text-sm sm:text-base hover:bg-yellow-400 transition-all shadow-lg active:scale-95 inline-block"
                        >
                            Email Your CV to careers@indianrenters.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Application Drawer / Modal */}
            <AnimatePresence>
                {isApplying && activeJob && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            variants={backdropVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            onClick={() => setIsApplying(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            variants={modalVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 my-8"
                        >
                            {/* Header */}
                            <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200 flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-bold text-[#0859C5] uppercase tracking-wider">
                                        Application Form
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                                        {activeJob.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {activeJob.department} • {activeJob.location} • {activeJob.type}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsApplying(false)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white transition"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8">
                                {formSubmitted ? (
                                    <div className="text-center py-10 space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                            <CheckCircleIcon className="w-10 h-10" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900">Application Received!</h4>
                                        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
                                            Thank you for applying for the <strong>{activeJob.title}</strong> role. Our talent acquisition team will review your profile and reach out within 3–5 business days.
                                        </p>
                                        <div className="pt-4">
                                            <button
                                                onClick={() => {
                                                    setIsApplying(false);
                                                    setFormSubmitted(false);
                                                }}
                                                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
                                            >
                                                Back to Careers
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFormSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="John Doe"
                                                    value={formData.fullName}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, fullName: e.target.value })
                                                    }
                                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, phone: e.target.value })
                                                    }
                                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Total Experience
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 4 Years"
                                                    value={formData.experience}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, experience: e.target.value })
                                                    }
                                                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                LinkedIn or Portfolio URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://linkedin.com/in/username"
                                                value={formData.linkedin}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, linkedin: e.target.value })
                                                }
                                                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Resume / CV Link (Google Drive / Dropbox) *
                                            </label>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://drive.google.com/file/..."
                                                value={formData.resumeUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, resumeUrl: e.target.value })
                                                }
                                                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                            />
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                Ensure public link access is enabled for viewing.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Short Cover Note / Why IndianRentals?
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Tell us about a recent project you built or why this role excites you…"
                                                value={formData.notes}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, notes: e.target.value })
                                                }
                                                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0859C5]"
                                            />
                                        </div>

                                        <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => setIsApplying(false)}
                                                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-7 py-2.5 rounded-xl bg-[#0859C5] hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Submitting…
                                                    </>
                                                ) : (
                                                    'Submit Application'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
