import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const AddressModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        phone: '',
        isBillingSame: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                country: initialData.country || '',
                isBillingSame: initialData.isBillingSame || false
            });
        } else {
            setFormData({
                name: '',
                addressLine: '',
                city: '',
                state: '',
                pincode: '',
                country: '',
                phone: '',
                isBillingSame: false
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[80vh] mt-20">

                {/* Left Side: Map Placeholder */}
                <div className="md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full hidden md:block">
                    {/* Placeholder for map */}
                    <div className="absolute inset-0 bg-gray-200">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754721313!3d28.52728034389636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1706040000000!5m2!1sen!2sin"
                            title="Google Map"
                        ></iframe>
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center pb-8">
                            <div className="text-red-600 drop-shadow-md transform -translate-y-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-6 relative overflow-y-auto w-full">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                    >
                        <AiOutlineClose size={20} />
                    </button>

                    <form onSubmit={handleSubmit} className="mt-2 space-y-3">

                        <div className="space-y-1">
                            <label className="text-xs text-gray-600 block font-normal">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter you full name"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none transition-all placeholder-gray-300 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-600 block font-normal">Street Address <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="addressLine"
                                    required
                                    value={formData.addressLine}
                                    onChange={handleChange}
                                    placeholder="Placeholder"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none transition-all placeholder-gray-300 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-600 block font-normal">City / Region <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Placeholder"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none transition-all placeholder-gray-300 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-600 block font-normal">Zip Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Placeholder"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none transition-all placeholder-gray-300 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-600 block font-normal">Country <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Placeholder"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none transition-all placeholder-gray-300 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-600 block font-normal">Phone No. <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Placeholder"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0 outline-none transition-all placeholder-gray-300 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="billing"
                                name="isBillingSame"
                                checked={formData.isBillingSame}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                            />
                            <label htmlFor="billing" className="text-xs text-gray-900 font-medium cursor-pointer">Billing Address is the same as the shipping address <span className="text-red-500">*</span></label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full px-3 py-2 rounded-xl bg-[#333333] hover:bg-black text-white font-normal shadow-sm transition-colors flex justify-center items-center gap-2 text-base"
                            >
                                Continue to payment <span className="text-lg">→</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
