import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import socketService from '../../services/socketService';
import CreatePaymentModal from './CreatePaymentModal';
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
    Download,
    Plus,
    Send
} from 'lucide-react';

const PaymentList = () => {
    // State
    const [payments, setPayments] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Fetch payments and stats on component mount
    useEffect(() => {
        fetchPayments();
        fetchStats();

        // Listen for real-time payment updates (only if socketService is available)
        if (socketService && typeof socketService.on === 'function') {
            socketService.on('paymentUpdated', handlePaymentUpdate);

            return () => {
                if (socketService && typeof socketService.off === 'function') {
                    socketService.off('paymentUpdated', handlePaymentUpdate);
                }
            };
        }
    }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePaymentUpdate = (updatedPayment) => {
        try {
            setPayments(prevPayments =>
                prevPayments.map(payment =>
                    payment._id === updatedPayment._id ? updatedPayment : payment
                )
            );
            // Refresh stats
            fetchStats();
        } catch (error) {
            console.error('Error handling payment update:', error);
        }
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (statusFilter !== 'All Status') {
                filters.status = statusFilter;
            }
            const data = await paymentService.getPayments(filters);
            setPayments(data.payments || []);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setPayments([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await paymentService.getPaymentStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            setStats(null); // Set null on error
        }
    };

    const fetchVendors = async () => {
        try {
            // Import vendor service
            const { default: apiClient } = await import('../../services/apiClient');
            const response = await apiClient.get('/vendors');
            console.log('Fetched vendors for payment modal:', response.data);
            // Backend returns array directly, not wrapped
            if (Array.isArray(response.data)) {
                setVendors(response.data);
            } else {
                setVendors([]);
            }
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
            // Set empty array so modal can still open
            setVendors([]);
        }
    };

    // Fetch vendors on mount
    useEffect(() => {
        try {
            fetchVendors();
        } catch (error) {
            console.error('Error in vendor fetch:', error);
        }
    }, []);

    const handleSendRequest = async (paymentId) => {
        if (confirm('Send payment request notification to vendor?')) {
            try {
                await paymentService.sendPaymentRequest(paymentId);
                alert('Payment request sent successfully!');
            } catch (error) {
                alert(`Failed to send request: ${error.message}`);
            }
        }
    };

    // Filter Logic (client-side for search term)
    const filteredPayments = payments.filter(p => {
        const matchesSearch =
            p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Stats Calculation from backend stats
    const totalPayments = payments.length;
    const pendingCount = stats?.statusStats?.find(s => s._id === 'Pending')?.count || 0;
    const pendingAmount = stats?.statusStats?.find(s => s._id === 'Pending')?.totalAmount || 0;
    const paidCount = stats?.statusStats?.find(s => s._id === 'Paid')?.count || 0;
    const paidAmount = stats?.statusStats?.find(s => s._id === 'Paid')?.netPayable || 0;
    const onHoldCount = stats?.statusStats?.find(s => s._id === 'On Hold')?.count || 0;

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

    const handleUpdateStatus = async () => {
        if (selectedPayment && newStatus) {
            try {
                await paymentService.updatePaymentStatus(selectedPayment._id, newStatus);
                setStatusModalOpen(false);
                setSelectedPayment(null);
                // Refresh payments list
                fetchPayments();
                fetchStats();
            } catch (error) {
                alert(`Failed to update status: ${error.message}`);
            }
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
            doc.text(payment.paymentNumber, 25, 77);
            doc.text(new Date(payment.invoiceDate).toLocaleDateString('en-IN'), 120, 77);

            // Row 2: Vendor
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text("Vendor:", 25, 95);

            doc.setFontSize(14);
            doc.setTextColor(33, 55, 99);
            doc.setFont('helvetica', 'bold');
            doc.text(payment.vendor?.name || 'N/A', 25, 103);

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
            doc.text(payment.invoiceNumber, 25, 132);
            doc.text(payment.purchaseOrder?.poNumber || 'N/A', 120, 132);

            // Row 4: Amount & Status
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text("Amount Paid:", 25, 147);
            doc.text("Status:", 120, 147);

            doc.setFontSize(16);
            doc.setTextColor(22, 163, 74); // Green
            doc.setFont('helvetica', 'bold');
            doc.text(`INR ${payment.netPayableAmount?.toLocaleString() || payment.paymentAmount.toLocaleString()}`, 25, 155);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(payment.status, 120, 155);

            // Footer / Ref
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.setFont('helvetica', 'italic');
            doc.text(`Transaction Reference: ${payment.transactionReference || 'Pending'}`, 105, 180, { align: "center" });
            doc.text(`Payment Mode: ${payment.paymentMode || 'N/A'}`, 105, 185, { align: "center" });

            doc.setFont('helvetica', 'normal');
            doc.text("This is a computer-generated receipt.", 105, 280, { align: "center" });

            // Save
            doc.save(`Receipt-${payment.invoiceNumber}.pdf`);
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments</h1>
                    <p className="text-slate-500 mt-1">Track and manage vendor payments</p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 hover:shadow-lg transition-all"
                >
                    <Plus size={20} />
                    Create Payment
                </button>
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
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500">
                                        Loading payments...
                                    </td>
                                </tr>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-sm">{payment.invoiceNumber}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">PO: {payment.purchaseOrder?.poNumber || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-medium">
                                            {payment.vendor?.name || 'N/A'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(payment.invoiceDate).toLocaleDateString('en-IN')}
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
                                                {payment.status !== 'Paid' && (
                                                    <button
                                                        onClick={() => handleSendRequest(payment._id)}
                                                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Send Payment Request"
                                                    >
                                                        <Send size={16} />
                                                    </button>
                                                )}
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
                                    <p className="font-bold text-slate-800">{selectedPayment.invoiceNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Payment Number</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.paymentNumber}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Vendor</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedPayment.vendor?.name || 'N/A'}</p>
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
                                    <p className="font-bold text-slate-800">{new Date(selectedPayment.invoiceDate).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Payment Date</p>
                                    <p className="font-bold text-slate-800">{selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleDateString('en-IN') : '-'}</p>
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
                                    <p className="font-bold text-slate-800">{selectedPayment.paymentMode || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Transaction Ref</p>
                                    <p className="font-mono text-sm text-slate-600">{selectedPayment.transactionReference || '-'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-1">Remarks</p>
                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {selectedPayment.remarks || 'No remarks'}
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

            {/* Create Payment Modal */}
            <CreatePaymentModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={(payment) => {
                    fetchPayments();
                    fetchStats();
                }}
                vendors={vendors}
            />

        </div>
    );
};

export default PaymentList;
