import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { diePlanService } from '../services/diePlanService';

const EditDiePlanModal = ({ isOpen, onClose, plan, onSuccess }) => {
    const [formData, setFormData] = useState({
        vendor: '',
        partName: '',
        stage: 'Design',
        status: 'On Track',
        startDate: '',
        targetDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const stages = ['Design', 'Raw Material', 'Machining', 'Assembly', 'Trials T0', 'Trials T1', 'PPAP', 'Production'];

    useEffect(() => {
        if (plan) {
            setFormData({
                vendor: plan.vendor || '',
                partName: plan.partName || '',
                stage: plan.stage || 'Design',
                status: plan.status || 'On Track',
                startDate: plan.startDate || '',
                targetDate: plan.targetDate || ''
            });
            setError('');
        }
    }, [plan]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Map frontend fields to backend schema
            const updateData = {
                vendorName: formData.vendor,
                partName: formData.partName,
                stage: formData.stage,
                status: formData.status,
                startDate: formData.startDate,
                targetDate: formData.targetDate
            };

            await diePlanService.updatePlan(plan._id, updateData);

            // Success - close modal and refresh
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Failed to update die plan. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setError('');
        onClose();
    };

    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Edit Die Development Plan</h2>
                        <p className="text-xs text-slate-500 mt-1">Plan ID: {plan.id}</p>
                    </div>
                    <button
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Vendor</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                value={formData.vendor}
                                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="">Select Vendor</option>
                                <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                                <option value="NeoSky India">NeoSky India</option>
                                <option value="Alpha Tech">Alpha Tech</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Part Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="e.g. Rear Fender Casing"
                                value={formData.partName}
                                onChange={e => setFormData({ ...formData, partName: e.target.value })}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Current Stage</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                value={formData.stage}
                                onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                disabled={isSubmitting}
                                required
                            >
                                {stages.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="On Track">On Track</option>
                                <option value="Delayed">Delayed</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Target Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    value={formData.targetDate}
                                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Updating...' : 'Update Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDiePlanModal;
