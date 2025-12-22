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
                    <p className="text-sm text-muted-foreground">Create and manage your vehicle and product models.</p>
                </div>
            </div>

            {/* Create New Product Model Form */}
            <div className="bg-card p-6 rounded-xl border border-border mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-lg font-semibold text-primary">Create New Product Model</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6 -mt-4">Enter the details for a new product model.</p>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Input Fields */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Model Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., SMG Electric Scooter"
                                    className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Version</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    placeholder="1.0"
                                    className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.png"
                                className="w-full bg-white border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                            />
                        </div>

                        <div>
                            <button
                                onClick={handleSave}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Save Model
                            </button>
                        </div>
                    </div>

                    {/* Image Preview */}
                    <div className="w-full lg:w-1/3">
                        <label className="block text-sm font-medium text-foreground mb-2">Image Preview</label>
                        <div className="bg-muted/30 border border-border rounded-xl h-48 flex flex-col items-center justify-center text-muted-foreground overflow-hidden relative">
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
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-primary mb-1">Existing Models</h2>
                    <p className="text-sm text-muted-foreground mb-4">A list of all saved product models.</p>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Filter by model name..."
                            className="w-full px-4 py-2 bg-white border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Image</th>
                                <th className="px-6 py-3 font-semibold">Model Name</th>
                                <th className="px-6 py-3 font-semibold">Version</th>
                                <th className="px-6 py-3 font-semibold">Created At</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {models.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No product models found.
                                    </td>
                                </tr>
                            ) : (
                                models.map((model) => (
                                    <tr key={model.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 rounded bg-white overflow-hidden flex items-center justify-center border border-border shadow-sm">
                                                {model.image ? (
                                                    <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={16} className="text-muted-foreground" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">{model.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{model.version}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{model.createdAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(model.id)}
                                                    className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500 transition-colors"
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
