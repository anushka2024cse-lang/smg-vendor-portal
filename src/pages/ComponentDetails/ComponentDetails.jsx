import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, X, Package, Box } from 'lucide-react';
import componentService from '../../services/componentService';

const ComponentDetails = () => {
    // Data State
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [activeActionId, setActiveActionId] = useState(null); // For handling the actions dropdown
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 }); // coordinates

    // Form State
    const initialFormState = {
        name: '',
        code: '',
        category: '',
        unit: 'pcs',
        unitPrice: 0,
        hsnCode: '',
        gstRate: 18,
        leadTime: 0,
        moq: 1,
        status: 'Active',
        description: '',
        specifications: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    // Initial Load
    useEffect(() => {
        fetchComponents();

        // Close dropdown on click outside - handle global click
        const closeDropdown = () => {
            setActiveActionId(null);
        };
        document.addEventListener('click', closeDropdown);
        window.addEventListener('scroll', closeDropdown, true); // Close on scroll too
        return () => {
            document.removeEventListener('click', closeDropdown);
            window.removeEventListener('scroll', closeDropdown, true);
        };
    }, []);

    const fetchComponents = async () => {
        try {
            setLoading(true);
            const res = await componentService.getComponents();
            if (res.success) {
                setComponents(res.data);
            }
        } catch (error) {
            console.error("Error fetching components", error);
        } finally {
            setLoading(false);
        }
    };

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditModalOpen && selectedComponent) {
                await componentService.updateComponent(selectedComponent._id, formData);
            } else {
                await componentService.createComponent(formData);
            }
            fetchComponents();
            closeModals();
        } catch (error) {
            alert("Error saving component: " + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async () => {
        if (!selectedComponent) return;
        try {
            await componentService.deleteComponent(selectedComponent._id);
            fetchComponents();
            closeModals();
        } catch (error) {
            alert("Error deleting component");
        }
    };

    const openAddModal = () => {
        setFormData(initialFormState);
        setIsAddModalOpen(true);
    };

    const openEditModal = (comp) => {
        setFormData(comp);
        setSelectedComponent(comp);
        setIsEditModalOpen(true);
        setActiveActionId(null);
    };

    const openDeleteModal = (comp) => {
        setSelectedComponent(comp);
        setIsDeleteModalOpen(true);
        setActiveActionId(null);
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedComponent(null);
        setFormData(initialFormState);
    };

    const toggleActionMenu = (e, id) => {
        e.stopPropagation();

        if (activeActionId === id) {
            setActiveActionId(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();

        setMenuPosition({
            top: rect.bottom + 5,
            right: window.innerWidth - rect.right
        });

        setActiveActionId(id);
    };

    // Filter Logic
    const filteredComponents = components.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Components</h1>
                    <p className="text-slate-500 mt-1">Manage all component master data</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-800 text-white px-5 py-2.5 rounded-lg hover:bg-blue-900 transition-all font-medium shadow-sm hover:shadow active:scale-95"
                >
                    <Plus size={18} />
                    Add Component
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>

                <div className="relative group min-w-[150px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <Filter size={16} />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Discontinued">Discontinued</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-semibold">
                                <th className="px-6 py-4">Component</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Unit Price</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">HSN Code</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading components...</td>
                                </tr>
                            ) : filteredComponents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No components found.</td>
                                </tr>
                            ) : (
                                filteredComponents.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                    <Box size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{item.name}</div>
                                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{item.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 capitalize">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                                {item.category.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">₹{item.unitPrice.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-slate-500 uppercase text-xs font-bold">{item.unit}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.hsnCode || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    item.status === 'Inactive' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                        'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => toggleActionMenu(e, item._id)}
                                                className={`p-2 rounded-full transition-colors ${activeActionId === item._id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FLOATING ACTION MENU - Fixed Position */}
            {activeActionId && (
                <div
                    className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`,
                        width: '140px'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent clicking menu from closing it
                >
                    <button
                        onClick={() => openEditModal(components.find(c => c._id === activeActionId))}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => openDeleteModal(components.find(c => c._id === activeActionId))}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}

            {/* MODAL: ADD / EDIT */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-800">
                                {isEditModalOpen ? 'Edit Component' : 'Add New Component'}
                            </h2>
                            <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="componentForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Component Code *</label>
                                    <input required type="text" name="code" value={formData.code} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        placeholder="e.g. COMP-BDY-001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Component Name *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        placeholder="e.g. Front Fender"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="body_parts">Body Parts</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="motor">Motor</option>
                                        <option value="battery">Battery</option>
                                        <option value="controller">Controller</option>
                                        <option value="chassis">Chassis</option>
                                        <option value="suspension">Suspension</option>
                                        <option value="brakes">Brakes</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Unit</label>
                                    <select name="unit" value={formData.unit} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    >
                                        <option value="pcs">Pieces (pcs)</option>
                                        <option value="set">Set (set)</option>
                                        <option value="kg">Kilograms (kg)</option>
                                        <option value="m">Meters (m)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Unit Price (₹)</label>
                                    <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">HSN Code</label>
                                    <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        placeholder="8714"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">GST Rate (%)</label>
                                    <select name="gstRate" value={formData.gstRate} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    >
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Lead Time (Days)</label>
                                    <input type="number" name="leadTime" value={formData.leadTime} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Min Order Quantity</label>
                                    <input type="number" name="moq" value={formData.moq} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Discontinued">Discontinued</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
                                    <textarea name="description" rows="2" value={formData.description} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                                        placeholder="Component description"
                                    ></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Specifications</label>
                                    <textarea name="specifications" rows="2" value={formData.specifications} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                                        placeholder="Technical specifications"
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="componentForm" className="px-6 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-slate-800 rounded-lg shadow-sm hover:shadow transition-all">
                                {isEditModalOpen ? 'Update Component' : 'Create Component'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: DELETE CONFIRMATION */}
            {isDeleteModalOpen && selectedComponent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Delete Component</h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Are you sure you want to delete <span className="font-semibold text-slate-800">"{selectedComponent.name}"</span>?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={closeModals} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm hover:shadow transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ComponentDetails;
