import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, MoreHorizontal, AlertTriangle, CheckCircle, Eye, Edit, Loader } from 'lucide-react';
import { vendorService } from '../../services/vendorService';

const VendorComponents = ({ vendorId }) => {
    const [actionOpen, setActionOpen] = useState(null);
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComponents = async () => {
            if (!vendorId) return;
            setLoading(true);
            try {
                const data = await vendorService.getVendorComponents(vendorId);
                setComponents(data || []);
            } catch (error) {
                console.error("Error loading components", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComponents();
    }, [vendorId]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'text-green-700 bg-green-100';
            case 'Inactive': return 'text-slate-500 bg-slate-100';
            case 'Pending': return 'text-yellow-700 bg-yellow-100';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    const toggleAction = (id) => {
        if (actionOpen === id) setActionOpen(null);
        else setActionOpen(id);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500"><Loader className="animate-spin mx-auto mb-2" />Loading components...</div>;
    }

    return (
        <div className="animate-in fade-in duration-300">

            {/* Simple Search Header */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search components..."
                    className="w-full md:w-96 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10 shadow-sm"
                />
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Component Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SOR Number</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {components.length > 0 ? (
                            components.map((comp) => (
                                <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{comp.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            {comp.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{comp.sor}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(comp.status)}`}>
                                            {comp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={() => toggleAction(comp.id)}
                                            className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {/* Action Dropdown */}
                                        {actionOpen === comp.id && (
                                            <div className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 first:rounded-t-lg">
                                                    <Eye size={14} /> View SOR
                                                </button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 last:rounded-b-lg">
                                                    <Edit size={14} /> Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 italic">
                                    No components found for this vendor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorComponents;
