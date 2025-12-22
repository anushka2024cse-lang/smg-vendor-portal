import React, { useState } from 'react';
import {
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreVertical,
    Search,
    Filter,
    X,
    Eye,
    Edit,
    ChevronDown,
    Download
} from 'lucide-react';

const PaymentList = () => {
    // Mock Data
    const [payments, setPayments] = useState([
        {
            id: 'PAY-2025-001',
            invoiceNo: 'INV-EP-2025-0156',
            poNo: 'PO-202512-001',
            vendor: 'ElectroParts India Pvt Ltd',
            date: '16 Dec 2025',
            paymentDate: '17 Dec 2025',
            invoiceAmount: 501500,
            paymentAmount: 501500,
            status: 'Paid',
            mode: 'RTGS',
            ref: 'RTGS202512170001',
            remarks: '50% advance payment against PO'
        },
        {
            id: 'PAY-2025-002',
            invoiceNo: 'INV-BT-2025-0089',
            poNo: 'PO-202512-002',
            vendor: 'BatteryTech Solutions',
            date: '18 Dec 2025',
            paymentDate: '-',
            invoiceAmount: 991200,
            paymentAmount: 0,
            status: 'Pending',
            mode: '-',
            ref: '-',
            remarks: 'Awaiting QA approval'
        },
        {
            id: 'PAY-2025-003',
            invoiceNo: 'INV-EP-2025-0148',
            poNo: 'PO-202512-003',
            vendor: 'ElectroParts India Pvt Ltd',
            date: '08 Dec 2025',
            paymentDate: '10 Dec 2025',
            invoiceAmount: 330400,
            paymentAmount: 330400,
            status: 'Paid',
            mode: 'NEFT',
            ref: 'NEFT202512100045',
            remarks: 'Full settlement'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Stats Calculation
    const totalPayments = payments.length;
    const pendingCount = payments.filter(p => p.status === 'Pending').length;
    const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.invoiceAmount, 0);
    const paidCount = payments.filter(p => p.status === 'Paid').length;
    const paidAmount = payments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.paymentAmount, 0);
    const onHoldCount = payments.filter(p => p.status === 'On Hold').length;

    // Filter Logic
    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.poNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'On Hold': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleUpdateStatus = () => {
        if (selectedPayment && newStatus) {
            setPayments(prev => prev.map(p => p.id === selectedPayment.id ? { ...p, status: newStatus } : p));
            setStatusModalOpen(false);
            setSelectedPayment(null);
        }
    };

    const openStatusModal = (payment) => {
        setSelectedPayment(payment);
        setNewStatus(payment.status);
        setStatusModalOpen(true);
    };

    const handleDownloadReceipt = (payment) => {
        import('jspdf').then(jsPDFModule => {
            const jsPDF = jsPDFModule.default;
            const doc = new jsPDF();

            // Header
            doc.setFillColor(33, 55, 99); // SMG Blue
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("SMG VENDOR PORTAL", 105, 20, { align: "center" });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text("Payment Advice / Receipt", 105, 30, { align: "center" });

            // Receipt Info Container
            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(200, 200, 200);
            doc.roundedRect(15, 50, 180, 110, 3, 3);

            // Row 1: Basic Info
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Receipt ID:", 25, 70);
            doc.text("Date:", 120, 70);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text(payment.id, 25, 77);
            doc.text(payment.date, 120, 77);

            // Row 2: Vendor
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text("Vendor:", 25, 95);

            doc.setFontSize(14);
            doc.setTextColor(33, 55, 99);
            doc.setFont('helvetica', 'bold');
            doc.text(payment.vendor, 25, 103);

            // Divider
            doc.setDrawColor(230, 230, 230);
            doc.line(25, 110, 185, 110);

            // Row 3: Invoice & PO
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text("Invoice Number:", 25, 125);
            doc.text("PO Number:", 120, 125);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text(payment.invoiceNo, 25, 132);
            doc.text(payment.poNo, 120, 132);

            // Row 4: Amount & Status
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text("Amount Paid:", 25, 147);
            doc.text("Status:", 120, 147);

            doc.setFontSize(16);
            doc.setTextColor(22, 163, 74); // Green
            doc.setFont('helvetica', 'bold');
            doc.text(`INR ${payment.paymentAmount.toLocaleString()}`, 25, 155);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(payment.status, 120, 155);

            // Footer / Ref
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.setFont('helvetica', 'italic');
            doc.text(`Transaction Reference: ${payment.ref}`, 105, 180, { align: "center" });
            doc.text(`Payment Mode: ${payment.mode}`, 105, 185, { align: "center" });

            doc.setFont('helvetica', 'normal');
            doc.text("This is a computer-generated receipt.", 105, 280, { align: "center" });

            // Save
            doc.save(`Receipt-${payment.invoiceNo}.pdf`);
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments</h1>
                <p className="text-slate-500 mt-1">Track and manage vendor payments</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total Payments</p>
                        <h3 className="text-4xl font-bold text-slate-800">{totalPayments}</h3>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-blue-900 text-white rounded-xl shadow-lg shadow-blue-900/10">
                        <CreditCard size={24} />
                    </div>
                </div>

                <div className="bg-[#FFF4E5] p-6 rounded-2xl border border-orange-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Pending</p>
                        <h3 className="text-4xl font-bold text-slate-800">{pendingCount}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">₹{pendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <Clock size={24} />
                    </div>
                </div>

                <div className="bg-[#ECFDF5] p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Paid</p>
                        <h3 className="text-4xl font-bold text-slate-800">{paidCount}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">₹{paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <CheckCircle size={24} />
                    </div>
                </div>

                <div className="bg-[#FFF1F2] p-6 rounded-2xl border border-rose-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-1">On Hold</p>
                        <h3 className="text-4xl font-bold text-slate-800">{onHoldCount}</h3>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-rose-100 text-rose-600 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by invoice, vendor, or PO..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm cursor-pointer"
                        >
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Approved</option>
                            <option>Paid</option>
                            <option>Rejected</option>
                            <option>On Hold</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Invoice Details</th>
                                <th className="p-4">Vendor</th>
                                <th className="p-4">Invoice Date</th>
                                <th className="p-4">Invoice Amount</th>
                                <th className="p-4">Payment Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-sm">{payment.invoiceNo}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">PO: {payment.poNo}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-medium">
                                            {payment.vendor}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {payment.date}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-800">
                                            ₹{payment.invoiceAmount.toLocaleString()}
                                        </td>
                                        <td className={`p-4 text-sm font-bold ${payment.paymentAmount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {payment.paymentAmount > 0 ? `₹${payment.paymentAmount.toLocaleString()}` : '—'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setSelectedPayment(payment); setViewModalOpen(true); }}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openStatusModal(payment)}
                                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Update Status"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReceipt(payment)}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Download Receipt"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500">
                                        No payments found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Details Modal */}
            {viewModalOpen && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Payment Details</h2>
                            <button onClick={() => setViewModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Invoice Number</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.invoiceNo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">PO Number</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.poNo}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Vendor</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedPayment.vendor}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedPayment.status)}`}>
                                        {selectedPayment.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Invoice Date</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Payment Date</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.paymentDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Invoice Amount</p>
                                    <p className="font-bold text-slate-900 text-lg">₹{selectedPayment.invoiceAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Payment Amount</p>
                                    <p className="font-bold text-emerald-600 text-lg">
                                        {selectedPayment.paymentAmount > 0 ? `₹${selectedPayment.paymentAmount.toLocaleString()}` : '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Payment Mode</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.mode}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Transaction Ref</p>
                                    <p className="font-mono text-sm text-slate-600">{selectedPayment.ref}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-1">Remarks</p>
                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {selectedPayment.remarks}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => handleDownloadReceipt(selectedPayment)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Download size={16} />
                                    Download Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {statusModalOpen && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Update Payment Status</h2>
                            <button onClick={() => setStatusModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm text-slate-500">Current Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedPayment.status)}`}>
                                    {selectedPayment.status}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">New Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 appearance-none"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setStatusModalOpen(false)}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    className="flex-1 py-2.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PaymentList;
