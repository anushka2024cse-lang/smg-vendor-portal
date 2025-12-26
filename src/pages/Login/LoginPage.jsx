import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Key, ShieldCheck, Moon, Sun } from 'lucide-react';

import { authService } from '../../services/authService';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('user'); // 'user' | 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUserLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await authService.login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!adminKey) {
            setError('Please enter the admin key.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Call backend API for admin authentication
            const response = await authService.adminLogin(adminKey);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Access Denied. Invalid Sentinel Key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Tab Switcher */}
                <div className="flex mb-6 bg-[#1e293b] p-1 rounded-xl border border-slate-700/50">
                    <button
                        onClick={() => { setActiveTab('user'); setError(''); }}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'user'
                            ? 'bg-[#334155] text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        User Login
                    </button>
                    <button
                        onClick={() => { setActiveTab('admin'); setError(''); }}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'admin'
                            ? 'bg-[#334155] text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Super Admin
                    </button>
                </div>

                {/* Card */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden relative">

                    {/* Decorative Top Line */}
                    <div className={`h-1 w-full ${activeTab === 'user' ? 'bg-blue-500' : 'bg-emerald-500'} transition-colors duration-300`} />

                    <div className="p-8">
                        {/* Header Icon */}
                        <div className="flex justify-center mb-6">
                            <div className={`p-4 rounded-full ${activeTab === 'user' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {activeTab === 'user' ? <User size={32} /> : <Key size={32} />}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">
                                {activeTab === 'user' ? 'User Portal' : 'Sentinel Access'}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {activeTab === 'user' ? 'Sign in to access your dashboard.' : 'Super Admin Authentication Required'}
                            </p>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                <ShieldCheck size={16} />
                                {error}
                            </div>
                        )}

                        {/* USER FORM */}
                        {activeTab === 'user' && (
                            <form onSubmit={handleUserLogin} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-3 rounded-lg transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">→</span> Login
                                </button>
                            </form>
                        )}

                        {/* ADMIN FORM */}
                        {activeTab === 'admin' && (
                            <form onSubmit={handleAdminLogin} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-emerald-500/80 uppercase tracking-wider mb-2">Super Admin Key</label>
                                    <input
                                        type="password"
                                        value={adminKey}
                                        onChange={(e) => setAdminKey(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 font-mono tracking-widest"
                                        placeholder="ENTER-KEY"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck size={18} /> Secure Login
                                </button>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                            <span className="text-slate-500 text-xs uppercase tracking-widest">OR</span>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="mt-4 w-full py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <User size={14} /> Continue as Guest
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
