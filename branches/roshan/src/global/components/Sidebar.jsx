import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    LayoutDashboard,
    Box,
    ClipboardList,
    Layers,
    Users,
    Factory,
    TrendingUp,
    Download,
    Truck,
    Globe,
    Shield,
    HelpCircle,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    MessageSquare,
    Settings,
    Wrench,
    ArchiveRestore,
    UserCog,
    Package, // Added for new menuItems
    BarChart2 // Added for new menuItems
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [adminOpen, setAdminOpen] = useState(false); // Default collapsed as requested

    const menuItems = [
        { icon: Home, label: 'Home', path: '/dashboard/home' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/dashboard' },
        { icon: Wrench, label: 'Models', path: '/models' },
        { icon: Package, label: 'Inventory', path: '/inventory' },
        { icon: ClipboardList, label: 'Component Details', path: '/component-details' },
        { icon: ArchiveRestore, label: 'Vendor Details', path: '/vendor-details' },
        { icon: Layers, label: 'Production', path: '/production' },
        { icon: BarChart2, label: 'Forecasting', path: '/forecasting' },
        { icon: Truck, label: 'Receive', path: '/receive' },
        { icon: Truck, label: 'Dispatch', path: '/dispatch' }, // Use Truck generic for now
        { icon: UserCog, label: 'Vendor Portal', path: '/vendor-portal' },
    ];

    const adminItems = [
        { icon: UserCog, label: 'All Users', path: '/admin/users' },
        { icon: MessageSquare, label: 'Support Tickets', path: '/admin/tickets' },
        { icon: Settings, label: 'Admin Settings', path: '/admin/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar text-sidebar-foreground rounded-md border border-sidebar-border"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col border-r border-sidebar-border`}>

                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar">
                    <span className="text-xl font-bold text-sidebar-foreground tracking-wide">SMG-MMP</span>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.1 custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                navigate(item.path);
                                if (window.innerWidth < 1024) setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${isActive(item.path)
                                ? item.label === 'Models'
                                    ? 'bg-blue-900/20 text-blue-400 border border-blue-900/30'
                                    : 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                }`}
                        >
                            <item.icon size={18} strokeWidth={2} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}

                    {/* Collapsible Admin Section */}
                    <div className="pt-2">
                        <button
                            onClick={() => setAdminOpen(!adminOpen)}
                            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <UserCog size={18} strokeWidth={2} />
                                <span className="font-medium">Admin</span>
                            </div>
                            <span className={`transform transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={14} />
                            </span>
                        </button>

                        {adminOpen && (
                            <div className="mt-1 space-y-0.1 animate-in slide-in-from-top-2 duration-200">
                                {adminItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => {
                                            navigate(item.path);
                                            if (window.innerWidth < 1024) setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 pl-9 rounded-lg text-sm transition-all duration-200 ${isActive(item.path)
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Support */}
                    <div
                        onClick={() => navigate('/support')}
                        className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer rounded-md transition-all duration-200 group ${location.pathname === '/support' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                    >
                        <HelpCircle size={18} className="text-sidebar-foreground group-hover:text-sidebar-accent-foreground opacity-70 group-hover:opacity-100" />
                        <span className="text-sm">Support</span>
                    </div>
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-sidebar-border bg-sidebar">
                    <div className="flex items-center gap-3 px-4 py-2 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground cursor-pointer transition-colors hover:bg-sidebar-accent rounded-md">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
