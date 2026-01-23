import React from 'react';
import { BsCheckCircleFill, BsCreditCard } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

const OrderSummary = ({
    securityAmount,
    deliveryCharges,
    monthlyRentTotal,
    totalGST,
    totalOneTime,
    payToday,
    savedAmount,
    onCheckout,
    btnText = "Continue to checkout",
    showButton = true
}) => {
    return (
        <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Order Summary</h2>

            {/* Breakdown Container */}
            <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="mb-4">
                    <h3 className="font-medium text-[#1D1D1F] text-[15px] mb-2">One Time Payment</h3>
                    <div className="flex justify-between text-[#6e6e73] text-[13px] mb-1 font-normal">
                        <span>Security Amount</span>
                        <span className="text-[#1D1D1F]">₹{securityAmount}</span>
                    </div>
                    <div className="flex justify-between text-[#6e6e73] text-[13px] font-normal">
                        <span>Delivery Charges</span>
                        <span className="text-[#1D1D1F]">₹{deliveryCharges}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="mb-2">
                    <h3 className="font-medium text-[#1D1D1F] text-[15px] mb-1">Monthly Rental Breakdown</h3>
                    <div className="flex justify-between text-[#6e6e73] text-[13px] mb-1 font-normal">
                        <span>Monthly Rent</span>
                        <span className="text-[#1D1D1F]">₹{monthlyRentTotal}/mo</span>
                    </div>
                    <div className="flex justify-between text-[#6e6e73] text-[13px] font-normal">
                        <span>GST*</span>
                        <span className="text-[#1D1D1F]">₹{totalGST}/mo</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="flex justify-between items-center">
                    <span className="text-[16px] font-medium text-[#1D1D1F]">Subtotal (incl. GST)</span>
                    <span className="text-[16px] font-medium text-[#1D1D1F]">₹{totalOneTime}</span>
                </div>
            </div>

            {/* Pay Today Section */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <div className="p-4 bg-white">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                            <div className="mt-1 text-[#00C853]">
                                <BsCheckCircleFill size={20} />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-bold text-[#1D1D1F] ">Total Amount To Pay Today</h3>
                                <p className="text-[#6e6e73] text-[13px] mt-1">Partial Monthly Rental Fees</p>
                            </div>
                        </div>
                        <span className="text-[24px] font-medium text-[#00C853] leading-none">₹{payToday}</span>
                    </div>
                </div>

                {/* Yellow Disclaimer */}
                <div className="bg-[#FFF9E6] p-4 border-t border-dashed border-[#F5D485] mx-2 mb-2 rounded-lg">
                    <div className="flex gap-3">
                        <div className="mt-1 text-[#9A7F40]">
                            <BsCreditCard size={16} />
                        </div>
                        <p className="text-[12px] text-[#4A4A4A] leading-relaxed">
                            By paying this amount, you are securing your order and proceeding to KYC verification. The remaining balance of your monthly rental will be charged only after your KYC is approved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Savings Message */}
            <div className="bg-[#E3F9E5] border border-[#C6EBC9] rounded-[10px] py-2 flex items-center justify-center gap-2 mb-4">
                <span className="text-[14px] font-medium text-[#0A5C22]">🎉 You saved ₹{savedAmount.toFixed(2)} on this order</span>
            </div>

            {/* Checkout Button */}
            {showButton && (
                <button
                    onClick={onCheckout}
                    className="w-full bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-[16px] transition-colors shadow-sm"
                >
                    {btnText} <FaArrowRight className="text-sm" />
                </button>
            )}
        </div>
    );
};

export default OrderSummary;
