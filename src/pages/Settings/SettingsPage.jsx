import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Save, Camera } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';

const SettingsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    // Data States
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        role: '',
        avatar: ''
    });

    useEffect(() => {
        // Load real user data
        const user = authService.getCurrentUser();
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                designation: user.designation || '',
                role: user.role || 'User',
                avatar: user.avatar || ''
            });
        }
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await authService.updateProfile(profile);
            alert("✅ Profile updated successfully!");
            // Reload to refresh header and sidebar
            window.location.reload();
        } catch (error) {
            console.error('Profile update error:', error);
            const errorMessage = error.message || error.response?.data?.message || "Failed to update profile";
            alert(`❌ ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === id
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-xl w-fit">
                <TabButton id="profile" icon={User} label="Profile" />
                <TabButton id="notifications" icon={Bell} label="Notifications" />
                <TabButton id="security" icon={Shield} label="Security" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
                            <p className="text-sm text-slate-500">Update your personal information</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avatar Upload Selection */}
                            <div className="md:col-span-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 shadow-sm transition-transform hover:scale-105" title="Change Avatar">
                                        <Camera size={14} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        alert("Image size should be less than 2MB");
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setProfile(prev => ({ ...prev, avatar: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500 mt-3 font-medium">Click the camera icon to update profile picture</p>
                                <p className="text-[10px] text-slate-400">SVG, PNG, JPG (Max. 2MB)</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="Your phone number"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    placeholder="Your department"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={profile.designation}
                                    onChange={handleChange}
                                    placeholder="Your designation"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Role</label>
                                <input
                                    type="text"
                                    value={profile.role}
                                    disabled
                                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed capitalize"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#213763] hover:bg-[#1a2c50] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Notification Preferences</h2>
                            <p className="text-sm text-slate-500">Manage how you receive notifications</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'Email Notifications', desc: 'Receive notifications via email' },
                                { title: 'Purchase Order Alerts', desc: 'Get notified about PO status changes' },
                                { title: 'Payment Alerts', desc: 'Get notified about payment updates' },
                                { title: 'Vendor Updates', desc: 'Get notified about vendor activities' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2">
                                    <div>
                                        <h3 className="font-medium text-slate-800">{item.title}</h3>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213763]"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button className="flex items-center gap-2 bg-[#213763] hover:bg-[#1a2c50] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/10">
                                <Save size={18} />
                                Save Preferences
                            </button>
                        </div>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Security Settings</h2>
                            <p className="text-sm text-slate-500">Manage your account security</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <h3 className="font-medium text-blue-800 mb-2">Account Security</h3>
                            <p className="text-sm text-blue-600">
                                Your account is protected with enterprise-grade security. Password changes and two-factor authentication can be managed through your organization's SSO provider.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Last Login</p>
                                <p className="font-medium text-slate-800">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Account Created</p>
                                <p className="font-medium text-slate-800">12/22/2025</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
