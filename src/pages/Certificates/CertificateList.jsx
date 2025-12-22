import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, X, FileText } from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function CertificateList() {
    const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    const [formData, setFormData] = useState({
        certificateName: '',
        type: 'Environmental',
        vendor: '',
        issuingAuthority: '',
        issueDate: '',
        expiryDate: '',
        complianceStandard: '',
        remarks: ''
    });

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/certificates');
            setCertificates(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to load certificates:', error);
            setCertificates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCertificate = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/certificates', formData);
            setIsAddModalOpen(false);
            resetForm();
            loadCertificates();
        } catch (error) {
            console.error('Failed to add certificate:', error);
            alert('Failed to add certificate');
        }
    };

    const resetForm = () => {
        setFormData({
            certificateName: '',
            type: 'Environmental',
            vendor: '',
            issuingAuthority: '',
            issueDate: '',
            expiryDate: '',
            complianceStandard: '',
            remarks: ''
        });
    };

    const handleViewDetails = (certificate) => {
        setSelectedCertificate(certificate);
        setIsDetailsModalOpen(true);
    };

    const getStatusBadge = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">expired</span>;
        } else if (daysUntilExpiry <= 30) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">expiring soon</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">valid</span>;
        }
    };

    const stats = {
        total: certificates.length,
        valid: certificates.filter(c => {
            const daysUntilExpiry = Math.floor((new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry > 30;
        }).length,
        expiringSoon: certificates.filter(c => {
            const daysUntilExpiry = Math.floor((new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
        }).length,
        expired: certificates.filter(c => new Date(c.expiryDate) < new Date()).length
    };

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch = cert.certificateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (statusFilter !== 'All Status') {
            const daysUntilExpiry = Math.floor((new Date(cert.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            if (statusFilter === 'Valid') matchesStatus = daysUntilExpiry > 30;
            else if (statusFilter === 'Expiring Soon') matchesStatus = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
            else if (statusFilter === 'Expired') matchesStatus = daysUntilExpiry < 0;
        }

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage compliance and green certificates</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Certificate
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Total Certificates</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="text-blue-600" size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Valid</p>
                            <p className="text-3xl font-bold text-green-700 mt-1">{stats.valid}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <FileText className="text-green-600" size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Expiring Soon</p>
                            <p className="text-3xl font-bold text-amber-700 mt-1">{stats.expiringSoon}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <FileText className="text-amber-600" size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Expired</p>
                            <p className="text-3xl font-bold text-red-700 mt-1">{stats.expired}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <FileText className="text-red-600" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, vendor, authority..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>All Status</option>
                        <option>Valid</option>
                        <option>Expiring Soon</option>
                        <option>Expired</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Certificate #</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Certificate Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Issuing Authority</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Issue Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-slate-500">Loading certificates...</td>
                                </tr>
                            ) : filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-slate-500">No certificates found</td>
                                </tr>
                            ) : (
                                filteredCertificates.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-900">{cert.certificateNumber}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{cert.certificateName}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{cert.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{cert.vendor?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{cert.issuingAuthority}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(cert.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(cert.expiryDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{getStatusBadge(cert.expiryDate)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(cert)}
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Certificate Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">Add Certificate</h2>
                            <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddCertificate} className="p-6">
                            <div className="space-y-4">
                                {/* Certificate Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Name</label>
                                    <input
                                        type="text"
                                        value={formData.certificateName}
                                        onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                                        placeholder="Certificate name"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Certificate Type and Vendor */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Environmental</option>
                                            <option>Quality</option>
                                            <option>Safety</option>
                                            <option>Compliance</option>
                                            <option>Green Energy</option>
                                            <option>Carbon Neutral</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                                        <input
                                            type="text"
                                            value={formData.vendor}
                                            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                            placeholder="Select vendor"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Issuing Authority */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Issuing Authority</label>
                                    <input
                                        type="text"
                                        value={formData.issuingAuthority}
                                        onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                                        placeholder="e.g., ISO, BIS, etc."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Issue Date and Expiry Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                                        <input
                                            type="date"
                                            value={formData.issueDate}
                                            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Compliance Standard */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Compliance Standard</label>
                                    <input
                                        type="text"
                                        value={formData.complianceStandard}
                                        onChange={(e) => setFormData({ ...formData, complianceStandard: e.target.value })}
                                        placeholder="e.g., ISO 14001, ISO 9001"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Remarks */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
                                    <textarea
                                        value={formData.remarks}
                                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                        placeholder="Additional remarks..."
                                        rows="3"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Add Certificate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Certificate Details Modal */}
            {isDetailsModalOpen && selectedCertificate && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">Certificate Details</h2>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Certificate Number</label>
                                    <p className="mt-1 text-slate-900 font-medium">{selectedCertificate.certificateNumber}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedCertificate.expiryDate)}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Certificate Name</label>
                                    <p className="mt-1 text-slate-900">{selectedCertificate.certificateName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Type</label>
                                    <p className="mt-1 text-slate-900">{selectedCertificate.type}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Vendor</label>
                                    <p className="mt-1 text-slate-900">{selectedCertificate.vendor?.name || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Issuing Authority</label>
                                    <p className="mt-1 text-slate-900">{selectedCertificate.issuingAuthority}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Compliance Standard</label>
                                    <p className="mt-1 text-slate-900">{selectedCertificate.complianceStandard || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500">Issue Date</label>
                                    <p className="mt-1 text-slate-900">{new Date(selectedCertificate.issueDate).toLocaleDateString()}</p>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-500">Expiry Date</label>
                                    <p className="mt-1 text-slate-900">{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
