import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Warranty');

    const tabs = ['Warranty', 'Spares', 'HSRP', 'RSA'];

    const requests = [
        { id: 'REQ-001', type: 'Warranty', status: 'Pending', date: '2025-05-15', vehicle: 'Maruti glanza' },
        { id: 'REQ-002', type: 'Spares', status: 'Approved', date: '2025-05-14', vehicle: 'Toyota Urban' },
        { id: 'REQ-003', type: 'Warranty', status: 'Rejected', date: '2025-05-12', vehicle: 'Maruti Brezza' },
        { id: 'REQ-004', type: 'HSRP', status: 'Pending', date: '2025-05-10', vehicle: 'Swift Dzire' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#1B365D]">My Requests</h1>
                    <p className="text-gray-500 mt-1">Manage and track your service requests</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/warranty-claim')}
                        className="flex items-center gap-2 bg-[#1B365D] text-white px-4 py-2 rounded-lg hover:bg-[#152a48] transition-colors"
                    >
                        <Plus size={18} />
                        New Warranty Claim
                    </button>
                    <button
                        onClick={() => navigate('/failed-part')}
                        className="flex items-center gap-2 bg-white border border-[#1B365D] text-[#1B365D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus size={18} />
                        Report Failed Part
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab
                                ? 'text-[#1B365D]'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab} Requests
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1B365D] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Filter size={16} />
                    <span>Filter by:</span>
                    <select className="bg-transparent font-medium text-gray-700 focus:outline-none">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Search requests..."
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B365D] w-64"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Request ID</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">To Vehicle</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests
                            .filter(r => r.type === activeTab || activeTab === 'All') // Simple client-side filter
                            .map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#1B365D]">{req.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{req.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{req.vehicle}</td>
                                    <td className="px-6 py-4 text-gray-500">{req.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#1B365D] font-medium hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {requests.filter(r => r.type === activeTab).length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No {activeTab} requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
