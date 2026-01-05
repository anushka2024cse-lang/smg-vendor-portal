import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Eye,
    Edit,
    Ban,
    FileText,
    X,
    Save,
    CheckCircle,
    Clock
} from 'lucide-react';

const VendorList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    // Initial Load
    React.useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/vendors');
            console.log('Vendors fetched:', response.data);
            // Backend returns array directly, not wrapped in data
            setVendors(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to load vendors:', error);
            setVendors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVendorBlock = async (vendorId) => {
        try {
            const vendor = vendors.find(v => v._id === vendorId || v.vendorId === vendorId);
            if (vendor) {
                const newStatus = vendor.status === 'Blacklisted' ? 'Active' : 'Blacklisted';
                await apiClient.put(`/vendors/${vendorId}`, { status: newStatus });
                loadVendors(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to update vendor:', error);
        }
    };

    const handleEditClick = (vendor) => {
        setEditingVendor({ ...vendor });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            if (editingVendor) {
                await apiClient.put(`/vendors/${editingVendor._id || editingVendor.vendorId}`, editingVendor);
                setIsEditModalOpen(false);
                setEditingVendor(null);
                loadVendors(); // Refresh to show changes
            }
        } catch (error) {
            console.error('Failed to update vendor:', error);
            alert('Failed to update vendor');
        }
    };

    const filteredVendors = vendors.filter(vendor => {
        const vendorId = vendor._id || vendor.vendorId || '';
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendorId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || vendor.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Blacklisted': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handlePrintList = () => {
        const logoUrl = '/src/asset/logo/Logo.jpg';
        const dateStr = new Date().toLocaleDateString();

        const rows = filteredVendors.map((v, i) => `
            <tr>
                <td style="text-align:center">${i + 1}</td>
                <td><strong>${v.vendorId || 'N/A'}</strong></td>
                <td>${v.name}</td>
                <td>${v.type || '-'}</td>
                <td>${v.contact || '-'}</td>
                <td>${v.city || '-'}</td>
                <td><span class="status ${v.status}">${v.status}</span></td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vendor Master List - ${dateStr}</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 20px; font-size: 12px; }
                    .header { display: flex; align-items: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 15px; margin-bottom: 20px; }
                    .logo { height: 60px; margin-right: 20px; }
                    .title-block { flex: 1; }
                    .company { font-size: 24px; font-weight: bold; color: #1e3a5f; }
                    .report-title { font-size: 16px; color: #64748b; margin-top: 5px; font-weight: 600; text-transform: uppercase; }
                    .meta { text-align: right; font-size: 11px; color: #64748b; }
                    
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #1e3a5f; color: white; padding: 10px; text-align: left; font-size: 11px; uppercase; }
                    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
                    tr:nth-child(even) { background: #f8fafc; }
                    
                    .status { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
                    .status.Active { background: #dcfce7; color: #166534; }
                    .status.Blacklisted { background: #fee2e2; color: #991b1b; } /* Updated from Blocked */
                    .status.Pending { background: #fef9c3; color: #854d0e; }
                    
                    .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" class="logo" alt="Logo" onerror="this.style.display='none'" />
                    <div class="title-block">
                        <div class="company">SMG Electric Scooters</div>
                        <div class="report-title">Vendor Master List</div>
                    </div>
                    <div class="meta">
                        <div>Date: ${dateStr}</div>
                        <div>Total Vendors: ${filteredVendors.length}</div>
                    </div>
                </div>

                <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                    <button onclick="window.print()" style="background:#1e3a5f; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">🖨️ Print / PDF</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px; text-align:center">#</th>
                            <th>Code</th>
                            <th>Company Name</th>
                            <th>Type</th>
                            <th>Contact Person</th>
                            <th>City</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                
                <div class="footer">
                    Generated from SMG Vendor Portal on ${new Date().toLocaleString()}
                </div>
            </body>
            </html>
        `;

        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">

            {/* Top Header Section */}
            <div className="space-y-4">
                {/* Breadcrumb Removed */}

                {/* Title & Actions Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Directory</h1>
                        <p className="text-slate-500 mt-1">Manage and monitor all your supplier relationships.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrintList}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
                        >
                            <Printer size={18} />
                            Print List / PDF
                        </button>
                        <button
                            onClick={() => navigate('/vendor/onboarding')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            <Plus size={18} />
                            Add New Vendor
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Vendors</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-slate-900">{vendors.length}</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <MoreVertical size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-emerald-700">{vendors.filter(v => v.status === 'Active').length}</h3>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-amber-600">{vendors.filter(v => v.status === 'Pending').length}</h3>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Blacklisted</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-red-600">{vendors.filter(v => v.status === 'Blacklisted').length}</h3>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <Ban size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by vendor name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                        <Filter size={16} />
                        <span className="font-medium">Filter Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 p-0 text-slate-900 font-semibold cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Blacklisted">Blacklisted</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor Code</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredVendors.map((vendor) => {
                            const vendorId = vendor._id || vendor.vendorId || 'N/A';
                            return (
                                <tr
                                    key={vendorId}
                                    onClick={() => navigate(`/vendor/details/${vendorId}`)}
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{vendor.vendorId || vendorId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{vendor.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{vendor.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                {vendor.contact?.charAt(0) || 'V'}
                                            </div>
                                            {vendor.contact || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{vendor.city || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/vendor/details/${vendorId}`);
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(vendor);
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Vendor"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVendorBlock(vendorId);
                                                }}
                                                className={`p-1.5 rounded-md transition-colors ${vendor.status === 'Blacklisted' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                                title={vendor.status === 'Blacklisted' ? "Unblock Vendor" : "Blacklist Vendor"}
                                            >
                                                <Ban size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>

                {filteredVendors.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p className="text-lg font-medium">No vendors found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {
                isEditModalOpen && editingVendor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900">Edit Vendor Details</h2>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                                    <input
                                        type="text"
                                        value={editingVendor.name}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Business Type</label>
                                        <select
                                            value={editingVendor.type}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, type: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        >
                                            <option value="Pvt Ltd">Pvt Ltd</option>
                                            <option value="Ltd">Ltd</option>
                                            <option value="Proprietorship">Proprietorship</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">City</label>
                                        <input
                                            type="text"
                                            value={editingVendor.city}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, city: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Primary Contact</label>
                                    <input
                                        type="text"
                                        value={editingVendor.contact}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, contact: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        value={editingVendor.status}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, status: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Blacklisted">Blacklisted</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};



export default VendorList;
