import jsPDF from "jspdf";
import "jspdf-autotable";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function downloadCustomerReport(user) {
    const hasPersonalDetails = !!(user.phone && user.city);
    const hasKYC = !!(user.kyc?.status && user.kyc.status !== "not_submitted");

    if (!hasPersonalDetails && !hasKYC) {
        throw new Error("No complete records found. Customer has not submitted personal details or KYC documents.");
    }

    const token = localStorage.getItem("adminToken");
    let orders = [];
    try {
        const res = await fetch(`${API}/api/admin/users/${user._id}/orders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) orders = await res.json();
    } catch (_) {}

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // ── Header Banner ──
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageW, 34, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("INDIAN RENTALS", 14, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Customer Full Report", 14, 23);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, pageW - 14, 23, { align: "right" });
    doc.setTextColor(0, 0, 0);

    // ── Section 1: Customer Profile ──
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("1.  Customer Profile", 14, 44);
    doc.autoTable({
        startY: 48,
        head: [["Field", "Details"]],
        body: [
            ["Full Name", user.name || "N/A"],
            ["Email Address", user.email || "N/A"],
            ["Phone Number", user.phone || "N/A"],
            ["Location", user.city ? `${user.city}${user.state ? ", " + user.state : ""}` : "N/A"],
            ["Account Status", user.isBlocked ? "Blocked" : user.isActive ? "Active" : "Inactive"],
            ["Member Since", user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"],
            ["Last Updated", user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("en-IN") : "N/A"],
        ],
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 58 } },
    });

    // ── Section 2: Verification & KYC ──
    const y2 = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("2.  Verification & KYC", 14, y2);
    const kycRows = [
        ["Email Verified", user.isEmailVerified ? "Yes" : "No"],
        ["Phone Verified", user.isPhoneVerified ? "Yes" : "No"],
        ["KYC Status", user.kyc?.status ? user.kyc.status.replace(/_/g, " ").toUpperCase() : "NOT SUBMITTED"],
        ["KYC Document Type", user.kyc?.documentType || "N/A"],
        ["KYC Document Number", user.kyc?.documentNumber || "N/A"],
        ["KYC Submitted On", user.kyc?.submittedAt ? new Date(user.kyc.submittedAt).toLocaleDateString("en-IN") : "N/A"],
    ];
    if (user.isBlocked) kycRows.push(["Blocked Reason", user.blockedReason || "Not specified"]);
    if (user.kyc?.rejectionReason) kycRows.push(["KYC Rejection Reason", user.kyc.rejectionReason]);
    doc.autoTable({
        startY: y2 + 4,
        head: [["Field", "Details"]],
        body: kycRows,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 58 } },
    });

    // ── Section 3: Rental History ──
    const y3 = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`3.  Rental History  (${orders.length} order${orders.length !== 1 ? "s" : ""})`, 14, y3);
    if (orders.length === 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("No rental records found for this customer.", 14, y3 + 8);
        doc.setTextColor(0, 0, 0);
    } else {
        doc.autoTable({
            startY: y3 + 4,
            head: [["Order ID", "Items", "Amount", "Method", "Paid", "Status", "Start Date", "End Date"]],
            body: orders.map(o => [
                `ORD-${o._id.toString().slice(-6).toUpperCase()}`,
                String(o.orderItems?.length || 0),
                `Rs.${parseFloat(o.totalPrice || 0).toLocaleString("en-IN")}`,
                o.paymentMethod || "N/A",
                o.isPaid ? "Yes" : "No",
                o.status || "N/A",
                o.rentalPeriod?.startDate ? new Date(o.rentalPeriod.startDate).toLocaleDateString("en-IN") : "N/A",
                o.rentalPeriod?.endDate ? new Date(o.rentalPeriod.endDate).toLocaleDateString("en-IN") : "N/A",
            ]),
            theme: "striped",
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
            styles: { font: "helvetica", fontSize: 8.5, cellPadding: 3 },
        });
    }

    // ── Section 4: Payment Summary ──
    const y4 = (doc.lastAutoTable?.finalY ?? y3 + 12) + 10;
    const totalSpend = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const paidOrders = orders.filter(o => o.isPaid);
    const unpaidOrders = orders.filter(o => !o.isPaid);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("4.  Payment Summary", 14, y4);
    doc.autoTable({
        startY: y4 + 4,
        head: [["Metric", "Value"]],
        body: [
            ["Total Orders", String(orders.length)],
            ["Total Amount Spent", `Rs.${totalSpend.toLocaleString("en-IN")}`],
            ["Paid Orders", `${paidOrders.length}  (Rs.${paidOrders.reduce((s, o) => s + (o.totalPrice || 0), 0).toLocaleString("en-IN")})`],
            ["Unpaid / Pending", `${unpaidOrders.length}  (Rs.${unpaidOrders.reduce((s, o) => s + (o.totalPrice || 0), 0).toLocaleString("en-IN")})`],
            ["Active / Delivered", String(orders.filter(o => ["Active", "Delivered", "Shipped", "Approved"].includes(o.status)).length)],
            ["Returned", String(orders.filter(o => o.status === "Returned").length)],
            ["Cancelled", String(orders.filter(o => o.status === "Cancelled").length)],
        ],
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 70 } },
    });

    // ── Footer on every page ──
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pY = doc.internal.pageSize.getHeight() - 10;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Confidential — Indian Rentals Admin", 14, pY);
        doc.text(`Page ${i} of ${pageCount}`, pageW - 14, pY, { align: "right" });
    }

    doc.save(`customer_report_${user.name?.replace(/\s+/g, "_") || user._id}.pdf`);
}
