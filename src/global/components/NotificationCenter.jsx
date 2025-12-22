import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import notificationService from '../../services/notificationService';
import socketService from '../../services/socketService';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getAll({ limit: 10 });
            setNotifications(response.data || []);
            setUnreadCount(response.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
        setLoading(false);
    };

    // WebSocket setup - NO MORE POLLING!
    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Connect to WebSocket
        const socket = socketService.connect();

        // Listen for new notifications in real-time
        const handleNewNotification = (notification) => {
            console.log('📩 New notification received:', notification);
            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
            setUnreadCount(prev => prev + 1);
        };

        socketService.on('new-notification', handleNewNotification);

        // Cleanup on unmount
        return () => {
            socketService.off('new-notification', handleNewNotification);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationService.delete(id);
            setNotifications(prev => prev.filter(notif => notif._id !== id));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await notificationService.clearRead();
            setNotifications(prev => prev.filter(notif => !notif.isRead));
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            success: 'text-emerald-600 bg-emerald-50',
            error: 'text-red-600 bg-red-50',
            warning: 'text-amber-600 bg-amber-50',
            info: 'text-blue-600 bg-blue-50',
            sor: 'text-purple-600 bg-purple-50',
            payment: 'text-green-600 bg-green-50',
            po: 'text-indigo-600 bg-indigo-50',
            vendor: 'text-orange-600 bg-orange-50'
        };
        return colors[type] || colors.info;
    };

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border-2 border-slate-200 shadow-2xl shadow-slate-200/50 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b-2 border-slate-100">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Check size={14} className="inline mr-1" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-6 text-center text-slate-500 text-sm">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={48} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-600 font-medium">No notifications yet</p>
                                <p className="text-xs text-slate-400 mt-1">We'll notify you when something happens</p>
                            </div>
                        ) : (
                            <>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${getTypeColor(notification.type)}`}>
                                                {notification.type}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1.5">
                                                    {formatTime(notification.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t-2 border-slate-100 bg-slate-50">
                            <button
                                onClick={handleClearAll}
                                className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 py-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Clear all read notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
