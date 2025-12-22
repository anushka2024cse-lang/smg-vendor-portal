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

const MaterialReceive = () => {
    // Exact mock data from user request
    const [history, setHistory] = useState([
        {
            id: 1,
            serialNo: 'SN-01',
            billNo: '10112025',
            partName: 'FRONT WHEEL BEARING',
            partCode: 'FWB-123',
            sapCode: 'SAP-78965',
            dateReceived: 'Nov 10, 2025',
            vendorName: 'RELIBAL PART.CO',
            vendorCode: 'ROC-01',
            units: 1500,
            pricePerUnit: '₹750.00',
            receivedBy: 'VIRENDRA SINGH',
            receivedAt: 'WAREHOUSE LUCKNOW',
            logistics: 'SMG',
            storeNo: 'S1',
            binNo: 'B-02',
            shelfNo: 'SH-10'
        }
    ]);

    const [selectedPart, setSelectedPart] = useState('');
    const [selectedVendor, setSelectedVendor] = useState('');

    // Auto-fill logic
    const currentPart = MOCK_PARTS.find(p => p.name === selectedPart);
    const currentVendor = MOCK_VENDORS.find(v => v.name === selectedVendor);

    return (
        <div className="p-8 max-w-7xl mx-auto text-slate-500 w-full">
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <p className="text-sm text-slate-500">Material Management Portal</p>
                    <h1 className="text-2xl font-bold text-slate-900">Material Receive</h1>
                </div>
            </div>

            {/* Add New Material Receipt Form */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Add New Material Receipt</h2>
                <p className="text-sm text-slate-500 mb-6">Log a new incoming material shipment. This will automatically update inventory levels.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Serial Number</label>
                        <input type="text" placeholder="Auto-generated or manual SN" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">BILL No.</label>
                        <input type="text" placeholder="Enter BILL/Invoice No." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Part Name</label>
                        <select
                            value={selectedPart}
                            onChange={(e) => setSelectedPart(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 text-sm"
                        >
                            <option value="">Select an existing part</option>
                            {MOCK_PARTS.map(part => (
                                <option key={part.id} value={part.name}>{part.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Part Code</label>
                        <input
                            type="text"
                            placeholder="Auto-filled"
                            value={currentPart?.code || ''}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">SAP Code</label>
                        <input
                            type="text"
                            placeholder="Auto-filled"
                            value={currentPart?.sap || ''}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Date of Receiving</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Pick a date" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Vendor Name</label>
                        <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 text-sm"
                        >
                            <option value="">Select a vendor</option>
                            {MOCK_VENDORS.map(vendor => (
                                <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Vendor Code</label>
                        <input
                            type="text"
                            placeholder="Auto-filled"
                            value={currentVendor?.code || ''}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">No. of Units Received</label>
                        <input type="number" defaultValue="1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Price Per Unit</label>
                        <input type="number" defaultValue="0" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Received By</label>
                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Received At (Location)</label>
                        <input type="text" placeholder="e.g. Warehouse A" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Logistics Company</label>
                        <input type="text" placeholder="e.g. Speedy Logistics" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Store No.</label>
                        <input type="text" placeholder="e.g. S1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Bin No.</label>
                        <input type="text" placeholder="e.g. B-02" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Shelf No.</label>
                        <input type="text" placeholder="e.g. SH-10" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm shadow-sm">
                        + Save Receipt
                    </button>
                </div>
            </div>

            {/* Receive History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-1">Receive History</h2>
                        <p className="text-sm text-slate-500">A log of all past material receipts.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-white text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
                            <Printer size={16} />
                            Print All
                        </button>
                        <button className="flex items-center gap-2 bg-white text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
                            <Download size={16} />
                            Export to Excel
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by part name..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-slate-600">Serial No.</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Bill No.</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Part Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Part Code</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">SAP Code</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Date Rcvd.</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Vendor Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Vendor Code</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Units</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Price/Unit</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Received By</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Rcvd. At</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Logistics</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Store No</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Bin No</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Shelf No</th>
                                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.length > 0 ? history.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-4 py-3 text-slate-600">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.billNo}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{item.partName}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.partCode}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.sapCode}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.dateReceived}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.vendorName}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.vendorCode}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.units}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.pricePerUnit}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.receivedBy}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.receivedAt}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.logistics}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.storeNo}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.binNo}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.shelfNo}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={17} className="px-4 py-8 text-center text-slate-500">
                                        No receipts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-end items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <span>Page 1 of 1</span>
                    <div className="flex gap-1">
                        <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>«</button>
                        <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>‹</button>
                        <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>›</button>
                        <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>»</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialReceive;
