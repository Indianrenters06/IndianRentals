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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                className="bg-white shadow-2xl flex flex-col md:flex-row relative w-full max-w-[808px] h-auto md:h-[480px] max-h-[90vh] overflow-y-auto md:overflow-hidden"
                style={{
                    borderRadius: '18px',
                    border: '1px solid hsla(0, 0%, 93%, 1)',
                    padding: '8px',
                    gap: '21px',
                    opacity: 1
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition-all z-20"
                >
                    <AiOutlineClose size={14} />
                </button>

                {/* Left Side: Map (desktop only) */}
                <div className="hidden md:block flex-1 bg-gray-100 rounded-[12px] overflow-hidden relative">
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
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="text-red-500 drop-shadow-lg scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div
                    className="flex flex-col px-2.5 md:pr-2 md:px-0 py-2 overflow-y-auto w-full md:w-[381px] h-auto md:h-[464px]"
                >
                    <form onSubmit={handleSubmit} className="flex flex-col" style={{ height: '430px' }}>
                        {/* Fields Container */}
                        <div className="flex flex-col w-full" style={{ gap: '28px', marginTop: '35px' }}>
                            <div className="flex flex-col w-full" style={{ gap: '4px' }}>
                                <label className="text-sm font-medium text-[#1D1D1F]">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter you full name"
                                    className="w-full px-4 rounded-[6px] border outline-none transition-all placeholder-gray-300 text-[15px]"
                                    style={{
                                        height: '39px',
                                        borderColor: 'hsla(0, 0%, 89%, 1)',
                                        background: 'hsla(0, 0%, 100%, 1)'
                                    }}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col" style={{ gap: '4px' }}>
                                    <label className="text-sm font-medium text-[#1D1D1F]">Street Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="addressLine"
                                        required
                                        value={formData.addressLine}
                                        onChange={handleChange}
                                        placeholder="Placeholder"
                                        className="w-full px-4 rounded-[6px] border outline-none transition-all placeholder-gray-300 text-[15px]"
                                        style={{
                                            height: '39px',
                                            borderColor: 'hsla(0, 0%, 89%, 1)',
                                            background: 'hsla(0, 0%, 100%, 1)'
                                        }}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col" style={{ gap: '4px' }}>
                                    <label className="text-sm font-medium text-[#1D1D1F]">City / Region <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Placeholder"
                                        className="w-full px-4 rounded-[6px] border outline-none transition-all placeholder-gray-300 text-[15px]"
                                        style={{
                                            height: '39px',
                                            borderColor: 'hsla(0, 0%, 89%, 1)',
                                            background: 'hsla(0, 0%, 100%, 1)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col" style={{ gap: '4px' }}>
                                    <label className="text-sm font-medium text-[#1D1D1F]">Zip Code <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        required
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="Placeholder"
                                        className="w-full px-4 rounded-[6px] border outline-none transition-all placeholder-gray-300 text-[15px]"
                                        style={{
                                            height: '39px',
                                            borderColor: 'hsla(0, 0%, 89%, 1)',
                                            background: 'hsla(0, 0%, 100%, 1)'
                                        }}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col" style={{ gap: '4px' }}>
                                    <label className="text-sm font-medium text-[#1D1D1F]">Country <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Placeholder"
                                        className="w-full px-4 rounded-[6px] border outline-none transition-all placeholder-gray-300 text-[15px]"
                                        style={{
                                            height: '39px',
                                            borderColor: 'hsla(0, 0%, 89%, 1)',
                                            background: 'hsla(0, 0%, 100%, 1)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full" style={{ gap: '4px' }}>
                                <label className="text-sm font-medium text-[#1D1D1F]">Phone No. <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Placeholder"
                                    className="w-full px-4 rounded-[6px] border outline-none transition-all placeholder-gray-300 text-[15px]"
                                    style={{
                                        height: '39px',
                                        borderColor: 'hsla(0, 0%, 89%, 1)',
                                        background: 'hsla(0, 0%, 100%, 1)'
                                    }}
                                />
                            </div>
                        </div>

                            <div className="flex items-center mt-6 w-full" style={{ gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    id="billing"
                                    name="isBillingSame"
                                    checked={formData.isBillingSame}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0 accent-black cursor-pointer"
                                />
                                <label htmlFor="billing" className="text-xs text-[#1D1D1F] font-medium cursor-pointer">Billing Address is the same as the shipping address <span className="text-red-500">*</span></label>
                            </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="flex justify-center items-center transition-all text-black font-medium text-[15px] font-sans w-full"
                                style={{
                                    height: '35px',
                                    gap: '2px',
                                    borderRadius: '28px', // rounded-4xl approx
                                    border: '1px solid hsla(0, 0%, 8%, 1)',
                                    padding: '6px 20px',
                                    background: 'transparent'
                                }}
                            >
                                Continue to payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
