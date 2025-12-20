import React, { useState } from 'react';
import { Search, Download, Calendar, MoreHorizontal, Printer } from 'lucide-react';

const MOCK_PARTS = [
    { id: 1, name: 'FRONT WHEEL BEARING', code: 'FWB-123', sap: 'SAP-78965' },
    { id: 2, name: 'BRAKE DISC ASSEMBLY', code: 'BDA-456', sap: 'SAP-99887' },
    { id: 3, name: 'HEADLIGHT UNIT LED', code: 'HLU-789', sap: 'SAP-11223' },
    { id: 4, name: 'REAR SUSPENSION KIT', code: 'RSK-321', sap: 'SAP-44556' }
];

const MOCK_VENDORS = [
    { id: 1, name: 'RELIBAL PART.CO', code: 'ROC-01' },
    { id: 2, name: 'AUTO COMPONENTS LTD', code: 'ACL-99' },
    { id: 3, name: 'PRECISION GEARS INC', code: 'PGI-55' },
    { id: 4, name: 'FAST TRACK LOGISTICS', code: 'FTL-07' }
];

const MaterialDispatch = () => {
    // Exact mock data from user request
    const [history, setHistory] = useState([
        {
            id: 1,
            serialNo: 'SN-01',
            billNo: '10112025',
            partName: 'FRONT WHEEL BEARING',
            partCode: 'FWB-123',
            sapCode: 'SAP-78965',
            dateDisp: 'Nov 10, 2025',
            vendorName: 'RELIBAL PART.CO',
            vendorCode: 'ROC-01',
            units: 1455,
            pricePerUnit: '₹750.00',
            dispTo: 'DELHI',
            dispAt: 'LKO',
            hodName: 'VIRENDRA SINGH',
            storeNo: 'S1',
            binNo: 'B-02',
            shelfNo: 'SH-10',
            dispBy: 'SMG'
        }
    ]);

    const [selectedPart, setSelectedPart] = useState('');
    const [selectedVendor, setSelectedVendor] = useState('');

    // Auto-fill logic
    const currentPart = MOCK_PARTS.find(p => p.name === selectedPart);
    const currentVendor = MOCK_VENDORS.find(v => v.name === selectedVendor);

    return (
        <div className="p-6 text-slate-300 w-full">
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <p className="text-sm text-slate-400">Material Management Portal</p>
                    <h1 className="text-2xl font-bold text-white">Material Dispatch</h1>
                </div>
            </div>

            {/* Add New Material Dispatch Form */}
            <div className="bg-[#1f2533] p-6 rounded-xl border border-slate-800 mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Add New Material Dispatch</h2>
                <p className="text-sm text-slate-400 mb-6">Log a new outgoing material dispatch. This will automatically update inventory levels.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Serial Number</label>
                        <input type="text" placeholder="Auto-generated or manual SN" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">BILL No.</label>
                        <input type="text" placeholder="Enter BILL/Invoice No." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Part Name</label>
                        <select
                            value={selectedPart}
                            onChange={(e) => setSelectedPart(e.target.value)}
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                        >
                            <option value="">Select a part to dispatch</option>
                            {MOCK_PARTS.map(part => (
                                <option key={part.id} value={part.name}>{part.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Part Code</label>
                        <input
                            type="text"
                            placeholder="Auto-filled"
                            value={currentPart?.code || ''}
                            readOnly
                            className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2 text-gray-300 cursor-not-allowed text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">SAP Code</label>
                        <input
                            type="text"
                            placeholder="Auto-filled"
                            value={currentPart?.sap || ''}
                            readOnly
                            className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2 text-gray-300 cursor-not-allowed text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Date of Dispatching</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Pick a date" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Vendor Name</label>
                        <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                        >
                            <option value="">Select a vendor</option>
                            {MOCK_VENDORS.map(vendor => (
                                <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Vendor Code</label>
                        <input
                            type="text"
                            placeholder="Auto-filled"
                            value={currentVendor?.code || ''}
                            readOnly
                            className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2 text-gray-300 cursor-not-allowed text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">No. of Units Dispatched</label>
                        <input type="number" defaultValue="1" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Price Per Unit</label>
                        <input type="number" defaultValue="0" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Dispatched To</label>
                        <input type="text" placeholder="e.g. Assembly Line 1" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Dispatched At (Location)</label>
                        <input type="text" placeholder="e.g. Factory Floor" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">HOD Name</label>
                        <input type="text" placeholder="e.g. Mike Ross" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Store No.</label>
                        <input type="text" placeholder="e.g. S1" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Bin No.</label>
                        <input type="text" placeholder="e.g. B-02" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Shelf No.</label>
                        <input type="text" placeholder="e.g. SH-10" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-white text-[#0F172A] px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">
                        + Submit Dispatch
                    </button>
                </div>
            </div>

            {/* Dispatch History */}
            <div className="bg-[#1f2533] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-1">Dispatch History</h2>
                        <p className="text-sm text-slate-400">A log of all past material dispatches.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-[#1E293B] text-slate-300 px-3 py-2 rounded-lg text-sm hover:text-white hover:bg-slate-700 transition-colors border border-slate-700">
                            <Printer size={16} />
                            Print All
                        </button>
                        <button className="flex items-center gap-2 bg-[#1E293B] text-slate-300 px-3 py-2 rounded-lg text-sm hover:text-white hover:bg-slate-700 transition-colors border border-slate-700">
                            <Download size={16} />
                            Export to Excel
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by part name..."
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-slate-400 uppercase bg-[#1E293B]/50 border-b border-slate-800">
                            <tr>
                                <th className="px-4 py-3 font-semibold opacity-70">Serial No.</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Bill No.</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Part Name</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Part Code</th>
                                <th className="px-4 py-3 font-semibold opacity-70">SAP Code</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Date Disp.</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Vendor Name</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Vendor Code</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Units</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Price/Unit</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Disp. To</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Disp. At</th>
                                <th className="px-4 py-3 font-semibold opacity-70">HOD Name</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Store No</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Bin No</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Shelf No</th>
                                <th className="px-4 py-3 font-semibold opacity-70">Disp. By</th>
                                <th className="px-4 py-3 font-semibold opacity-70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {history.length > 0 ? history.map((item, index) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-4 py-3 text-slate-300">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.billNo}</td>
                                    <td className="px-4 py-3 font-medium text-white">{item.partName}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.partCode}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.sapCode}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.dateDisp}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.vendorName}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.vendorCode}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.units}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.pricePerUnit}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.dispTo}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.dispAt}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.hodName}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.storeNo}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.binNo}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.shelfNo}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.dispBy}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={18} className="px-4 py-8 text-center text-slate-500">
                                        No dispatches found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-end items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select className="bg-[#1E293B] border border-slate-700 rounded px-2 py-1 focus:outline-none">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <span>Page 1 of 1</span>
                    <div className="flex gap-1">
                        <button className="p-1 rounded hover:bg-slate-800 disabled:opacity-50" disabled>«</button>
                        <button className="p-1 rounded hover:bg-slate-800 disabled:opacity-50" disabled>‹</button>
                        <button className="p-1 rounded hover:bg-slate-800 disabled:opacity-50" disabled>›</button>
                        <button className="p-1 rounded hover:bg-slate-800 disabled:opacity-50" disabled>»</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialDispatch;
