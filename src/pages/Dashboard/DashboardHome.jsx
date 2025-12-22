import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FileText,
    CreditCard,
    Package,
    Bell,
    Mail,
    User,
    Search,
    ChevronRight,
    ArrowUpRight,
    Calendar
} from 'lucide-react';

const DashboardHome = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data to match reference image
    const requests = [
        { date: '15 Dec 2025', type: 'Purchase Order - PO-202512-001', status: 'Issued', statusColor: 'bg-blue-100 text-blue-700' },
        { date: '10 Dec 2025', type: 'Purchase Order - PO-202512-002', status: 'In Progress', statusColor: 'bg-purple-100 text-purple-700' },
        { date: '05 Dec 2025', type: 'Purchase Order - PO-202512-003', status: 'Completed', statusColor: 'bg-green-100 text-green-700' },
    ];

    const recentVendors = [
        { id: 'VND-2025-001', name: 'ElectroParts India Pvt Ltd', status: 'Approved', letter: 'E', color: 'bg-blue-900' },
        { id: 'VND-2025-002', name: 'BatteryTech Solutions', status: 'Approved', letter: 'B', color: 'bg-blue-800' },
        { id: 'VND-2025-003', name: 'AutoBody Works', status: 'Pending', letter: 'A', color: 'bg-blue-900' },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">

            {/* Local Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back to your overview.</p>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Vendors */}
                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex justify-between items-start relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Total Vendors</p>
                        <h3 className="text-4xl font-bold text-slate-800 mb-1">3</h3>
                        <p className="text-xs text-slate-500 font-medium">1 pending approval</p>
                    </div>
                    <div className="p-3 bg-blue-900 text-white rounded-xl shadow-lg shadow-blue-900/20">
                        <Users size={24} />
                    </div>
                </div>

                {/* Card 2: Active POs */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex justify-between items-start relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Active POs</p>
                        <h3 className="text-4xl font-bold text-slate-800 mb-1">2</h3>
                        <p className="text-xs text-slate-500 font-medium">3 total orders</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                </div>

                {/* Card 3: Payments */}
                <div className="bg-[#FFF4E5] border border-orange-100 p-6 rounded-2xl flex justify-between items-start relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Pending Payments</p>
                        <h3 className="text-4xl font-bold text-slate-800 mb-1">1</h3>
                        <p className="text-xs text-slate-500 font-medium">₹831,900 paid</p>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <CreditCard size={24} />
                    </div>
                </div>

                {/* Card 4: Components */}
                <div className="bg-[#ECFDF5] border border-emerald-100 p-6 rounded-2xl flex justify-between items-start relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Components</p>
                        <h3 className="text-4xl font-bold text-slate-800 mb-1">5</h3>
                        <p className="text-xs text-slate-500 font-medium">Active components</p>
                    </div>
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Package size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Start 2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Requests Overview */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Requests Overview</h2>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                View All <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-semibold text-slate-500 border-b border-slate-100">
                                        <th className="pb-3 pl-2">Requested Date</th>
                                        <th className="pb-3">Request Type</th>
                                        <th className="pb-3 pr-2 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {requests.map((req, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 pl-2 text-sm text-slate-600 font-medium">{req.date}</td>
                                            <td className="py-4 text-sm text-slate-800">{req.type}</td>
                                            <td className="py-4 pr-2 text-right">
                                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${req.statusColor}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Vendors */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Recent Vendors</h2>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                View All <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentVendors.map((vendor, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-blue-100 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full ${vendor.color} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                                            {vendor.letter}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{vendor.name}</h4>
                                            <p className="text-xs text-slate-500 font-mono">{vendor.id}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-md ${vendor.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {vendor.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column (Start 1/3) */}
                <div className="space-y-6">

                    {/* Events and Announcements */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[300px]">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Events and Announcements</h2>

                        <div className="space-y-4">
                            {/* Announcement 1 */}
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Welcome to SMG Vendor Portal!</h3>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                    Your one-stop platform for managing all vendor operations efficiently.
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                    <Calendar size={12} /> 22 December 2025
                                </div>
                            </div>

                            {/* Announcement 2 */}
                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                <h3 className="text-sm font-bold text-emerald-900 mb-1 uppercase text-xs tracking-wider">SMG Electric Scooters Team</h3>
                                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                    has been awarded at <span className="font-bold">ITEX 2025</span> at Jamnagar.
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                    <Calendar size={12} /> 10 Dec 2025
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Payment Summary</h2>

                        <div className="flex items-end justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500">Total Paid</span>
                            <span className="text-lg font-bold text-emerald-600">₹831,900</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6 flex">
                            <div className="w-[70%] bg-slate-800 h-full rounded-full"></div>
                            <div className="w-[30%] bg-slate-200 h-full"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs font-medium text-emerald-800 mb-1">Paid</p>
                                <p className="text-2xl font-bold text-emerald-700">2</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <p className="text-xs font-medium text-amber-800 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-amber-700">1</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
