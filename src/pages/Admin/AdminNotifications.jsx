import React, { useState, useEffect } from 'react';
import { Send, Bell, Users, CheckCircle, AlertCircle, Info, AlertTriangle, FileText, CreditCard, Package, Building2, Trash2 } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminNotifications = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        recipient: 'all',
        type: 'info',
        title: '',
        message: '',
        link: ''
    });

    // Fetch data
    const fetchInitialData = async () => {
        try {
            const [notifsRes, usersRes] = await Promise.all([
                notificationService.getAll({ limit: 10 }),
                adminService.getAllUsers()
            ]);
            setRecentNotifications(notifsRes.data || []);
            setUsers(usersRes || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load initial data');
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await notificationService.create(formData);
            toast.success('Notification sent successfully!');

            // Reset form
            setFormData({
                recipient: 'temp-user-id',
                type: 'info',
                title: '',
                message: '',
                link: ''
            });

            // Refresh list
            fetchRecentNotifications();
        } catch (error) {
            toast.error('Failed to send notification');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await notificationService.delete(id);
            toast.success('Notification deleted');
            fetchRecentNotifications();
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const notificationTypes = [
        { value: 'info', label: 'Info', icon: Info, color: 'blue' },
        { value: 'success', label: 'Success', icon: CheckCircle, color: 'emerald' },
        { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'amber' },
        { value: 'error', label: 'Error', icon: AlertCircle, color: 'red' },
        { value: 'sor', label: 'SOR', icon: FileText, color: 'purple' },
        { value: 'payment', label: 'Payment', icon: CreditCard, color: 'green' },
        { value: 'po', label: 'Purchase Order', icon: Package, color: 'indigo' },
        { value: 'vendor', label: 'Vendor', icon: Building2, color: 'orange' }
    ];

    const quickTemplates = [
        {
            title: 'SOR Approved',
            message: 'Your Statement of Requirements has been approved.',
            type: 'success',
            link: '/sor/list'
        },
        {
            title: 'Payment Pending',
            message: 'A payment requires your approval.',
            type: 'warning',
            link: '/payments'
        },
        {
            title: 'New PO Created',
            message: 'A new purchase order has been created.',
            type: 'info',
            link: '/purchase-orders'
        },
        {
            title: 'System Maintenance',
            message: 'System will be under maintenance tonight from 11 PM to 2 AM.',
            type: 'warning',
            link: ''
        }
    ];

    const useTemplate = (template) => {
        setFormData(prev => ({
            ...prev,
            title: template.title,
            message: template.message,
            type: template.type,
            link: template.link
        }));
    };

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return notifDate.toLocaleDateString();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Notification Management</h1>
                <p className="text-slate-600">Send notifications to users and manage existing notifications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Create Notification Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Send size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Create New Notification</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Notification Type */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                                    Notification Type *
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {notificationTypes.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.type === type.value;
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isSelected
                                                    ? `border-${type.color}-500 bg-${type.color}-50`
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                            >
                                                <Icon size={20} className={isSelected ? `text-${type.color}-600` : 'text-slate-400'} />
                                                <span className={`text-xs font-bold ${isSelected ? `text-${type.color}-700` : 'text-slate-600'}`}>
                                                    {type.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter notification title"
                                    required
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Enter notification message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                                />
                            </div>

                            {/* Link (Optional) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                    Link (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="/sor/list or /payments"
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>

                            {/* Email Options */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <input
                                        type="checkbox"
                                        id="sendEmail"
                                        checked={formData.sendEmail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                                        className="w-5 h-5 text-blue-600 rounded border-2 border-slate-300 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="sendEmail" className="text-sm font-bold text-slate-700 cursor-pointer">
                                        📧 Also send Email Notification
                                    </label>
                                </div>

                                {formData.sendEmail && (
                                    <div className="mt-3">
                                        <input
                                            type="email"
                                            name="userEmail"
                                            value={formData.userEmail}
                                            onChange={handleInputChange}
                                            placeholder="user@example.com"
                                            required={formData.sendEmail}
                                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        />
                                        <p className="text-xs text-slate-600 mt-2">
                                            Professional email will be sent to this address using your configured SMTP settings
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Recipient Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                    Recipient
                                </label>
                                <select
                                    name="recipient"
                                    value={formData.recipient}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="all">All Users</option>
                                    <option disabled>──────────</option>
                                    {users.map(user => (
                                        <option key={user.id || user._id} value={user.id || user._id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">Select 'All Users' to broadcast or pick a specific user.</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                                {loading ? 'Sending...' : 'Send Notification'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Quick Templates & Recent */}
                <div className="space-y-6">
                    {/* Quick Templates */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Templates</h3>
                        <div className="space-y-2">
                            {quickTemplates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => useTemplate(template)}
                                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border-2 border-transparent hover:border-slate-200 transition-all"
                                >
                                    <p className="text-sm font-bold text-slate-900">{template.title}</p>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{template.message}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Notifications</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">No notifications sent yet</p>
                            ) : (
                                recentNotifications.map((notif) => (
                                    <div key={notif._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 group relative">
                                        <p className="text-sm font-bold text-slate-900">{notif.title}</p>
                                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full bg-${notif.type === 'success' ? 'emerald' : notif.type === 'warning' ? 'amber' : 'blue'}-100 text-${notif.type === 'success' ? 'emerald' : notif.type === 'warning' ? 'amber' : 'blue'}-700`}>
                                                {notif.type}
                                            </span>
                                            <span className="text-xs text-slate-400">{formatTime(notif.createdAt)}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(notif._id)}
                                            className="absolute top-2 right-2 p-1.5 text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
