'use client';

export default function FigmaPreview() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-start justify-center py-8">
      <div className="bg-white shadow-xl" style={{ width: '390px' }}>

        {/* Announcement bar */}
        <div className="bg-[#ffcf46] flex items-center justify-center py-1">
          <p className="text-[8px] font-bold text-[#333] tracking-[-0.4px] whitespace-nowrap">
            🖤 SAVE Extra 5% up to ₹100 on UPI Orders 🖤
          </p>
        </div>

        {/* Navbar */}
        <div className="bg-white border-b border-[#eee] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex flex-col justify-center gap-[4px]">
              <span className="block h-[2px] w-full bg-[#333]" />
              <span className="block h-[2px] w-full bg-[#333]" />
              <span className="block h-[2px] w-3 bg-[#333]" />
            </div>
            <div className="text-sm font-bold text-[#e6480a]">IndianRenters.com</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-[#afafaf] rounded-full px-2 py-1">
              <span className="text-[12px]">📍</span>
              <span className="text-[14px] font-medium text-[#292929]">Delhi</span>
            </div>
            <span className="text-[18px]">👤</span>
            <span className="text-[18px]">🛒</span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-[#f6f6f6] flex items-center gap-1 px-5 py-1">
          <span className="text-[8px] text-[#545454]">Overview</span>
          <span className="text-[8px] text-[#545454]">›</span>
          <span className="text-[8px] font-semibold text-black">My Orders</span>
        </div>

        {/* Main content */}
        <div className="px-5 py-[10px] flex flex-col gap-3">

          {/* My Orders / Subscriptions toggle */}
          <div className="flex gap-[10px]">
            <div className="flex-1 bg-[#333] text-[#eee] text-[14px] text-center py-[7px] rounded-[59px]">
              My Orders
            </div>
            <div className="flex-1 bg-[#eee] text-[#333] text-[14px] text-center py-[7px] rounded-[59px]">
              Subscriptions
            </div>
          </div>

          {/* Tabs - FIGMA EXACT: flex-wrap, 12px font, gap-[8px_24px] */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-start py-[10px]">
            {['All Orders', 'KYC Pending', 'KYC Under Review', 'Active Orders', 'Inactive Orders', 'Order Failed'].map((tab, i) => (
              <div key={tab} className="flex flex-col items-start gap-1 shrink-0">
                <span className={`text-[12px] font-semibold tracking-[-0.4px] whitespace-nowrap ${i === 2 ? 'text-[#0d4e9b]' : 'text-[#1f1f1f]'}`}>
                  {tab}
                </span>
                {i === 2 && <span className="h-[2px] w-full rounded-[10px] bg-[#0d4e9b]" />}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#afafaf]" />

          {/* Info banner */}
          <div className="flex items-center gap-2 bg-[#f6f6f6] border border-[#e2e2e2] rounded-[6px] px-[10px] py-[5px]">
            <span className="text-[10px] text-[#757575]">ℹ</span>
            <p className="text-[8px] font-semibold text-[#757575]">
              Please note, once the order has been your amount will be returned within 24-48 hours of cancellation
            </p>
          </div>

          {/* Order Card — FIGMA EXACT: 310px wide */}
          <div
            className="border-[1.5px] border-[#e2e2e2] rounded-[16px] bg-white overflow-hidden"
            style={{ width: '310px', boxShadow: '0px 6px 13px 0px rgba(245,245,245,0.5)' }}
          >
            {/* Card header — flex-wrap with all 6 fields */}
            <div className="border-b-[1.5px] border-[#e2e2e2] px-4 py-2 flex flex-col gap-[10px]">
              <div className="flex flex-wrap gap-x-3 gap-y-1 items-start">
                {[
                  { label: 'Order Date', value: '25-Aug-25' },
                  { label: 'Order No.', value: '4479' },
                  { label: 'Delivery to', value: 'Harshit Aggarwal' },
                  { label: 'Monthly Rent', value: '₹1100/mo' },
                  { label: 'Security Amount', value: '₹5000.00' },
                  { label: 'Partial Amount', value: '₹600' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-[2px] items-start justify-center">
                    <p className="text-[8px] font-semibold text-[#757575] text-center tracking-[-0.4px]">{label}</p>
                    <p className="text-[10px] font-semibold text-[#333] tracking-[-0.4px]">{value}</p>
                  </div>
                ))}
              </div>
              {/* Status tag */}
              <div className="bg-[#fff3d3] border border-[#ff7a00] rounded-[16px] px-2 py-1 self-start">
                <p className="text-[8px] font-semibold text-[#ff7a00] whitespace-nowrap">Under Review</p>
              </div>
            </div>

            {/* Card product section */}
            <div className="px-4 py-3 flex flex-col gap-3">
              {/* Image + product name + chips */}
              <div className="flex flex-col gap-2">
                {/* Product image */}
                <div className="w-[67px] h-[67px] bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  <span className="text-2xl">💻</span>
                </div>
                {/* Product name */}
                <p className="text-[12px] font-semibold text-[#333] tracking-[-0.4px]">
                  MacBook Pro M4 Pro | 24 GB RAM | 512GB SSD | Silver
                </p>
                {/* Chips — stacked vertically (label on top, value below) */}
                <div className="flex flex-wrap gap-1">
                  <div className="border border-[#cbcbcb] rounded-[4px] px-[5px] py-[2px] flex flex-col gap-0">
                    <p className="text-[8px] font-semibold text-[#757575] tracking-[-0.4px]">Plan Duration</p>
                    <p className="text-[8px] font-semibold text-[#333] tracking-[-0.4px]">3 months</p>
                  </div>
                  <div className="border border-[#cbcbcb] rounded-[4px] px-[5px] py-[2px] flex flex-col gap-0">
                    <p className="text-[8px] font-semibold text-[#757575] tracking-[-0.4px]">Rental Period</p>
                    <p className="text-[8px] font-semibold text-[#545454] tracking-[-0.4px]">25th Aug 2025 to 25th Nov 2025</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-1">
                <div className="bg-[#0075ff] rounded-[28px] py-[5px] flex items-center justify-center">
                  <p className="text-[12px] font-semibold text-[#edfaff] tracking-[-0.4px]">Invoices</p>
                </div>
                <div className="flex items-center justify-center py-1">
                  <p className="text-[10px] font-bold text-[#333] underline tracking-[-0.4px]">Cancel My Order</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
