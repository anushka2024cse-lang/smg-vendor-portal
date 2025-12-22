import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Package, History, Truck, Plus, Search, FileSpreadsheet, MoreHorizontal } from 'lucide-react';

// --- Shared Export Function (Reused Logic) ---
const handleExport = (data, filename, sheetName) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('stock'); // 'stock', 'receive', 'dispatch'

    // Mock Data (Centralized for Export)
    const stockData = [
        { id: 1, partName: 'FRONT WHEEL BEARING', partCode: 'FWB-123', sapCode: 'SAP-78965', currentStock: 5, lowStockThreshold: 50, totalReceived: 1500, totalDispatched: 1455 }
    ];

    const receiveData = [
        { id: 1, partName: 'FRONT WHEEL BEARING', unitsRecvd: 1500, vendorName: 'RELIBAL PART.CO', dateRecvd: 'Nov 10, 2025', receivedBy: 'VIRENDRA SINGH' }
    ];

    const dispatchData = [
        { id: 1, partName: 'FRONT WHEEL BEARING', unitsDisp: 1455, dispatchedTo: 'DELHI', dateDisp: 'Nov 10, 2025', hodName: 'VIRENDRA SINGH' }
    ];

    return (
        <div className="p-6 text-muted-foreground w-full">

            {/* Breadcrumb & Title */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
            </div>
            {/* Tabs */}
            <div className="inline-flex items-center bg-muted p-1 rounded-lg mb-6">
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'stock' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Stock Levels
                </button>
                <button
                    onClick={() => setActiveTab('receive')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'receive' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Receive History
                </button>
                <button
                    onClick={() => setActiveTab('dispatch')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dispatch' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Dispatch History
                </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'stock' && <StockLevels data={stockData} onExport={() => handleExport(stockData, 'Stock_Levels', 'Stock')} />}
                {activeTab === 'receive' && <ReceiveHistory data={receiveData} onExport={() => handleExport(receiveData, 'Receive_History', 'Received')} />}
                {activeTab === 'dispatch' && <DispatchHistory data={dispatchData} onExport={() => handleExport(dispatchData, 'Dispatch_History', 'Dispatched')} />}
            </div>
        </div>
    );
};

// --- Sub-Components for Tabs ---

const StockLevels = ({ data, onExport }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(data.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <>
            {/* Create New Part Form */}
            {/* Create New Part Form */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-primary mb-1">Create New Part</h2>
                    <p className="text-sm text-muted-foreground">Add a new part to the master inventory list. Stock will initially be 0.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Part Name</label>
                        <input type="text" placeholder="e.g. Front Wheel Bearing" className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Part Code</label>
                        <input type="text" placeholder="e.g. FWB-123" className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">SAP Code (Optional)</label>
                        <input type="text" placeholder="e.g. SAP-987" className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Low Stock Threshold</label>
                        <input type="number" defaultValue="0" className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Current Stock</label>
                        <input type="text" value="0" readOnly className="w-full bg-muted border border-input rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Total Received</label>
                        <input type="text" value="0" readOnly className="w-full bg-muted border border-input rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Total Dispatched</label>
                        <input type="text" value="0" readOnly className="w-full bg-muted border border-input rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed focus:outline-none text-sm" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                        <Plus size={16} />
                        <span>Create New Part</span>
                    </button>
                </div>
            </div>

            {/* Part Master Stock Table */}
            {/* Part Master Stock Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-primary mb-1">Part Master Stock</h2>
                    <p className="text-sm text-muted-foreground mb-4">Overview of all parts and their stock levels.</p>

                    <div className="flex justify-between items-center gap-4">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Filter by part name..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary border border-input hover:border-primary rounded-lg px-3 py-2 text-xs transition-colors"
                        >
                            <FileSpreadsheet size={14} />
                            <span>Export to Excel</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 w-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-input bg-background"
                                        checked={selectedItems.length === data.length && data.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-3 font-semibold">Part Name</th>
                                <th className="px-6 py-3 font-semibold">Part Code</th>
                                <th className="px-6 py-3 font-semibold">SAP Code</th>
                                <th className="px-6 py-3 font-semibold">Current Stock</th>
                                <th className="px-6 py-3 font-semibold">Low Stock Threshold</th>
                                <th className="px-6 py-3 font-semibold">Total Received</th>
                                <th className="px-6 py-3 font-semibold">Total Dispatched</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.map((item) => (
                                <tr key={item.id} className={`hover:bg-muted/50 transition-colors ${selectedItems.includes(item.id) ? 'bg-muted/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-input bg-background"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground uppercase">{item.partName}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.partCode}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.sapCode}</td>
                                    <td className="px-6 py-4 text-foreground font-semibold">{item.currentStock}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.lowStockThreshold}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.totalReceived}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.totalDispatched}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-muted-foreground hover:text-primary"><MoreHorizontal size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual only) */}
                <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                    <span>{data.length} row(s) found.</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select className="bg-[#1E293B] border border-slate-700 rounded px-2 py-1 text-white">
                                <option>10</option>
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
        </>
    );
};

const ReceiveHistory = ({ data, onExport }) => {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-card-foreground mb-1">Receive History</h2>
                <p className="text-sm text-muted-foreground mb-4">History of all received parts.</p>

                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by part or vendor name..."
                            className="w-full pl-9 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg px-3 py-2 text-xs transition-colors"
                    >
                        <FileSpreadsheet size={14} />
                        <span>Export</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-[#1E293B] border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-3 font-medium">Part Name</th>
                            <th className="px-6 py-3 font-medium">Units Recvd.</th>
                            <th className="px-6 py-3 font-medium">Vendor Name</th>
                            <th className="px-6 py-3 font-medium">Date Recvd.</th>
                            <th className="px-6 py-3 font-medium">Received By</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-[#1E293B]/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-white uppercase">{item.partName}</td>
                                <td className="px-6 py-4 text-slate-400">{item.unitsRecvd}</td>
                                <td className="px-6 py-4 text-white">{item.vendorName}</td>
                                <td className="px-6 py-4 text-slate-400">{item.dateRecvd}</td>
                                <td className="px-6 py-4 text-white">{item.receivedBy}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-500 hover:text-white"><MoreHorizontal size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination (Visual only) */}
            <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>{data.length} row(s) found.</span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select className="bg-[#1E293B] border border-slate-700 rounded px-2 py-1 text-white">
                            <option>5</option>
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

const DispatchHistory = ({ data, onExport }) => {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-card-foreground mb-1">Dispatch History</h2>
                <p className="text-sm text-muted-foreground mb-4">History of all dispatched parts.</p>

                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by part name..."
                            className="w-full pl-9 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg px-3 py-2 text-xs transition-colors"
                    >
                        <FileSpreadsheet size={14} />
                        <span>Export</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-[#1E293B] border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-3 font-medium">Part Name</th>
                            <th className="px-6 py-3 font-medium">Units Disp.</th>
                            <th className="px-6 py-3 font-medium">Dispatched To</th>
                            <th className="px-6 py-3 font-medium">Date Disp.</th>
                            <th className="px-6 py-3 font-medium">HOD Name</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-[#1E293B]/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-white uppercase">{item.partName}</td>
                                <td className="px-6 py-4 text-slate-400">{item.unitsDisp}</td>
                                <td className="px-6 py-4 text-white uppercase">{item.dispatchedTo}</td>
                                <td className="px-6 py-4 text-slate-400">{item.dateDisp}</td>
                                <td className="px-6 py-4 text-white uppercase">{item.hodName}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-500 hover:text-white"><MoreHorizontal size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination (Visual only) */}
            <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>{data.length} row(s) found.</span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select className="bg-[#1E293B] border border-slate-700 rounded px-2 py-1 text-white">
                            <option>5</option>
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

export default Inventory;
