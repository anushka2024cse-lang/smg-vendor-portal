import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const CreateSor = () => {
    const navigate = useNavigate();

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSpecification = () => {
        setSpecifications([...specifications, {
            id: Date.now(),
            specification: '',
            customerRequirement: '',
            compliance: 'Yes',
            remarks: ''
        }]);
    };

    const removeSpecification = (id) => {
        setSpecifications(specifications.filter(spec => spec.id !== id));
    };

    const updateSpecification = (id, field, value) => {
        setSpecifications(specifications.map(spec =>
            spec.id === id ? { ...spec, [field]: value } : spec
        ));
    };

    const handleSubmit = (isDraft = false) => {
        console.log('Form Data:', formData);
        console.log('Specifications:', specifications);
        console.log('Is Draft:', isDraft);
        // TODO: API call to save SOR
        alert(isDraft ? 'Saved as Draft!' : 'Submitted for Review!');
        navigate('/sor/list');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/sor/list')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to SOR List
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Create New SOR</h1>
                    <p className="text-slate-500 mt-1">Fill in the details to create a Statement of Requirements</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* SOR Information Section */}
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">SOR Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">SOR Number</label>
                                <input
                                    type="text"
                                    name="sorNumber"
                                    value={formData.sorNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Vendor</label>
                                <select
                                    name="vendor"
                                    value={formData.vendor}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="">Select vendor</option>
                                    <option value="Bosch Automotive">Bosch Automotive</option>
                                    <option value="NeoSky India Ltd">NeoSky India Ltd</option>
                                    <option value="Samsung Displays">Samsung Displays</option>
                                    <option value="Stanley Leathers">Stanley Leathers</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Document Number</label>
                                <input
                                    type="text"
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Details & Business Team */}
                    <div className="p-6 border-b border-slate-200 bg-slate-50/30">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Company Details & Business Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company Name *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Customer company name"
                                    required
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Enquirer Name & Designation</label>
                                <input
                                    type="text"
                                    name="enquirerName"
                                    value={formData.enquirerName}
                                    onChange={handleInputChange}
                                    placeholder="Name and designation"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Contact Info</label>
                                <input
                                    type="text"
                                    name="contactInfo"
                                    value={formData.contactInfo}
                                    onChange={handleInputChange}
                                    placeholder="Contact number & email"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nature of Company</label>
                                <input
                                    type="text"
                                    name="natureOfCompany"
                                    value={formData.natureOfCompany}
                                    onChange={handleInputChange}
                                    placeholder="Type of company"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Key Account Manager</label>
                                <input
                                    type="text"
                                    name="keyAccountManager"
                                    value={formData.keyAccountManager}
                                    onChange={handleInputChange}
                                    placeholder="KAM name"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Technical Marketing Engineer</label>
                                <input
                                    type="text"
                                    name="technicalEngineer"
                                    value={formData.technicalEngineer}
                                    onChange={handleInputChange}
                                    placeholder="Engineer name"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Application Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Vehicle Type</label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="2W">2W (Two Wheeler)</option>
                                    <option value="3W">3W (Three Wheeler)</option>
                                    <option value="4W">4W (Four Wheeler)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Charger Rating (V)</label>
                                <input
                                    type="number"
                                    name="chargerRatingV"
                                    value={formData.chargerRatingV}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Charger Rating (W)</label>
                                <input
                                    type="number"
                                    name="chargerRatingW"
                                    value={formData.chargerRatingW}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="p-6 bg-slate-50/30">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Specifications</h2>
                            <button
                                onClick={addSpecification}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <Plus size={16} />
                                Add Specification
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase">
                                        <th className="px-4 py-3 text-left border border-slate-200">Specification</th>
                                        <th className="px-4 py-3 text-left border border-slate-200">Customer Requirement</th>
                                        <th className="px-4 py-3 text-left border border-slate-200">Compliance</th>
                                        <th className="px-4 py-3 text-left border border-slate-200">Remarks</th>
                                        <th className="px-4 py-3 text-center border border-slate-200 w-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specifications.map((spec) => (
                                        <tr key={spec.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 border border-slate-200">
                                                <input
                                                    type="text"
                                                    value={spec.specification}
                                                    onChange={(e) => updateSpecification(spec.id, 'specification', e.target.value)}
                                                    placeholder="Specification"
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 border border-slate-200">
                                                <input
                                                    type="text"
                                                    value={spec.customerRequirement}
                                                    onChange={(e) => updateSpecification(spec.id, 'customerRequirement', e.target.value)}
                                                    placeholder="Requirement"
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 border border-slate-200">
                                                <select
                                                    value={spec.compliance}
                                                    onChange={(e) => updateSpecification(spec.id, 'compliance', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                >
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                    <option value="Partial">Partial</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 border border-slate-200">
                                                <input
                                                    type="text"
                                                    value={spec.remarks}
                                                    onChange={(e) => updateSpecification(spec.id, 'remarks', e.target.value)}
                                                    placeholder="Remarks"
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 border border-slate-200 text-center">
                                                <button
                                                    onClick={() => removeSpecification(spec.id)}
                                                    disabled={specifications.length === 1}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3">
                        <button
                            onClick={() => navigate('/sor/list')}
                            className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleSubmit(true)}
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-slate-200 border border-slate-300 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={() => handleSubmit(false)}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Submit for Review
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateSor;
