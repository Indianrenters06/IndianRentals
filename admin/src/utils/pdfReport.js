import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadPDFReport(title, headers, data, filename) {
    const doc = new jsPDF("landscape");
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INDIAN RENTALS", 14, 20);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(title, 14, 28);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}`, 14, 34);
    
    // Table
    autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
        styles: { font: "helvetica", fontSize: 9, cellPadding: 3 },
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Internal Confidential Report - Indian Rentals Admin", 14, finalY);
    
    doc.save(`${filename}.pdf`);
}
