// Print Utility for Purchase Orders
// Opens a print-ready invoice in a new tab with direct PDF download option

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Generate the invoice HTML for preview
const generateInvoiceHTML = (formData, items, showPrice = true) => {
    const subtotal = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
    const taxAmount = items.reduce((sum, i) => sum + (i.qty * i.price * i.tax / 100), 0);
    const grandTotal = subtotal + taxAmount;
    const logoUrl = '/src/asset/logo/Logo.jpg';

    const itemsHtml = items.map((item, index) => `
        <tr>
            <td class="center">${index + 1}</td>
            <td>
                <div class="item-name">${item.name || 'Item Name'}</div>
                ${item.desc ? `<div class="item-desc">${item.desc}</div>` : ''}
            </td>
            <td class="center">${item.qty}</td>
            ${showPrice ? `
                <td class="right">${item.price.toFixed(2)}</td>
                <td class="center">${item.tax}%</td>
                <td class="right">${((item.qty * item.price) * (1 + item.tax / 100)).toFixed(2)}</td>
            ` : ''}
        </tr>
    `).join('');

    return { subtotal, taxAmount, grandTotal, logoUrl, itemsHtml };
};

// CSS styles for the invoice
const getInvoiceStyles = () => `
    * { margin: 0; padding: 0; box-sizing: border-box; text-decoration: none !important; -webkit-text-decoration: none !important; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #1e293b; background: #fff; padding: 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; -webkit-user-modify: read-only; }
    .invoice { max-width: 800px; margin: 0 auto; padding: 15px; border: 1px solid #e2e8f0; }
    .header { text-align: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 10px; margin-bottom: 10px; }
    .logo { width: 60px; height: 60px; object-fit: contain; margin-bottom: 5px; }
    .company-name { font-size: 18px; font-weight: bold; color: #1e3a5f; margin-bottom: 3px; }
    .company-details { font-size: 10px; color: #64748b; line-height: 1.4; }
    .po-title { text-align: center; margin: 10px 0; }
    .po-title h2 { font-size: 18px; color: #1e3a5f; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
    .po-meta { display: flex; justify-content: center; gap: 20px; font-size: 11px; }
    .po-meta span { color: #64748b; }
    .po-meta strong { color: #1e293b; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
    .party-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; }
    .party-box h4 { font-size: 9px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 5px; }
    .party-box .name { font-weight: bold; font-size: 12px; color: #1e293b; margin-bottom: 3px; }
    .party-box p { font-size: 10px; color: #64748b; line-height: 1.4; }
    .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .items-table thead { background: #1e3a5f; color: #fff; }
    .items-table th { padding: 6px 5px; text-align: left; font-size: 9px; text-transform: uppercase; }
    .items-table th.center { text-align: center; }
    .items-table th.right { text-align: right; }
    .items-table td { padding: 6px 5px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    .items-table td.center { text-align: center; }
    .items-table td.right { text-align: right; }
    .item-name { font-weight: 500; }
    .item-desc { font-size: 9px; color: #64748b; }
    .totals { display: flex; justify-content: flex-end; margin: 10px 0; }
    .totals-table { width: 200px; }
    .totals-table td { padding: 5px 8px; font-size: 10px; }
    .totals-table tr:not(:last-child) { border-bottom: 1px solid #e2e8f0; }
    .totals-table .label { color: #64748b; }
    .totals-table .value { text-align: right; font-weight: 500; }
    .totals-table .grand-total { background: #1e3a5f; color: #fff; }
    .totals-table .grand-total td { font-weight: bold; font-size: 12px; }
    .terms { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px; margin: 10px 0; }
    .terms h4 { font-size: 9px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .terms p { font-size: 9px; color: #64748b; line-height: 1.4; white-space: pre-line; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
    .signature-box { text-align: center; }
    .signature-line { border-top: 1px solid #1e3a5f; margin: 0 20px; padding-top: 5px; }
    .for-text { font-size: 10px; font-weight: 500; color: #1e293b; }
    .auth-text { font-size: 9px; color: #94a3b8; margin-top: 15px; }
    .footer { text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; }
    .btn-group { position: fixed; top: 10px; right: 10px; display: flex; gap: 8px; }
    .btn { background: #1e3a5f; color: #fff; border: none; padding: 10px 16px; font-size: 12px; cursor: pointer; border-radius: 4px; }
    .btn:hover { background: #0f2942; }
    .btn-download { background: #059669; }
    .btn-download:hover { background: #047857; }
    @media print { body { padding: 0; } .invoice { border: none; padding: 0; } .no-print { display: none !important; } }
`;

// Generate invoice body HTML
const getInvoiceBody = (formData, invoiceData, showPrice) => `
    <div class="invoice" id="invoice-content">
        <div class="header">
            <img src="${invoiceData.logoUrl}" alt="Logo" class="logo">
            <div class="company-name">${formData.billingName}</div>
            <div class="company-details">
                ${formData.billingAddress}<br>
                Phone: ${formData.billingContact} | Email: ${formData.billingEmail}<br>
                GSTIN: ${formData.billingGSTIN}
            </div>
        </div>
        
        <div class="po-title">
            <h2>Purchase Order</h2>
            <div class="po-meta">
                <div><span>PO No:</span> <strong>${formData.poNumber}</strong></div>
                <div><span>Date:</span> <strong>${new Date().toLocaleDateString('en-IN')}</strong></div>
                <div><span>Status:</span> <strong>${formData.status}</strong></div>
            </div>
        </div>
        
        <div class="parties">
            <div class="party-box">
                <h4>Bill To (Vendor)</h4>
                <div class="name">${formData.vendorName || 'Not Selected'}</div>
                <p>${formData.vendorAddress}<br>Phone: ${formData.vendorContact}<br>Email: ${formData.vendorEmail}<br>GSTIN: ${formData.vendorGSTIN}</p>
            </div>
            <div class="party-box">
                <h4>Ship To</h4>
                <div class="name">SMG Electric Scooters - Plant 1</div>
                <p>${formData.deliveryAddress}<br>Expected: ${formData.expectedDate || 'TBD'}<br>Mode: ${formData.shippingMode}</p>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th class="center" style="width:40px">#</th>
                    <th>Description</th>
                    <th class="center" style="width:60px">Qty</th>
                    ${showPrice ? '<th class="right" style="width:80px">Rate</th><th class="center" style="width:60px">GST</th><th class="right" style="width:100px">Amount</th>' : ''}
                </tr>
            </thead>
            <tbody>${invoiceData.itemsHtml}</tbody>
        </table>
        
        ${showPrice ? `
        <div class="totals">
            <table class="totals-table">
                <tr><td class="label">Subtotal:</td><td class="value">₹ ${invoiceData.subtotal.toFixed(2)}</td></tr>
                <tr><td class="label">GST:</td><td class="value">₹ ${invoiceData.taxAmount.toFixed(2)}</td></tr>
                <tr class="grand-total"><td>Total:</td><td class="value">₹ ${invoiceData.grandTotal.toFixed(2)}</td></tr>
            </table>
        </div>` : ''}
        
        <div class="terms">
            <h4>Terms & Conditions</h4>
            <p>${formData.termsAndConditions}</p>
        </div>
        
        <div class="signatures">
            <div class="signature-box"><div class="signature-line"><div class="for-text">For ${formData.vendorName || 'Vendor'}</div><div class="auth-text">(Authorized Signatory)</div></div></div>
            <div class="signature-box"><div class="signature-line"><div class="for-text">For ${formData.billingName}</div><div class="auth-text">(Authorized Signatory)</div></div></div>
        </div>
        
        <div class="footer">Computer-generated document. No signature required.</div>
    </div>
`;

// Generate PDF using jsPDF (direct method - no browser print)
const generatePDFWithJsPDF = (formData, items, showPrice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Calculate totals
    const subtotal = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
    const taxAmount = items.reduce((sum, i) => sum + (i.qty * i.price * i.tax / 100), 0);
    const grandTotal = subtotal + taxAmount;

    let y = 15;

    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.setFont('helvetica', 'bold');
    doc.text('SMG', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(14);
    doc.text(formData.billingName, pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(formData.billingAddress, pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text(`Phone: ${formData.billingContact} | Email: ${formData.billingEmail}`, pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text(`GSTIN: ${formData.billingGSTIN}`, pageWidth / 2, y, { align: 'center' });
    y += 8;

    // Line
    doc.setDrawColor(30, 58, 95);
    doc.setLineWidth(0.5);
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    // PO Title
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 95);
    doc.setFont('helvetica', 'bold');
    doc.text('PURCHASE ORDER', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`PO No: ${formData.poNumber}    Date: ${new Date().toLocaleDateString('en-IN')}    Status: ${formData.status}`, pageWidth / 2, y, { align: 'center' });
    y += 12;

    // Bill To / Ship To
    const boxWidth = (pageWidth - 40) / 2;

    // Bill To Box
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, boxWidth, 35, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, boxWidth, 35, 'S');

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('BILL TO (VENDOR)', 18, y + 5);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(formData.vendorName || 'Not Selected', 18, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const vendorLines = doc.splitTextToSize(`${formData.vendorAddress}\nPhone: ${formData.vendorContact}\nEmail: ${formData.vendorEmail}\nGSTIN: ${formData.vendorGSTIN}`, boxWidth - 10);
    doc.text(vendorLines, 18, y + 18);

    // Ship To Box
    const shipX = 20 + boxWidth;
    doc.setFillColor(248, 250, 252);
    doc.rect(shipX, y, boxWidth, 35, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(shipX, y, boxWidth, 35, 'S');

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('SHIP TO', shipX + 3, y + 5);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('SMG Electric Scooters - Plant 1', shipX + 3, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const shipLines = doc.splitTextToSize(`${formData.deliveryAddress}\nExpected: ${formData.expectedDate || 'TBD'}\nMode: ${formData.shippingMode}`, boxWidth - 10);
    doc.text(shipLines, shipX + 3, y + 18);

    y += 42;

    // Items Table
    const tableColumns = showPrice
        ? [['#', 'Description', 'Qty', 'Rate', 'GST', 'Amount']]
        : [['#', 'Description', 'Qty']];

    const tableRows = items.map((item, idx) => {
        const baseRow = [
            (idx + 1).toString(),
            item.name + (item.desc ? `\n${item.desc}` : ''),
            item.qty.toString()
        ];
        if (showPrice) {
            baseRow.push(
                item.price.toFixed(2),
                `${item.tax}%`,
                ((item.qty * item.price) * (1 + item.tax / 100)).toFixed(2)
            );
        }
        return baseRow;
    });

    doc.autoTable({
        startY: y,
        head: tableColumns,
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 95], textColor: 255, fontSize: 8 },
        bodyStyles: { fontSize: 9 },
        columnStyles: showPrice ? {
            0: { halign: 'center', cellWidth: 12 },
            1: { cellWidth: 'auto' },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 25 },
            4: { halign: 'center', cellWidth: 20 },
            5: { halign: 'right', cellWidth: 30 }
        } : {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { halign: 'center', cellWidth: 25 }
        },
        margin: { left: 15, right: 15 }
    });

    y = doc.lastAutoTable.finalY + 8;

    // Totals (if showing price)
    if (showPrice) {
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Subtotal:', pageWidth - 65, y);
        doc.setTextColor(30, 41, 59);
        doc.text(`Rs ${subtotal.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
        y += 6;

        doc.setTextColor(100, 116, 139);
        doc.text('GST:', pageWidth - 65, y);
        doc.setTextColor(30, 41, 59);
        doc.text(`Rs ${taxAmount.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
        y += 6;

        doc.setFillColor(30, 58, 95);
        doc.rect(pageWidth - 70, y - 3, 55, 8, 'F');
        doc.setTextColor(255);
        doc.setFont('helvetica', 'bold');
        doc.text('Total:', pageWidth - 65, y + 2);
        doc.text(`Rs ${grandTotal.toFixed(2)}`, pageWidth - 17, y + 2, { align: 'right' });
        y += 15;
    }

    // Terms
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, pageWidth - 30, 25, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, pageWidth - 30, 25, 'S');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', 18, y + 5);
    doc.setFont('helvetica', 'normal');
    const termsLines = doc.splitTextToSize(formData.termsAndConditions, pageWidth - 40);
    doc.text(termsLines, 18, y + 11);
    y += 32;

    // Signatures
    const sigWidth = (pageWidth - 50) / 2;
    doc.setDrawColor(30, 58, 95);
    doc.line(20, y + 10, 20 + sigWidth, y + 10);
    doc.line(pageWidth - 20 - sigWidth, y + 10, pageWidth - 20, y + 10);

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(`For ${formData.vendorName || 'Vendor'}`, 20 + sigWidth / 2, y + 16, { align: 'center' });
    doc.text(`For ${formData.billingName}`, pageWidth - 20 - sigWidth / 2, y + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('(Authorized Signatory)', 20 + sigWidth / 2, y + 22, { align: 'center' });
    doc.text('(Authorized Signatory)', pageWidth - 20 - sigWidth / 2, y + 22, { align: 'center' });

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y - 5, pageWidth - 15, y - 5);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Computer-generated document. No signature required.', pageWidth / 2, y, { align: 'center' });

    return doc;
};

// Print Purchase Order - Opens in new tab with download button
export const printPurchaseOrder = (formData, items, showPrice = true) => {
    const invoiceData = generateInvoiceHTML(formData, items, showPrice);

    // Serialize data for passing to new window
    const dataStr = encodeURIComponent(JSON.stringify({ formData, items, showPrice }));

    const html = `<!DOCTYPE html>
<html lang="en" spellcheck="false">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PO - ${formData.poNumber}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"></script>
    <style>${getInvoiceStyles()}</style>
</head>
<body spellcheck="false">
    <div class="btn-group no-print">
        <button class="btn btn-download" onclick="downloadPDF()">📥 Download PDF</button>
        <button class="btn" onclick="window.print()">🖨️ Print</button>
    </div>
    ${getInvoiceBody(formData, invoiceData, showPrice)}
    <script>
        const invoiceData = JSON.parse(decodeURIComponent('${dataStr}'));
        
        function downloadPDF() {
            const { formData, items, showPrice } = invoiceData;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            
            const subtotal = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
            const taxAmount = items.reduce((sum, i) => sum + (i.qty * i.price * i.tax / 100), 0);
            const grandTotal = subtotal + taxAmount;
            
            let y = 15;
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(30, 58, 95);
            doc.setFont('helvetica', 'bold');
            doc.text('SMG', pageWidth / 2, y, { align: 'center' });
            y += 8;
            
            doc.setFontSize(14);
            doc.text(formData.billingName, pageWidth / 2, y, { align: 'center' });
            y += 6;
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            doc.text(formData.billingAddress, pageWidth / 2, y, { align: 'center' });
            y += 4;
            doc.text('Phone: ' + formData.billingContact + ' | Email: ' + formData.billingEmail, pageWidth / 2, y, { align: 'center' });
            y += 4;
            doc.text('GSTIN: ' + formData.billingGSTIN, pageWidth / 2, y, { align: 'center' });
            y += 8;
            
            doc.setDrawColor(30, 58, 95);
            doc.setLineWidth(0.5);
            doc.line(15, y, pageWidth - 15, y);
            y += 10;
            
            // PO Title
            doc.setFontSize(16);
            doc.setTextColor(30, 58, 95);
            doc.setFont('helvetica', 'bold');
            doc.text('PURCHASE ORDER', pageWidth / 2, y, { align: 'center' });
            y += 8;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            doc.text('PO No: ' + formData.poNumber + '    Date: ' + new Date().toLocaleDateString('en-IN') + '    Status: ' + formData.status, pageWidth / 2, y, { align: 'center' });
            y += 12;
            
            // Parties boxes
            const boxWidth = (pageWidth - 40) / 2;
            
            doc.setFillColor(248, 250, 252);
            doc.rect(15, y, boxWidth, 35, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.rect(15, y, boxWidth, 35, 'S');
            
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text('BILL TO (VENDOR)', 18, y + 5);
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(formData.vendorName || 'Not Selected', 18, y + 12);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(formData.vendorAddress || '', 18, y + 18);
            doc.text('Phone: ' + (formData.vendorContact || ''), 18, y + 22);
            doc.text('Email: ' + (formData.vendorEmail || ''), 18, y + 26);
            doc.text('GSTIN: ' + (formData.vendorGSTIN || ''), 18, y + 30);
            
            const shipX = 20 + boxWidth;
            doc.setFillColor(248, 250, 252);
            doc.rect(shipX, y, boxWidth, 35, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.rect(shipX, y, boxWidth, 35, 'S');
            
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text('SHIP TO', shipX + 3, y + 5);
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('SMG Electric Scooters - Plant 1', shipX + 3, y + 12);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(formData.deliveryAddress || '', shipX + 3, y + 18);
            doc.text('Expected: ' + (formData.expectedDate || 'TBD'), shipX + 3, y + 22);
            doc.text('Mode: ' + (formData.shippingMode || ''), shipX + 3, y + 26);
            
            y += 42;
            
            // Items Table
            const tableHead = showPrice 
                ? [['#', 'Description', 'Qty', 'Rate', 'GST', 'Amount']]
                : [['#', 'Description', 'Qty']];
            
            const tableBody = items.map((item, idx) => {
                const row = [(idx + 1).toString(), item.name || '', item.qty.toString()];
                if (showPrice) {
                    row.push(item.price.toFixed(2), item.tax + '%', ((item.qty * item.price) * (1 + item.tax / 100)).toFixed(2));
                }
                return row;
            });
            
            doc.autoTable({
                startY: y,
                head: tableHead,
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [30, 58, 95], textColor: 255, fontSize: 8 },
                bodyStyles: { fontSize: 9 },
                margin: { left: 15, right: 15 }
            });
            
            y = doc.lastAutoTable.finalY + 8;
            
            // Totals
            if (showPrice) {
                doc.setFontSize(10);
                doc.setTextColor(100, 116, 139);
                doc.text('Subtotal:', pageWidth - 65, y);
                doc.setTextColor(30, 41, 59);
                doc.text('Rs ' + subtotal.toFixed(2), pageWidth - 15, y, { align: 'right' });
                y += 6;
                
                doc.setTextColor(100, 116, 139);
                doc.text('GST:', pageWidth - 65, y);
                doc.setTextColor(30, 41, 59);
                doc.text('Rs ' + taxAmount.toFixed(2), pageWidth - 15, y, { align: 'right' });
                y += 6;
                
                doc.setFillColor(30, 58, 95);
                doc.rect(pageWidth - 70, y - 3, 55, 8, 'F');
                doc.setTextColor(255);
                doc.setFont('helvetica', 'bold');
                doc.text('Total:', pageWidth - 65, y + 2);
                doc.text('Rs ' + grandTotal.toFixed(2), pageWidth - 17, y + 2, { align: 'right' });
                y += 15;
            }
            
            // Terms
            doc.setFillColor(248, 250, 252);
            doc.rect(15, y, pageWidth - 30, 20, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.rect(15, y, pageWidth - 30, 20, 'S');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'bold');
            doc.text('TERMS & CONDITIONS', 18, y + 5);
            doc.setFont('helvetica', 'normal');
            doc.text(formData.termsAndConditions || '', 18, y + 11, { maxWidth: pageWidth - 40 });
            y += 27;
            
            // Signatures
            const sigWidth = (pageWidth - 50) / 2;
            doc.setDrawColor(30, 58, 95);
            doc.line(20, y + 10, 20 + sigWidth, y + 10);
            doc.line(pageWidth - 20 - sigWidth, y + 10, pageWidth - 20, y + 10);
            
            doc.setFontSize(9);
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.text('For ' + (formData.vendorName || 'Vendor'), 20 + sigWidth / 2, y + 16, { align: 'center' });
            doc.text('For ' + formData.billingName, pageWidth - 20 - sigWidth / 2, y + 16, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text('(Authorized Signatory)', 20 + sigWidth / 2, y + 22, { align: 'center' });
            doc.text('(Authorized Signatory)', pageWidth - 20 - sigWidth / 2, y + 22, { align: 'center' });
            
            // Footer
            const footerY = doc.internal.pageSize.getHeight() - 15;
            doc.setDrawColor(226, 232, 240);
            doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text('Computer-generated document. No signature required.', pageWidth / 2, footerY, { align: 'center' });
            
            doc.save(formData.poNumber + '.pdf');
        }
    </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
};

export default printPurchaseOrder;
