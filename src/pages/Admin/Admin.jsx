import React, { useState, useEffect } from 'react';
import { AlertTriangle, Save, Globe, Shield, Mail, Clock, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';

const Admin = () => {
    const toast = useToast();
    const [profile, setProfile] = useState({ name: '', email: '', role: '' });
    const [loading, setLoading] = useState(false);

    // System Config State
    const [systemConfig, setSystemConfig] = useState({
        siteName: 'SMG Vendor Portal',
        supportEmail: 'support@smg.com',
        maintenanceMode: false,
        allowRegistration: true,
        sessionTimeout: 60
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const profileData = await adminService.getCurrentUser();
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            }
        };
        fetchAdminData();
    }, []);

    const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSystemConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveConfig = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('System configuration saved successfully!');
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">General Settings</h1>
                <p className="text-sm text-slate-500">Manage system-wide configurations and your admin profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Profile</h2>

                        <div className="flex bg-slate-100 rounded-full h-20 w-20 items-center justify-center text-2xl font-bold text-slate-500 mb-4 mx-auto">
                            {profile.name ? profile.name.charAt(0) : 'A'}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                                <input type="text" value={profile.name} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none font-medium text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                                <input type="text" value={profile.email} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none font-medium text-sm" />
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-6 flex gap-3">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <div>
                                <h4 className="text-xs font-bold text-red-700">Restricted Access</h4>
                                <p className="text-[10px] text-red-600/80 leading-relaxed mt-1">Super Admin profile details cannot be modified here. Please contact IT support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: System Settings */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">System Configuration</h2>
                                <p className="text-sm text-slate-500">Global settings for the main application portal.</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* General Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Application Name</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            name="siteName"
                                            value={systemConfig.siteName}
                                            onChange={handleConfigChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="email"
                                            name="supportEmail"
                                            value={systemConfig.supportEmail}
                                            onChange={handleConfigChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Security & Access */}
                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Shield size={16} className="text-slate-400" />
                                    Security & Access
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Session Timeout (minutes)</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="number"
                                                name="sessionTimeout"
                                                value={systemConfig.sessionTimeout}
                                                onChange={handleConfigChange}
                                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="border-t border-slate-100 pt-6 space-y-4">
                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div>
                                        <div className="font-semibold text-slate-900">Maintenance Mode</div>
                                        <div className="text-xs text-slate-500 mt-1">Prevent users from logging in while you perform updates.</div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="maintenanceMode"
                                            checked={systemConfig.maintenanceMode}
                                            onChange={handleConfigChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div>
                                        <div className="font-semibold text-slate-900">Allow Vendor Registration</div>
                                        <div className="text-xs text-slate-500 mt-1">If disabled, only admins can create new vendor accounts.</div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="allowRegistration"
                                            checked={systemConfig.allowRegistration}
                                            onChange={handleConfigChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={handleSaveConfig}
                                disabled={loading}
                                className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="animate-spin">⌛</span>
                                ) : (
                                    <Save size={18} />
                                )}
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
