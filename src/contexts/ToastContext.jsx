import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
    const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
    const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
    const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

    const value = {
        showToast,
        success,
        error,
        warning,
        info,
        removeToast
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 max-w-md">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { message, type } = toast;

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-800',
            iconColor: 'text-emerald-600',
            iconBgColor: 'bg-emerald-100'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-800',
            iconColor: 'text-amber-600',
            iconBgColor: 'bg-amber-100'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor, iconBgColor } = config[type];

    return (
        <div className={`${bgColor} ${borderColor} border-2 rounded-xl shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right duration-300`}>
            <div className={`${iconBgColor} p-2 rounded-lg`}>
                <Icon size={20} className={iconColor} />
            </div>
            <div className="flex-1">
                <p className={`${textColor} text-sm font-medium leading-relaxed`}>{message}</p>
            </div>
            <button
                onClick={onClose}
                className={`${textColor} hover:opacity-70 transition-opacity p-1`}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default ToastProvider;
