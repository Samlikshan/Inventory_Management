import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceData {
  invoiceId: string;
  customer: { name: string; contact: string };
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  createdAt: string;
}

export const generateInvoicePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF();
  const marginLeft = 20;
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", marginLeft, y);

  // Invoice Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  y += 10;
  doc.text(`Invoice No: ${invoice.invoiceId}`, marginLeft, y);
  y += 7;
  doc.text(
    `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
    marginLeft,
    y
  );
  y += 7;
  doc.text(`Status: ${invoice.status}`, marginLeft, y);

  // Customer Info
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", marginLeft, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text(invoice.customer.name, marginLeft, y);
  y += 7;
  doc.text(invoice.customer.contact, marginLeft, y);

  // Item Table
  const rows = invoice.products.map((p, index) => [
    index + 1,
    p.productId,
    p.quantity,
    `₹${p.price.toFixed(2)}`,
    `₹${(p.quantity * p.price).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: y + 15,
    head: [["#", "Product", "Qty", "Unit Price", "Total"]],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: 20,
      fontStyle: "bold",
    },
    styles: {
      halign: "center",
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      1: { halign: "left" }, // Product name
    },
  });

  // Total
  const totalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ₹${invoice.total.toFixed(2)}`, marginLeft, totalY);

  // Footer
  const footerY = totalY + 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", marginLeft, footerY);

  // Optional: Payment info (add if needed)

  doc.save(`${invoice.invoiceId}.pdf`);
};
