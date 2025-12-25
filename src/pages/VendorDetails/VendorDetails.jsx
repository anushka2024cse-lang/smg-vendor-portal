import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Edit,
    Wrench,
    Box,
    FileText,
    History,
    Package,
    Calendar,
    MapPin,
    Building,
    CreditCard,
    Mail,
    Phone,
    User,
    CheckCircle,
    Upload,
    Download,
    Loader
} from 'lucide-react';
import VendorComponents from '../Vendor/VendorComponents';
import { vendorService } from '../../services/vendorService';

const VendorDetails = () => {
    const navigate = useNavigate();
    const { vendorId } = useParams();
    const [activeTab, setActiveTab] = useState('Overview');
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [documents, setDocuments] = useState([]);

    React.useEffect(() => {
        const fetchVendor = async () => {
            try {
                if (vendorId) {
                    // Fetch Vendor Details first (Critical)
                    try {
                        const data = await vendorService.getVendorById(vendorId);
                        if (data) {
                            setVendorData(data);
                        } else {
                            throw new Error('Vendor data is null');
                        }
                    } catch (err) {
                        console.error("Failed to load vendor core details", err);
                        // If core details fail, we can't show much, so let it allow 'Vendor not found' state
                        return;
                    }

                    // Fetch secondary data independently
                    try {
                        const historyData = await vendorService.getVendorHistory(vendorId);
                        setHistory(historyData || []);
                    } catch (err) {
                        console.warn("Failed to load vendor history", err);
                    }

                    try {
                        const docsData = await vendorService.getVendorDocuments(vendorId);
                        setDocuments(docsData || []);
                    } catch (err) {
                        console.warn("Failed to load vendor documents", err);
                    }
                }
            } catch (error) {
                console.error("Critical failure in vendor details load", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [vendorId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-blue-900" size={48} />
            </div>
        );
    }

    if (!vendorData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
                <p className="text-xl font-semibold">Vendor not found</p>
                <button onClick={() => navigate('/vendor/list')} className="mt-4 text-blue-600 hover:underline">Back to List</button>
            </div>
        );
    }

    const tabs = [
        { id: 'Overview', label: 'Overview', icon: FileText },
        { id: 'Components', label: 'Components', icon: Package },
        { id: 'Documents', label: 'Documents', icon: FileText },
        { id: 'History', label: 'History', icon: History },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-700">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span className="cursor-pointer hover:text-blue-900 transition-colors" onClick={() => navigate('/dashboard')}>Home</span>
                        <span>&gt;</span>
                        <span className="cursor-pointer hover:text-blue-900 transition-colors" onClick={() => navigate('/vendor/list')}>Vendors</span>
                        <span>&gt;</span>
                        <span className="text-slate-900 font-medium">{vendorData.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{vendorData.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/vendor/list')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all hover:-translate-y-0.5 shadow-sm font-medium"
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium">
                        <Edit size={18} />
                        Edit Vendor
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-1 flex gap-2 overflow-x-auto animate-in fade-in duration-700">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-slate-50 text-blue-900 shadow-sm border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-blue-600' : ''} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[500px] animate-in fade-in duration-700">

                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Company Information Card */}
                            <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                            <Building size={18} className="text-blue-600" />
                                        </div>
                                        Company Information
                                    </h2>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${vendorData.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {vendorData.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">Vendor Code</span>
                                        <span className="text-sm font-bold text-slate-900 col-span-2">{vendorData.id}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">Company Name</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.name}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1 flex items-center gap-2">Contact Person</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.contact}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1 flex items-center gap-2">Email</span>
                                        <a href={`mailto:${vendorData.email}`} className="text-sm font-medium text-blue-600 hover:underline col-span-2">{vendorData.email}</a>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1 flex items-center gap-2">Phone</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Details Card */}
                            <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                            <MapPin size={18} className="text-red-500" />
                                        </div>
                                        Address Details
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">Address</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.address.street}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">City</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.city}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">State</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.address.state}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">Pincode</span>
                                        <span className="text-sm font-medium text-slate-900 col-span-2">{vendorData.address.zip}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">GST Number</span>
                                        <span className="text-sm font-mono font-medium text-slate-900 col-span-2 bg-slate-100 px-2 py-0.5 rounded w-fit">{vendorData.tax.gst}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-sm font-semibold text-slate-500 col-span-1">PAN Number</span>
                                        <span className="text-sm font-mono font-medium text-slate-900 col-span-2 bg-slate-100 px-2 py-0.5 rounded w-fit">{vendorData.tax.pan}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banking Details */}
                        <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <CreditCard size={18} className="text-emerald-600" />
                                </div>
                                Banking Details
                            </h2>
                            <div className="p-8 text-center text-slate-400 text-sm mt-2 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                                (Secure financial information hidden by default)
                            </div>
                        </div>
                    </div>
                )}

                {/* COMPONENTS TAB - Using Sub-Component */}
                {activeTab === 'Components' && (
                    <div className="animate-in fade-in duration-500">
                        <VendorComponents vendorId={vendorId} />
                    </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === 'Documents' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FileText size={20} className="text-blue-600" />
                            </div>
                            Legal Compliance Documents
                        </h2>

                        {documents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="group">
                                        <h3 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-2 uppercase tracking-wide text-xs">
                                            {doc.type}
                                        </h3>

                                        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">PDF Document • 2.4 MB</p>
                                                </div>
                                            </div>
                                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                                <CheckCircle size={12} strokeWidth={3} /> {doc.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Upload Placeholder */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-2 uppercase tracking-wide text-xs">
                                        Upload New
                                    </h3>

                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer group h-[88px]">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Upload size={18} />
                                            <span>Upload Document</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">No documents found for this vendor.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'History' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <History size={20} className="text-purple-600" />
                            </div>
                            Activity History
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Tool History Column */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 pl-1">
                                    <Wrench size={14} /> Tool History
                                </h3>
                                <div className="space-y-3">
                                    {history.filter(h => h.type === 'Tool').length > 0 ? (
                                        history.filter(h => h.type === 'Tool').map(item => (
                                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group/item">
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm group-hover/item:text-blue-700 transition-colors">{item.name}</h4>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                                            <Calendar size={12} /> {item.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] uppercase font-bold text-slate-600 tracking-wide">
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center">
                                            <p className="text-sm text-slate-400">No tool history available.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Allotment History Column */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 pl-1">
                                    <Box size={14} /> Allotment History
                                </h3>
                                <div className="space-y-3">
                                    {history.filter(h => h.type === 'Allotment').length > 0 ? (
                                        history.filter(h => h.type === 'Allotment').map(item => (
                                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group/item">
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm group-hover/item:text-emerald-700 transition-colors">{item.name}</h4>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                                            <Calendar size={12} /> {item.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] uppercase font-bold text-slate-600 tracking-wide">
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center">
                                            <p className="text-sm text-slate-400">No allotment history available.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDetails;
