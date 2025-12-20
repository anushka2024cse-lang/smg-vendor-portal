import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import { modelsService } from '../../services/modelsService';

const Models = () => {
    // State for the list of models
    const [models, setModels] = useState([]);

    // State for the Create New Model form
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        image: ''
    });

    // Mock initial fetch (Simulating backend friendliness)
    useEffect(() => {
        // In a real app, this would be: modelsService.getAllModels().then(setModels);
        setModels([]);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.version) return; // Basic validation

        const newModel = {
            id: Date.now(), // Backend would assign this
            ...formData,
            createdAt: new Date().toLocaleDateString()
        };

        setModels(prev => [...prev, newModel]);
        setFormData({ name: '', version: '', image: '' }); // Reset form
    };

    const handleDelete = (id) => {
        setModels(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="p-6 text-muted-foreground w-full">
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Product Models</h1>
                    <p className="text-sm text-slate-500">Create and manage your vehicle and product models.</p>
                </div>
            </div>

            {/* Create New Product Model Form */}
            <div className="bg-card p-6 rounded-xl border border-border mb-6">
                <div className="flex items-center gap-2 mb-6">
                    <PlusCircle className="text-white" size={20} />
                    <h2 className="text-lg font-semibold text-card-foreground">Create New Product Model</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6 -mt-4 ml-7">Enter the details for a new product model.</p>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Input Fields */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">Model Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., SMG Electric Scooter"
                                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">Version</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    placeholder="1.0"
                                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.png"
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <button
                                onClick={handleSave}
                                className="bg-slate-300 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-400 transition-colors"
                            >
                                Save Model
                            </button>
                        </div>
                    </div>

                    {/* Image Preview */}
                    <div className="w-full lg:w-1/3">
                        <label className="block text-xs font-medium text-slate-500 mb-2">Image Preview</label>
                        <div className="bg-slate-800/50 rounded-xl h-48 flex flex-col items-center justify-center text-slate-500 overflow-hidden relative">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.classList.add('image-error'); }}
                                />
                            ) : (
                                <>
                                    <ImageIcon size={48} className="mb-2 opacity-50" />
                                    <span className="text-xs">Image preview will appear here</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Models List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-card-foreground mb-1">Existing Models</h2>
                    <p className="text-sm text-muted-foreground mb-4">A list of all saved product models.</p>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Filter by model name..."
                            className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-600 uppercase bg-[#1E293B] border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-3 font-medium opacity-50">Image</th>
                                <th className="px-6 py-3 font-medium opacity-50">Model Name</th>
                                <th className="px-6 py-3 font-medium opacity-50">Version</th>
                                <th className="px-6 py-3 font-medium opacity-50">Created At</th>
                                <th className="px-6 py-3 font-medium text-right opacity-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {models.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No product models found.
                                    </td>
                                </tr>
                            ) : (
                                models.map((model) => (
                                    <tr key={model.id} className="hover:bg-[#1E293B]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 rounded bg-[#1E293B] overflow-hidden flex items-center justify-center border border-slate-700">
                                                {model.image ? (
                                                    <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={16} className="text-slate-600" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-white">{model.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{model.version}</td>
                                        <td className="px-6 py-4 text-slate-400">{model.createdAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(model.id)}
                                                    className="p-1 hover:bg-slate-700 rounded text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Models;
