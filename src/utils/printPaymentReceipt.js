import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const getReceiptStyles = () => `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica', sans-serif; font-size: 14px; color: #333; padding: 40px; }
    .receipt-box { max-width: 800px; margin: 0 auto; border: 2px solid #e5e7eb; padding: 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #1e3a5f; color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
    .brand h1 { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .brand p { font-size: 12px; opacity: 0.8; }
    .receipt-id { text-align: right; }
    .receipt-id h2 { font-size: 32px; font-weight: bold; letter-spacing: 2px; opacity: 0.9; }
    .receipt-id p { font-size: 14px; margin-top: 5px; font-family: monospace; }
    
    .status-bar { background: #f3f4f6; padding: 15px 30px; display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; }
    .status-item span { font-size: 12px; color: #6b7280; display: block; margin-bottom: 2px; }
    .status-item strong { font-size: 16px; color: #1f2937; }
    .amount strong { color: #059669; font-size: 20px; }

    .content { padding: 40px 30px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .field { margin-bottom: 20px; }
    .field label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold; display: block; margin-bottom: 5px; }
    .field .value { font-size: 16px; color: #111827; border-bottom: 1px solid #f3f4f6; padding-bottom: 5px; }

    .footer { background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    
    .btn-group { position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; }
    .btn { padding: 10px 20px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; font-size: 14px; }
    .print-btn { background: #1e3a5f; color: white; }
    .close-btn { background: #e5e7eb; color: #374151; }
    @media print { .btn-group { display: none; } body { padding: 0; } .receipt-box { box-shadow: none; border: none; } }
`;

export const printPaymentReceipt = (payment) => {
    const data = {
        receiptNo: payment.paymentNumber,
        date: new Date(payment.invoiceDate).toLocaleDateString(),
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Pending',
        vendor: payment.vendor?.name || 'N/A',
        amount: (payment.netPayableAmount || payment.paymentAmount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        formattedAmount: (payment.netPayableAmount || payment.paymentAmount || 0),
        invoice: payment.invoiceNumber,
        po: payment.purchaseOrder?.poNumber || 'N/A',
        status: payment.status,
        ref: payment.transactionReference || '-'
    };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Receipt ${data.receiptNo}</title>
        <style>${getReceiptStyles()}</style>
    </head>
    <body>
        <div class="btn-group">
            <button class="btn print-btn" onclick="window.print()">Print Receipt</button>
            <button class="btn close-btn" onclick="window.close()">Close</button>
        </div>

        <div class="receipt-box">
            <div class="header">
                <div class="brand">
                    <h1>SMG Electric Scooters</h1>
                    <p>Vendor Payment Portal</p>
                </div>
                <div class="receipt-id">
                    <h2>RECEIPT</h2>
                    <p>#${data.receiptNo}</p>
                </div>
            </div>

            <div class="status-bar">
                <div class="status-item">
                    <span>Payment Status</span>
                    <strong>${data.status}</strong>
                </div>
                <div class="status-item">
                    <span>Date Issued</span>
                    <strong>${data.paymentDate}</strong>
                </div>
                <div class="status-item amount">
                    <span>Total Paid</span>
                    <strong>${data.amount}</strong>
                </div>
            </div>

            <div class="content">
                <div class="grid">
                    <div>
                        <div class="field">
                            <label>Payment To (Vendor)</label>
                            <div class="value">${data.vendor}</div>
                        </div>
                        <div class="field">
                            <label>Invoice Number</label>
                            <div class="value">${data.invoice}</div>
                        </div>
                        <div class="field">
                            <label>Purchase Order</label>
                            <div class="value">${data.po}</div>
                        </div>
                    </div>
                    <div>
                        <div class="field">
                            <label>Transaction Reference</label>
                            <div class="value">${data.ref}</div>
                        </div>
                        <div class="field">
                            <label>Invoice Date</label>
                            <div class="value">${data.date}</div>
                        </div>
                        <div class="field">
                            <label>Payment Mode</label>
                            <div class="value">${payment.paymentMode || 'Bank Transfer'}</div>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label>Remarks</label>
                    <div class="value" style="border:none; background:#f9fafb; padding:15px; border-radius:8px; font-size:14px;">
                        ${payment.remarks || 'No additional remarks.'}
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>This is a computer-generated payment advice/receipt. Signature is not required.</p>
                <p style="margin-top:5px">SMG Electric Scooters Pvt Ltd &bull; Noida, India</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
};

export default printPaymentReceipt;
