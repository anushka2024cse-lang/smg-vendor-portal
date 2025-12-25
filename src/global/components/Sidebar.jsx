import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    FileText,
    ClipboardList,
    Wrench,
    Factory,
    BarChart2,
    Settings,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Truck,
    ShieldCheck,
    Briefcase,
    Bell,
    UserCircle,
    CreditCard,
    Award,
    AlertTriangle,
    Layers
} from 'lucide-react';
import logo from '../../asset/logo/Logo.jpg';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    // Role State (In a real app, this comes from AuthContext)
    // Defaulting to 'vendorManager' as that is the primary focus of recent tasks
    const [currentRole, setCurrentRole] = useState('vendorManager');

    const userProfile = {
        name: currentRole === 'admin' ? 'Super Admin' : 'Rahul V.',
        role: currentRole === 'admin' ? 'System Administrator' : 'Vendor Manager',
        email: currentRole === 'admin' ? 'admin@smg.com' : 'rahul@smg.com'
    };

    // Collapsible State
    const [expanded, setExpanded] = useState({
        vendor: true,
        procure: true,
        requests: false,
        ops: false,
        admin: true
    });

    const toggleSection = (section) => {
        setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleRole = () => {
        const newRole = currentRole === 'admin' ? 'vendorManager' : 'admin';
        setCurrentRole(newRole);
        // Redirect to appropriate dashboard if needed, or just stay on current path if shared
        if (newRole === 'admin') navigate('/admin/users');
        else navigate('/dashboard/home');
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ icon: Icon, label, path }) => (
        <button
            onClick={() => {
                navigate(path);
                if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-sm transition-all duration-200 group ${isActive(path)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} strokeWidth={2} className={isActive(path) ? 'text-white' : 'group-hover:text-blue-200 transition-colors'} />
                <span className="font-medium">{label}</span>
            </div>
        </button>
    );

    const CollapsibleSection = ({ icon: Icon, label, id, children }) => (
        <div className="pt-2">
            <button
                onClick={() => toggleSection(id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${expanded[id] ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={2} className={expanded[id] ? 'text-blue-400' : ''} />
                    <span className="font-semibold">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ChevronDown size={14} className={`transform transition-transform duration-200 ${expanded[id] ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {expanded[id] && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-slate-800 ml-4 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#213763] text-white rounded-md shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#213763] text-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>

                {/* Logo Area */}
                <div className="h-16 w-full bg-[#ffffff] border-b border-white/10 relative">
                    <img src={logo} alt="SMG Logo" className="w-full h-full object-contain" />
                    {/* <div className="absolute bottom-1 right-2 bg-black/50 text-xs px-2 py-0.5 rounded text-white/80">
                        {currentRole === 'admin' ? 'ADMIN' : 'VENDOR MGR'}
                    </div> */}
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">

                    <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />

                    {/* === VENDOR PORTAL MODULES === */}
                    <div className="space-y-1 mt-2">
                        <NavItem icon={Users} label="Vendors" path="/vendor/list" />
                        <NavItem icon={FileText} label="Purchase Orders" path="/po/list" />
                        <NavItem icon={CreditCard} label="Payments" path="/payments" />
                        <NavItem icon={Package} label="Components" path="/component-details" />
                        <NavItem icon={ClipboardList} label="SOR" path="/sor/list" />
                        <NavItem icon={ShieldCheck} label="Warranty Claims" path="/warranty-claims" />
                        <NavItem icon={Award} label="Certificates" path="/certificates" />
                        <NavItem icon={Wrench} label="Spare Part Requests" path="/requests/spare-parts" />
                        <NavItem icon={Truck} label="HSRP Requests" path="/requests/hsrp" />
                        <NavItem icon={AlertTriangle} label="RSA Requests" path="/requests/rsa" />
                        <NavItem icon={Factory} label="Production" path="/production" />
                        <NavItem icon={Layers} label="Die Plan" path="/production/die-plan" />
                        <NavItem icon={Layers} label="Store & Bins" path="/inventory" />

                        <div className="my-2 border-t border-white/10"></div>

                        <NavItem icon={Settings} label="Settings" path="/settings" />
                    </div>

                    {/* === ADMIN PORTAL MODULES (Moved after Settings) === */}
                    <div className="mt-6 mb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">System Administration</div>
                    <CollapsibleSection icon={Users} label="User Management" id="admin-users">
                        <NavItem icon={Users} label="All Users" path="/admin/users" />
                        <NavItem icon={ShieldCheck} label="Access Roles" path="/admin/users" />
                    </CollapsibleSection>

                    <CollapsibleSection icon={Settings} label="System Config" id="admin-config">
                        <NavItem icon={Settings} label="General Settings" path="/admin/settings" />
                        <NavItem icon={MessageSquare} label="Support Tickets" path="/admin/tickets" />
                        <NavItem icon={BarChart2} label="Audit Logs" path="/admin/settings" />
                    </CollapsibleSection>

                </div>

                {/* Footer / User Profile Removed */}
                {/* <div className="p-4 border-t border-white/10 bg-[#213763]">...</div> */}
            </div>
        </>
    );
};

export default Sidebar;
