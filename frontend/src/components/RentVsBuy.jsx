"use client";
import React from "react";
import { CheckCircle, Lightbulb } from "@phosphor-icons/react";

/* ── Figma: Section 7 — Rent vs Buy ───────────────────────────────────────
   Header (h2 42px semibold, -2px) + subtitle (16px regular #545454)
   Comparison table: Factor / Buy / Rent with IndianRenters
   Callout banner (#fff8e6)
─────────────────────────────────────────────────────────────────────────── */

const ROWS = [
    { factor: "Upfront Cost", buy: "₹1,20,000+ per laptop", rent: "From ₹2,499/mo — zero CapEx" },
    { factor: "Maintenance", buy: "Your responsibility and cost", rent: "Included free. Our technicians handle it." },
    { factor: "Scalability", buy: "Weeks of procurement cycles", rent: "Same-day for urgent needs. Scale up or down monthly." },
    { factor: "Tax Treatment", buy: "Depreciation over 3-5 years (slow)", rent: "100% deductible as operating expense — immediate." },
    { factor: "Asset Depreciation", buy: "Loses 30%+ value per year", rent: "Not your asset. Not your problem." },
    { factor: "End of Life", buy: "You dispose, resell, or store", rent: "Return to us. We handle everything." },
    { factor: "Setup & Installation", buy: "Hire IT staff or DIY", rent: "Our technician sets up every device on-site. Free." },
];

const MONA = '"Mona Sans", sans-serif';

const RentVsBuy = () => {
    return (
        <section className="w-full flex justify-center bg-white">
            <div
                className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center"
                style={{ gap: "24px", paddingTop: "40px", paddingBottom: "40px" }}
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center" style={{ gap: "12px" }}>
                    <h2
                        style={{
                            fontFamily: MONA,
                            fontWeight: 600,
                            fontSize: "42px",
                            lineHeight: "42px",
                            letterSpacing: "-2px",
                            color: "#1f1f1f",
                            margin: 0,
                        }}
                        className="max-lg:!text-[30px] max-lg:!leading-[34px] max-lg:!tracking-[-1px]"
                    >
                        Why India&apos;s Smartest Companies Rent
                    </h2>
                    <p
                        style={{
                            fontFamily: MONA,
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#545454",
                            maxWidth: "700px",
                            margin: 0,
                        }}
                    >
                        Compare the total cost of ownership. Renting wins on every metric that matters to your CFO.
                    </p>
                </div>

                {/* Comparison table */}
                <div className="w-full overflow-x-auto">
                    <div
                        className="min-w-[820px]"
                        style={{ border: "1px solid #e2e2e2", borderRadius: "12px", overflow: "hidden" }}
                    >
                        {/* Header row */}
                        <div className="flex items-stretch" style={{ background: "#ffcf46" }}>
                            <div style={{ width: "20.18%", padding: "16px 24px" }}>
                                <span style={{ fontFamily: MONA, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#333" }}>Factor</span>
                            </div>
                            <div style={{ width: "30.60%", padding: "16px 24px" }}>
                                <span style={{ fontFamily: MONA, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#333" }}>Buy</span>
                            </div>
                            <div style={{ width: "49.22%", padding: "16px 24px" }}>
                                <span style={{ fontFamily: MONA, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#333" }}>Rent with IndianRenters</span>
                            </div>
                        </div>

                        {/* Body rows */}
                        {ROWS.map((row, i) => {
                            const isLast = i === ROWS.length - 1;
                            const factorBg = i % 2 === 1 ? "#fffaec" : "#ffffff";
                            const cellBorder = isLast ? "none" : "1px solid #ececec";
                            return (
                                <div key={row.factor} className="flex items-stretch">
                                    <div style={{ width: "20.18%", padding: "16px 24px", background: factorBg, borderBottom: cellBorder }}>
                                        <span style={{ fontFamily: MONA, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#000" }}>{row.factor}</span>
                                    </div>
                                    <div style={{ width: "30.60%", padding: "16px 24px", background: "#fff6f5", borderBottom: cellBorder }}>
                                        <span style={{ fontFamily: MONA, fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: "#545454" }}>{row.buy}</span>
                                    </div>
                                    <div style={{ width: "49.22%", padding: "16px 24px", background: "#e8ffe4", borderBottom: cellBorder }}>
                                        <div className="flex items-center" style={{ gap: "6px" }}>
                                            <CheckCircle size={24} weight="fill" color="#00b505" className="shrink-0" />
                                            <span style={{ fontFamily: MONA, fontWeight: 500, fontSize: "16px", lineHeight: "24px", color: "#000" }}>{row.rent}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Callout */}
                <div
                    className="w-full flex items-start"
                    style={{ background: "#fff8e6", gap: "12px", padding: "24px", borderRadius: "16px" }}
                >
                    <div className="shrink-0" style={{ paddingTop: "2px" }}>
                        <Lightbulb size={24} weight="fill" color="#f5a623" />
                    </div>
                    <p style={{ fontFamily: MONA, fontWeight: 500, fontSize: "16px", lineHeight: "24px", color: "#1f1f1f", margin: 0 }}>
                        The average business saves 40-60% on IT costs by renting instead of buying. The bigger the fleet, the bigger the savings.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RentVsBuy;
