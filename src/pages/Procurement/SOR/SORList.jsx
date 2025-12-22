import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, FileText, ChevronRight, MoreVertical } from 'lucide-react';

const SORList = () => {
    const navigate = useNavigate();

    // Mock Data for SOR List
    const sorRecords = [
        { id: "SOR-ELEC-001", companyName: "SMG Manufacturing Ltd", vendor: "Bosch Automotive", vehicleType: "Electric Scooter", submittedDate: "2024-12-20", status: "Active" },
        { id: "SOR-MECH-042", companyName: "SMG Manufacturing Ltd", vendor: "NeoSky India Ltd", vehicleType: "Electric Bike", submittedDate: "2024-12-18", status: "Draft" },
        { id: "SOR-ELEC-009", companyName: "SMG Manufacturing Ltd", vendor: "Samsung Displays", vehicleType: "Electric Scooter", submittedDate: "2024-12-15", status: "Pending Review" },
        { id: "SOR-ACC-103", companyName: "SMG Manufacturing Ltd", vendor: "Stanley Leathers", vehicleType: "Electric Car", submittedDate: "2024-12-10", status: "Approved" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Pending Review': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span className="cursor-pointer hover:text-blue-900 transition-colors" onClick={() => navigate('/dashboard')}>Home</span>
                        <span>&gt;</span>
                        <span className="text-slate-900 font-medium">SOR Records</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Statement of Requirements</h1>
                    <p className="text-slate-500 mt-1">Manage and track technical requirements for all vendors.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium shadow-sm">
                        <Filter size={18} /> Filter
                    </button>
                    <button
                        onClick={() => navigate('/sor/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <Plus size={18} /> Create New SOR
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                {/* Search Bar */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, Title or Vendor..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-200">SOR Number</th>
                                <th className="px-6 py-4 border-b border-slate-200">Company Name</th>
                                <th className="px-6 py-4 border-b border-slate-200">Vendor</th>
                                <th className="px-6 py-4 border-b border-slate-200">Vehicle Type</th>
                                <th className="px-6 py-4 border-b border-slate-200">Submitted Date</th>
                                <th className="px-6 py-4 border-b border-slate-200 text-center">Status</th>
                                <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sorRecords.map((sor) => (
                                <tr
                                    key={sor.id}
                                    className="hover:bg-slate-50/50 group transition-colors cursor-pointer"
                                    onClick={() => navigate(`/sor/workspace/${sor.id}`)}
                                >
                                    <td className="px-6 py-4 font-mono text-sm font-medium text-blue-600">{sor.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{sor.companyName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{sor.vendor}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{sor.vehicleType}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 tabular-nums">{sor.submittedDate}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(sor.status)}`}>
                                            {sor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Future: Open action menu here instead of navigating
                                            }}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Simple Placeholder */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Showing 1-4 of 12 records</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SORList;
