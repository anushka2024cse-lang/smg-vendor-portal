import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Building2, Car } from 'lucide-react';

const SORForm = ({ id, existingData, isEditMode }) => {

    // Form State
    const [formData, setFormData] = useState({
        sorNumber: 'SOR-202512-785',
        vendor: '',
        documentNumber: 'LBD-MKTGSOR-PC',
        companyName: '',
        enquirerName: '',
        contactInfo: '',
        natureOfCompany: '',
        keyAccountManager: '',
        technicalEngineer: '',
        vehicleType: '2W',
        chargerRatingV: 0,
        chargerRatingW: 0,
    });

    const [specifications, setSpecifications] = useState([
        { id: 1, specification: '', customerRequirement: '', compliance: 'Yes', remarks: '' }
    ]);

    // Load existing data if available
    useEffect(() => {
        if (existingData) {
            setFormData(prev => ({ ...prev, ...existingData }));
            if (existingData.specifications) {
                setSpecifications(existingData.specifications);
            }
        }
    }, [existingData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSpecification = () => {
        if (!isEditMode) return;
        setSpecifications([...specifications, {
            id: Date.now(),
            specification: '',
            customerRequirement: '',
            compliance: 'Yes',
            remarks: ''
        }]);
    };

    const removeSpecification = (id) => {
        if (!isEditMode || specifications.length === 1) return;
        setSpecifications(specifications.filter(spec => spec.id !== id));
    };

    const updateSpecification = (id, field, value) => {
        if (!isEditMode) return;
        setSpecifications(specifications.map(spec =>
            spec.id === id ? { ...spec, [field]: value } : spec
        ));
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">

            {/* SOR Information Section */}
            <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50/50 to-transparent">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">SOR Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">SOR Number</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="sorNumber"
                                value={formData.sorNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 font-semibold bg-slate-50 rounded-xl border-2 border-transparent">{formData.sorNumber}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Vendor</label>
                        {isEditMode ? (
                            <select
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-slate-300"
                            >
                                <option value="">Select vendor</option>
                                <option value="Bosch Automotive">Bosch Automotive</option>
                                <option value="NeoSky India Ltd">NeoSky India Ltd</option>
                                <option value="Samsung Displays">Samsung Displays</option>
                                <option value="Stanley Leathers">Stanley Leathers</option>
                            </select>
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.vendor || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Document Number</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.documentNumber}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Company Details & Business Team */}
            <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-emerald-50/30 to-transparent">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                        <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Company Details & Business Team</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Customer and internal team information</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Company Name *</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Customer company name"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 font-semibold bg-slate-50 rounded-xl border-2 border-transparent">{formData.companyName || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Enquirer Name & Designation</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="enquirerName"
                                value={formData.enquirerName}
                                onChange={handleInputChange}
                                placeholder="Name and designation"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.enquirerName || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Contact Info</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleInputChange}
                                placeholder="Contact number & email"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.contactInfo || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Nature of Company</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="natureOfCompany"
                                value={formData.natureOfCompany}
                                onChange={handleInputChange}
                                placeholder="Type of company"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.natureOfCompany || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Key Account Manager</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="keyAccountManager"
                                value={formData.keyAccountManager}
                                onChange={handleInputChange}
                                placeholder="KAM name"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.keyAccountManager || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Technical Marketing Engineer</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="technicalEngineer"
                                value={formData.technicalEngineer}
                                onChange={handleInputChange}
                                placeholder="Engineer name"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.technicalEngineer || '-'}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Details */}
            <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-purple-50/30 to-transparent">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-600 rounded-lg">
                        <Car size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Application Details</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Vehicle type and charger specifications</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Vehicle Type</label>
                        {isEditMode ? (
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-slate-300"
                            >
                                <option value="2W">2W (Two Wheeler)</option>
                                <option value="3W">3W (Three Wheeler)</option>
                                <option value="4W">4W (Four Wheeler)</option>
                            </select>
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.vehicleType}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Charger Rating (V)</label>
                        {isEditMode ? (
                            <input
                                type="number"
                                name="chargerRatingV"
                                value={formData.chargerRatingV}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.chargerRatingV}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Charger Rating (W)</label>
                        {isEditMode ? (
                            <input
                                type="number"
                                name="chargerRatingW"
                                value={formData.chargerRatingW}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-slate-300"
                            />
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border-2 border-transparent">{formData.chargerRatingW}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="p-8 bg-gradient-to-r from-amber-50/20 to-transparent">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Specifications</h2>
                        <p className="text-xs text-slate-500 mt-1">Technical requirements and compliance details</p>
                    </div>
                    {isEditMode && (
                        <button
                            onClick={addSpecification}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Add Specification
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Specification</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Customer Requirement</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Compliance</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Remarks</th>
                                {isEditMode && <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider w-24">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {specifications.map((spec) => (
                                <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={spec.specification}
                                                onChange={(e) => updateSpecification(spec.id, 'specification', e.target.value)}
                                                placeholder="Specification"
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                            />
                                        ) : (
                                            <div className="text-sm text-slate-900 font-medium">{spec.specification || '-'}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={spec.customerRequirement}
                                                onChange={(e) => updateSpecification(spec.id, 'customerRequirement', e.target.value)}
                                                placeholder="Requirement"
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                            />
                                        ) : (
                                            <div className="text-sm text-slate-900">{spec.customerRequirement || '-'}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditMode ? (
                                            <select
                                                value={spec.compliance}
                                                onChange={(e) => updateSpecification(spec.id, 'compliance', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                            >
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                                <option value="Partial">Partial</option>
                                            </select>
                                        ) : (
                                            <div className="text-sm text-slate-900">
                                                <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${spec.compliance === 'Yes' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' :
                                                        spec.compliance === 'No' ? 'bg-red-100 text-red-700 border-2 border-red-200' :
                                                            'bg-amber-100 text-amber-700 border-2 border-amber-200'
                                                    }`}>
                                                    {spec.compliance}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={spec.remarks}
                                                onChange={(e) => updateSpecification(spec.id, 'remarks', e.target.value)}
                                                placeholder="Remarks"
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                            />
                                        ) : (
                                            <div className="text-sm text-slate-600 italic">{spec.remarks || '-'}</div>
                                        )}
                                    </td>
                                    {isEditMode && (
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => removeSpecification(spec.id)}
                                                disabled={specifications.length === 1}
                                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                                                title="Delete row"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default SORForm;
