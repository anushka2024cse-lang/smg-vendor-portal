import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, User as UserIcon, LogOut, Settings, ChevronDown, Search, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // User State
    const [user, setUser] = useState(authService.getCurrentUser() || { name: 'User', role: 'User' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Welcome Message State
    const [showWelcome, setShowWelcome] = useState(true);

    // Time State
    const [currentTime, setCurrentTime] = useState(new Date());

    const menuRef = useRef(null);

    // Initial Load Logic
    useEffect(() => {
        // Fade out welcome message after 5 seconds
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 5000);

        // Update Time every second
        const clock = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearTimeout(timer);
            clearInterval(clock);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    // Helper to format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper to format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Determine Page Title based on Path (Simple Map or Switch)
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'Dashboard';
        if (path.includes('/po/create')) return 'Create Purchase Order';
        if (path.includes('/po/list')) return 'Purchase Orders';
        if (path.includes('/vendor/list')) return 'Vendors';
        if (path.includes('/inventory')) return 'Inventory';
        if (path.includes('/admin')) return 'Administration';
        if (path.includes('/settings')) return 'Settings';
        return 'Overview';
    };

    return (
        <div className="flex flex-col bg-white z-30 relative shadow-sm">

            {/* ROW 1: Top Navigation Bar */}
            <div className="h-16 px-8 flex items-center justify-between border-b border-slate-100">
                {/* Left: Spacer or Logo if needed (keeping empty as sidebar has logo) */}
                <div className="w-64 hidden lg:block"></div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-2xl px-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-slate-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                        />
                        <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-6">

                    {/* Time Display (Moved to Top Bar) */}
                    <div className="text-right hidden md:block">
                        <div className="text-lg font-bold text-slate-700 leading-none">{formatTime(currentTime)}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{formatDate(currentTime)}</div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                            <Mail size={20} />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    {/* Profile */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 transition-colors rounded-full hover:bg-slate-50 p-1 pr-2"
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                    <UserIcon size={20} />
                                </div>
                            )}
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                    <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</p>
                                </div>
                                <button
                                    onClick={() => { navigate('/settings?tab=profile'); setIsMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <UserIcon size={16} /> Profile
                                </button>
                                <button
                                    onClick={() => { navigate('/settings?tab=notifications'); setIsMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Settings size={16} /> Settings
                                </button>
                                <div className="my-2 border-t border-slate-100"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2 Removed as per user request to move title to page content */}
        </div>
    );
};

export default Header;
