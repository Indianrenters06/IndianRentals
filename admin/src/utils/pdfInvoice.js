import jsPDF from "jspdf";
import "jspdf-autotable";

export function downloadPDFInvoice(order) {
    if (!order) return;
    
    const doc = new jsPDF();
    const invoiceNo = `INV-${order._id?.slice(-8).toUpperCase()}`;
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INDIAN RENTALS", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE", 14, 28);
    
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoiceNo}`, 140, 20);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, 26);
    doc.text(`Status: ${order.status}`, 140, 32);
    
    // Customer Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 14, 45);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.user?.name || "Customer"}`, 14, 52);
    doc.text(`${order.user?.email || ""}`, 14, 58);
    
    if (order.shippingAddress?.address) {
        doc.text(`${order.shippingAddress.address}`, 14, 64);
        doc.text(`${order.shippingAddress.city} - ${order.shippingAddress.postalCode}`, 14, 70);
        doc.text(`Phone: ${order.shippingAddress.phone}`, 14, 76);
    }
    
    // Rental Period
    const periodY = order.shippingAddress?.address ? 86 : 70;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Rental Period:", 14, periodY);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const startDate = order.rentalPeriod?.startDate ? new Date(order.rentalPeriod.startDate).toLocaleDateString("en-IN") : "—";
    const endDate = order.rentalPeriod?.endDate ? new Date(order.rentalPeriod.endDate).toLocaleDateString("en-IN") : "—";
    doc.text(`${order.rentalPeriod?.durationMonths} month(s) (${startDate} to ${endDate})`, 14, periodY + 7);
    
    // Items Table
    const tableData = (order.orderItems || []).map((item, index) => [
        index + 1,
        item.name,
        item.qty,
        `Rs. ${item.price?.toLocaleString("en-IN")}`,
        `Rs. ${item.securityDeposit?.toLocaleString("en-IN")}`
    ]);
    
    doc.autoTable({
        startY: periodY + 15,
        head: [['#', 'Item', 'Qty', 'Monthly Rate', 'Security Deposit']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
        styles: { font: "helvetica", fontSize: 10 },
    });
    
    // Payment Details
    const finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary:", 14, finalY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, finalY + 8);
    doc.text(`Payment Status: ${order.isPaid ? "PAID" : "UNPAID"}`, 14, finalY + 14);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: Rs. ${order.totalPrice?.toLocaleString("en-IN")}`, 14, finalY + 24);
    
    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Indian Rentals!", 14, 280);
    
    // Save
    doc.save(`invoice-${invoiceNo}.pdf`);
}
