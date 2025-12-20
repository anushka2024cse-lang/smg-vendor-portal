import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, FileSpreadsheet, History } from 'lucide-react';
import * as XLSX from 'xlsx';

const VendorDetails = () => {
    // State for the list of vendors
    const [vendors, setVendors] = useState([]);

    // State for local filtering
    const [searchTerm, setSearchTerm] = useState('');

    // State for new vendor form
    const [formData, setFormData] = useState({
        vendorName: '',
        vendorCode: '',
        sapCode: '',
        status: 'Active',
        email: '',
        website: '',
        plantAddress1: '',
        plantAddress2: '',
        registeredAddress: '',
        contactRep1: '',
        contactNum1: '',
        contactRep2: '',
        contactNum2: ''
    });

    // Mock Data Loading
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                name: 'VAC-001',
                code: 'VR001',
                status: 'Active',
                email: 'SMGWLECTRICSCOOTERSLTD@GMAIL.COM',
                contactPerson: '',
                sapCode: 'SAP-1001'
            },
            {
                id: 2,
                name: 'RELIBAL PART.CO',
                code: 'ROC-01',
                status: 'Active',
                email: 'deep_1935@yahoo.co.in',
                contactPerson: 'VIRENDRA',
                sapCode: 'SAP-2002'
            }
        ];
        setVendors(mockData);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddVendor = () => {
        if (!formData.vendorName || !formData.vendorCode) return;

        const newVendor = {
            id: Date.now(),
            name: formData.vendorName,
            code: formData.vendorCode,
            status: formData.status,
            email: formData.email,
            contactPerson: formData.contactRep1,
            sapCode: formData.sapCode
        };

        setVendors(prev => [...prev, newVendor]);
        // Reset form
        setFormData({
            vendorName: '',
            vendorCode: '',
            sapCode: '',
            status: 'Active',
            email: '',
            website: '',
            plantAddress1: '',
            plantAddress2: '',
            registeredAddress: '',
            contactRep1: '',
            contactNum1: '',
            contactRep2: '',
            contactNum2: ''
        });
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(vendors);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vendor List");
        XLSX.writeFile(wb, "Vendor_List.xlsx");
    };

    const filteredVendors = vendors.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 text-muted-foreground w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Vendor Details</h1>
            </div>

            {/* Vendor Transaction History */}
            <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-card-foreground">Vendor Transaction History</h2>
                    <p className="text-sm text-slate-500">Enter a vendor code to view their complete receiving and dispatch history.</p>
                </div>

                <div className="flex gap-4 max-w-2xl">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Enter a unique vendor code to search"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-slate-200 text-slate-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-white transition-colors">
                        <Search size={16} />
                        <span>Search History</span>
                    </button>
                </div>
            </div>

            {/* Add New Vendor Form */}
            <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-card-foreground">Add New Vendor</h2>
                    <p className="text-sm text-slate-500">Log new detailed information for a vendor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Row 1 */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Vendor Name</label>
                        <input name="vendorName" value={formData.vendorName} onChange={handleInputChange} type="text" placeholder="e.g. Reliable Parts Co." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Vendor Code</label>
                        <input name="vendorCode" value={formData.vendorCode} onChange={handleInputChange} type="text" placeholder="e.g. RPC-001" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">SAP Code</label>
                        <input name="sapCode" value={formData.sapCode} onChange={handleInputChange} type="text" placeholder="e.g. SAP-98765" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Official Email</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="e.g. contact@rpc.com" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Website</label>
                        <input name="website" value={formData.website} onChange={handleInputChange} type="text" placeholder="e.g. https://www.rpc.com" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    {/* Row 3 - Plant Line 1 */}
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-xs font-medium text-slate-500 mb-2">Plant Address (Line 1)</label>
                        <input name="plantAddress1" value={formData.plantAddress1} onChange={handleInputChange} type="text" placeholder="123 Industrial Way" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    {/* Row 4 - Plant Line 2 */}
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-xs font-medium text-slate-500 mb-2">Plant Address (Line 2)</label>
                        <input name="plantAddress2" value={formData.plantAddress2} onChange={handleInputChange} type="text" placeholder="Suite 456, Industrial Park" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    {/* Row 5 - Registered Office */}
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-xs font-medium text-slate-500 mb-2">Registered Office Address</label>
                        <input name="registeredAddress" value={formData.registeredAddress} onChange={handleInputChange} type="text" placeholder="1 Legal Avenue, Business City" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>

                    {/* Row 6 - Contact 1 */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Contact Representative (1)</label>
                        <input name="contactRep1" value={formData.contactRep1} onChange={handleInputChange} type="text" placeholder="e.g. John Doe" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Contact Number (1)</label>
                        <input name="contactNum1" value={formData.contactNum1} onChange={handleInputChange} type="text" placeholder="e.g. +1 234 567 890" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div className="hidden lg:block"></div> {/* Spacer */}

                    {/* Row 7 - Contact 2 */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Contact Representative (2)</label>
                        <input name="contactRep2" value={formData.contactRep2} onChange={handleInputChange} type="text" placeholder="e.g. Jane Smith" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Contact Number (2)</label>
                        <input name="contactNum2" value={formData.contactNum2} onChange={handleInputChange} type="text" placeholder="e.g. +1 987 654 321" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleAddVendor}
                        className="flex items-center gap-2 bg-slate-200 text-slate-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-white transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add Vendor</span>
                    </button>
                </div>
            </div>

            {/* Vendor List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-card-foreground mb-1">Vendor List</h2>
                    <p className="text-sm text-slate-500 mb-4">A list of all vendors with their detailed information.</p>

                    <div className="flex justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Filter by vendor name..."
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
                                <th className="px-6 py-3 font-medium opacity-70">Vendor Name</th>
                                <th className="px-6 py-3 font-medium opacity-70">Vendor Code</th>
                                <th className="px-6 py-3 font-medium opacity-70">Status</th>
                                <th className="px-6 py-3 font-medium opacity-70">Email</th>
                                <th className="px-6 py-3 font-medium opacity-70">Contact Person</th>
                                <th className="px-6 py-3 font-medium text-right opacity-70">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredVendors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No vendors found.
                                    </td>
                                </tr>
                            ) : (
                                filteredVendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-[#1E293B]/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-white uppercase">{vendor.name}</td>
                                        <td className="px-6 py-4 text-slate-400 font-mono uppercase">{vendor.code}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${vendor.status.toLowerCase() === 'active' ? 'bg-[#1E293B] text-slate-300 border border-slate-600' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 lowercase">{vendor.email}</td>
                                        <td className="px-6 py-4 text-slate-400 uppercase">{vendor.contactPerson}</td>
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
                    <span>{filteredVendors.length} row(s) found.</span>
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

export default VendorDetails;
