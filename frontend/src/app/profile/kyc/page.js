'use client';

import React, { useState, useEffect } from 'react';
import { FaFingerprint, FaCheck, FaCloudUploadAlt, FaFileAlt } from 'react-icons/fa';
import { saveKYCData, uploadKYCFiles } from '../../../services/kycService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function KYCPage() {
    const router = useRouter();
    const [customerType, setCustomerType] = useState('Customer');
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log('KYC Page Mounted. Current Step:', currentStep, 'Customer Type:', customerType);
    }, [currentStep, customerType]);

    // Form State
    const [formData, setFormData] = useState({
        personalDetails: { name: '', fatherName: '', fatherPhone: '', email: '', phone: '', permanentAddress: '', currentAddress: '', city: '', state: '', pincode: '', country: 'India' },
        companyDetails: { companyName: '', companyType: '', employeeCount: '', designation: '', serviceDuration: '', companyEmail: '', referenceAddress: '', city: '', state: '', pincode: '', country: 'India' },
        documents: { aadharFront: null, aadharBack: null, panCard: null, other: null }
    });

    const handleChange = (section, field, value) => {
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleFileChange = (field, file) => {
        setFormData(prev => ({ ...prev, documents: { ...prev.documents, [field]: file } }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateStep1 = () => {
        const { name, email, phone, city, state, pincode, permanentAddress, fatherName, fatherPhone } = formData.personalDetails;
        let newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!fatherName) newErrors.fatherName = "Father's Name is required";
        if (!fatherPhone) newErrors.fatherPhone = "Father's Phone is required";
        if (!email) newErrors.email = 'Email is required';
        if (!phone) newErrors.phone = 'Phone is required';
        if (!permanentAddress) newErrors.permanentAddress = 'Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!pincode) newErrors.pincode = 'Pincode is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const { companyName, companyType, employeeCount, companyEmail, designation, serviceDuration } = formData.companyDetails;
        let newErrors = {};
        if (!companyName) newErrors.companyName = 'Company Name is required';
        if (!companyType) newErrors.companyType = 'Company Type is required';
        if (!employeeCount) newErrors.employeeCount = 'Employee Count is required';
        if (!companyEmail) newErrors.companyEmail = 'Company Email is required';
        if (!designation) newErrors.designation = 'Designation is required';
        if (!serviceDuration) newErrors.serviceDuration = 'Service Duration is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const { aadharFront, aadharBack, panCard } = formData.documents;
        let newErrors = {};
        if (!aadharFront) newErrors.aadharFront = 'Aadhar Front is required';
        if (!aadharBack) newErrors.aadharBack = 'Aadhar Back is required';
        if (!panCard) newErrors.panCard = 'PAN Card is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        console.log('Attempting Next from Step:', currentStep);
        if (currentStep === 1) {
            if (!validateStep1()) { console.log('Step 1 Validation Failed', errors); return; }
        }
        if (currentStep === 2 && customerType === 'Company') {
            if (!validateStep2()) { console.log('Step 2 Validation Failed', errors); return; }
        }
        if (currentStep === 3) {
            if (!validateStep3()) { console.log('Step 3 Validation Failed', errors); return; }
        }

        if (currentStep === 1 && customerType === 'Customer') {
            console.log('Skipping Step 2 for Customer');
            setCurrentStep(3);
        } else if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (currentStep === 3 && customerType === 'Customer') {
            setCurrentStep(1);
        } else if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const docFormData = new FormData();
            if (formData.documents.aadharFront) docFormData.append('identityProof', formData.documents.aadharFront);
            if (formData.documents.aadharBack) docFormData.append('addressProof', formData.documents.aadharBack);
            if (formData.documents.panCard) docFormData.append('bankStatement', formData.documents.panCard);

            let uploadedDocs = {};
            if (formData.documents.aadharFront || formData.documents.aadharBack || formData.documents.panCard) {
                uploadedDocs = await uploadKYCFiles(docFormData);
            }

            const kycPayload = {
                personalDetails: formData.personalDetails,
                companyDetails: customerType === 'Company' ? formData.companyDetails : {},
                referenceDetails: {},
                documents: uploadedDocs
            };

            await saveKYCData(kycPayload);
            Swal.fire({ title: 'Application Submitted!', text: 'Your KYC is under review.', icon: 'success', confirmButtonText: 'Go to Profile' }).then(() => router.push('/profile'));
        } catch (error) {
            console.error(error);
            Swal.fire({ title: 'Submission Failed', text: error.response?.data?.message || 'Try again.', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-medium text-gray-700">KYC & Documentation V2</h1>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-full w-fit mb-8">
                <button onClick={() => { setCustomerType('Customer'); setCurrentStep(1); setErrors({}); }} className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${customerType === 'Customer' ? 'bg-[#333] text-white' : 'text-gray-600'}`}>Customer</button>
                <button onClick={() => { setCustomerType('Company'); setCurrentStep(1); setErrors({}); }} className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${customerType === 'Company' ? 'bg-[#333] text-white' : 'text-gray-600'}`}>Company</button>
            </div>

            {/* Steps & Content */}
            <div className="flex justify-center mb-10 mt-4">
                <div className="flex items-center w-full max-w-xl relative">
                    <div className="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-10"></div>
                    <div className="absolute left-0 top-1/2 h-px bg-[#00c853] -z-10 transition-all duration-300" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
                    {[1, 2, 3, 4].map((step) => {
                        const isCompleted = step < currentStep;
                        const isActive = step === currentStep;
                        return (
                            <div key={step} className="flex-1 flex justify-center first:justify-start last:justify-end">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium z-10 border transition-all duration-300 ${isCompleted ? 'bg-[#00c853] border-[#00c853] text-white' : isActive ? 'bg-white border-gray-800 text-gray-900 shadow-sm' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {isCompleted ? <FaCheck size={14} /> : step}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-3xl p-1 border border-gray-100">
                {currentStep === 1 && (
                    <>
                        <div className="mb-8"><h2 className="text-2xl font-medium text-gray-700 mb-2">Personal Details</h2><div className="h-px bg-gray-200 w-full"></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                            <div className="md:col-span-2"><TextInput label="Full Name" required error={errors.name} value={formData.personalDetails.name} onChange={(e) => handleChange('personalDetails', 'name', e.target.value)} /></div>
                            <TextInput label="Father's Name" required error={errors.fatherName} value={formData.personalDetails.fatherName} onChange={(e) => handleChange('personalDetails', 'fatherName', e.target.value)} />
                            <TextInput label="Father's Phone" required error={errors.fatherPhone} value={formData.personalDetails.fatherPhone} onChange={(e) => handleChange('personalDetails', 'fatherPhone', e.target.value)} />
                            <div className="md:col-span-2"><TextInput label="Email Address" required error={errors.email} value={formData.personalDetails.email} onChange={(e) => handleChange('personalDetails', 'email', e.target.value)} /></div>
                            <div className="md:col-span-2"><TextInput label="Mobile Number" required error={errors.phone} value={formData.personalDetails.phone} onChange={(e) => handleChange('personalDetails', 'phone', e.target.value)} /></div>
                            <div className="md:col-span-2"><TextInput label="Permanent Address" required error={errors.permanentAddress} value={formData.personalDetails.permanentAddress} onChange={(e) => handleChange('personalDetails', 'permanentAddress', e.target.value)} /></div>
                            <TextInput label="City" required error={errors.city} value={formData.personalDetails.city} onChange={(e) => handleChange('personalDetails', 'city', e.target.value)} />
                            <TextInput label="State" required error={errors.state} value={formData.personalDetails.state} onChange={(e) => handleChange('personalDetails', 'state', e.target.value)} />
                            <TextInput label="Pincode" required error={errors.pincode} value={formData.personalDetails.pincode} onChange={(e) => handleChange('personalDetails', 'pincode', e.target.value)} />
                            <TextInput label="Country" required value={formData.personalDetails.country} onChange={(e) => handleChange('personalDetails', 'country', e.target.value)} />
                        </div>
                        <div className="flex justify-end"><button onClick={handleNext} className="bg-[#333] hover:bg-black text-white font-medium py-3 px-8 rounded-xl transition-all text-lg shadow-lg flex items-center">{customerType === 'Customer' ? 'Proceed to Documents' : 'Proceed to Company Details'}</button></div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div className="mb-8"><h2 className="text-2xl font-medium text-gray-700 mb-2">Company Details</h2><div className="h-px bg-gray-200 w-full"></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                            <div className="md:col-span-2"><TextInput label="Company Name" required error={errors.companyName} value={formData.companyDetails.companyName} onChange={(e) => handleChange('companyDetails', 'companyName', e.target.value)} /></div>
                            <TextInput label="Type of Company" required error={errors.companyType} value={formData.companyDetails.companyType} onChange={(e) => handleChange('companyDetails', 'companyType', e.target.value)} />
                            <TextInput label="No. of Employees" required error={errors.employeeCount} value={formData.companyDetails.employeeCount} onChange={(e) => handleChange('companyDetails', 'employeeCount', e.target.value)} />
                            <div className="md:col-span-2"><TextInput label="Designation" required error={errors.designation} value={formData.companyDetails.designation} onChange={(e) => handleChange('companyDetails', 'designation', e.target.value)} /></div>
                            <TextInput label="Service Duration" required error={errors.serviceDuration} value={formData.companyDetails.serviceDuration} onChange={(e) => handleChange('companyDetails', 'serviceDuration', e.target.value)} />
                            <TextInput label="Official Email" required error={errors.companyEmail} value={formData.companyDetails.companyEmail} onChange={(e) => handleChange('companyDetails', 'companyEmail', e.target.value)} />
                        </div>
                        <div className="flex gap-4 justify-end mt-6"><button onClick={handleBack} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl">Back</button><button onClick={handleNext} className="px-6 py-3 bg-[#333] hover:bg-black text-white font-medium rounded-xl shadow-lg">Proceed to Documents</button></div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <div className="mb-8"><h2 className="text-2xl font-medium text-gray-700 mb-2">Upload Documents</h2><p className="text-sm text-gray-500 mb-4">Please upload clear images (JPG/PNG/PDF).</p><div className="h-px bg-gray-200 w-full"></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <FileUploadInput label="Aadhar Card (Front)" file={formData.documents.aadharFront} error={errors.aadharFront} onChange={(e) => handleFileChange('aadharFront', e.target.files[0])} />
                            <FileUploadInput label="Aadhar Card (Back)" file={formData.documents.aadharBack} error={errors.aadharBack} onChange={(e) => handleFileChange('aadharBack', e.target.files[0])} />
                            <FileUploadInput label="PAN Card" file={formData.documents.panCard} error={errors.panCard} onChange={(e) => handleFileChange('panCard', e.target.files[0])} />
                        </div>
                        <div className="flex gap-4 justify-end mt-6"><button onClick={handleBack} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl">Back</button><button onClick={handleNext} className="px-6 py-3 bg-[#333] hover:bg-black text-white font-medium rounded-xl shadow-lg">Review & Submit</button></div>
                    </>
                )}

                {currentStep === 4 && (
                    <>
                        <div className="mb-8"><h2 className="text-2xl font-medium text-gray-700 mb-2">Review & Submit</h2><div className="h-px bg-gray-200 w-full"></div></div>
                        <div className="bg-gray-50 p-6 rounded-xl mb-6">
                            <h3 className="font-semibold text-lg mb-4">Summary</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">Name:</span> {formData.personalDetails.name}</div>
                                <div><span className="text-gray-500">Email:</span> {formData.personalDetails.email}</div>
                                <div><span className="text-gray-500">Phone:</span> {formData.personalDetails.phone}</div>
                                <div><span className="text-gray-500">City:</span> {formData.personalDetails.city}</div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-6"><button onClick={handleBack} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl">Back</button><button onClick={handleSubmit} disabled={loading} className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>{loading ? 'Submitting...' : 'Submit Application'}</button></div>
                    </>
                )}
            </div>
        </div>
    );
}

const TextInput = ({ label, required, placeholder, value, onChange, error }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type="text" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors placeholder-gray-300 ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'}`} placeholder={placeholder} value={value} onChange={onChange} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const FileUploadInput = ({ label, file, onChange, error }) => (
    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onChange} accept="image/*,application/pdf" />
        {file ? (<div className="text-green-600"><FaFileAlt size={32} className="mb-2 mx-auto" /><p className="text-sm font-medium truncate max-w-[150px]">{file.name}</p><p className="text-xs text-gray-400">Click to change</p></div>) : (<div className={error ? "text-red-500" : "text-gray-400"}><FaCloudUploadAlt size={32} className="mb-2 mx-auto" /><p className="text-sm font-medium text-gray-600">{label}</p><p className="text-xs">Drag & drop or Click to Upload</p></div>)}
        {error && <p className="text-red-500 text-xs mt-2 absolute -bottom-5 left-0 w-full text-center">{error}</p>}
    </div>
);
