import React, { useState, useEffect } from 'react';
import { Search, Plus, FileSpreadsheet, Settings, MoreHorizontal } from 'lucide-react';
import * as XLSX from 'xlsx';

const ComponentDetails = () => {
    // State for the list of components
    const [components, setComponents] = useState([]);

    // State for local filtering
    const [searchTerm, setSearchTerm] = useState('');

    // State for the "Add New Component" form
    const [formData, setFormData] = useState({
        partName: '',
        partCode: '',
        sapCode: '',
        vendorName: '',
        vendorCode: '',
        designNumber: '',
        toolNumber: '',
        trademark: ''
    });

    // Mock initial data (Simulating backend)
    useEffect(() => {
        // In a real app, fetch from componentService
        const mockData = [
            {
                id: 1,
                partName: 'Tyre',
                partCode: 'TYRE 122',
                sapCode: 'SAP-9889',
                vendorName: 'M/s Central Tyres',
                vendorCode: 'Vend001',
                designNumber: 'TN677',
                toolNumber: 'TN098',
                trademark: 'Not Applicable'
            }
        ];
        setComponents(mockData);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        if (!formData.partName || !formData.partCode) return; // Basic validation

        const newComponent = {
            id: Date.now(),
            ...formData
        };

        setComponents(prev => [...prev, newComponent]);
        setFormData({
            partName: '',
            partCode: '',
            sapCode: '',
            vendorName: '',
            vendorCode: '',
            designNumber: '',
            toolNumber: '',
            trademark: ''
        });
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(components);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Component Details");
        XLSX.writeFile(wb, "Component_Details.xlsx");
    };

    const filteredComponents = components.filter(item =>
        item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 text-muted-foreground w-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Component Details</h1>
                </div>
            </div>

            {/* Add New Component Detail Form */}
            <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-card-foreground">Add New Component Detail</h2>
                </div>
                <p className="text-sm text-slate-500 mb-6">Log new detailed information for a component.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Row 1 */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Part Name</label>
                        <input
                            type="text"
                            name="partName"
                            value={formData.partName}
                            onChange={handleInputChange}
                            placeholder="e.g. Front Wheel Bearing"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Part Code</label>
                        <input
                            type="text"
                            name="partCode"
                            value={formData.partCode}
                            onChange={handleInputChange}
                            placeholder="e.g. FWB-123"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">SAP Code</label>
                        <input
                            type="text"
                            name="sapCode"
                            value={formData.sapCode}
                            onChange={handleInputChange}
                            placeholder="e.g. SAP-98765"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Vendor Name</label>
                        <input
                            type="text"
                            name="vendorName"
                            value={formData.vendorName}
                            onChange={handleInputChange}
                            placeholder="e.g. Reliable Parts Co."
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Vendor Code</label>
                        <input
                            type="text"
                            name="vendorCode"
                            value={formData.vendorCode}
                            onChange={handleInputChange}
                            placeholder="e.g. RPC-001"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Design Number</label>
                        <input
                            type="text"
                            name="designNumber"
                            value={formData.designNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. DN-555"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Tool Number</label>
                        <input
                            type="text"
                            name="toolNumber"
                            value={formData.toolNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. TN-777"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Trademark</label>
                        <input
                            type="text"
                            name="trademark"
                            value={formData.trademark}
                            onChange={handleInputChange}
                            placeholder="e.g. BrandX"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-slate-200 text-slate-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-white transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add Component Detail</span>
                    </button>
                </div>
            </div>

            {/* Component Details List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-card-foreground mb-1">Component Details List</h2>
                    <p className="text-sm text-slate-500 mb-4">A list of all components with their detailed information.</p>

                    <div className="flex justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            {/* Visual Placeholder for search logic if complex, or simple implementation */}
                            <input
                                type="text"
                                placeholder="Filter by part name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 text-slate-300 hover:text-white border border-slate-700 rounded-lg px-3 py-2 text-xs transition-colors"
                        >
                            <FileSpreadsheet size={14} />
                            <span>Export to Excel</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-[#1E293B] border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-3 font-medium opacity-70">Part Name</th>
                                <th className="px-6 py-3 font-medium opacity-70">Part Code</th>
                                <th className="px-6 py-3 font-medium opacity-70">SAP Code</th>
                                <th className="px-6 py-3 font-medium opacity-70">Vendor Name</th>
                                <th className="px-6 py-3 font-medium opacity-70">Vendor Code</th>
                                <th className="px-6 py-3 font-medium opacity-70">Design Number</th>
                                <th className="px-6 py-3 font-medium opacity-70">Tool Number</th>
                                <th className="px-6 py-3 font-medium opacity-70">Trademark</th>
                                <th className="px-6 py-3 font-medium text-right opacity-70">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredComponents.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                                        No component details found.
                                    </td>
                                </tr>
                            ) : (
                                filteredComponents.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#1E293B]/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-white">{item.partName}</td>
                                        <td className="px-6 py-4 text-slate-400 font-mono uppercase">{item.partCode}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.sapCode}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.vendorName}</td>
                                        <td className="px-6 py-4 text-slate-400 font-mono">{item.vendorCode}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.designNumber}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.toolNumber}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.trademark}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual only) */}
                <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                    <span>{filteredComponents.length} row(s) found.</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select className="bg-[#1E293B] border border-slate-700 rounded px-2 py-1 text-white focus:outline-none">
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
        </div>
    );
};

export default ComponentDetails;
