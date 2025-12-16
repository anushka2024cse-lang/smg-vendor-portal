import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    LayoutDashboard,
    UserCheck,
    Palmtree,
    HandCoins,
    FileQuestion,
    IdCard,
    GraduationCap,
    Utensils,
    Sparkles,
    Frown,
    FileText,
    Building2,
    User,
    ShieldCheck,
    LogOut,
    Factory
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ShieldCheck, label: 'Warranty', path: '/warranty-claim' },
        { icon: UserCheck, label: 'Attendance' },
        { icon: Palmtree, label: 'Leaves' },
        { icon: HandCoins, label: 'Salary' },
        { icon: FileQuestion, label: 'My request', path: '/requests' },
        { icon: IdCard, label: 'My documents' },
        { icon: GraduationCap, label: 'Training' },
        { icon: Utensils, label: 'Canteen' },
        { icon: Sparkles, label: 'SMG Imagine' },
        { icon: Frown, label: 'Grievance Redressal' },
        { icon: FileText, label: 'Policies' },
        { icon: Building2, label: 'Facilities' },
        { icon: User, label: 'Profile' },
        { icon: Factory, label: 'Operations', path: '/operations' },
    ];

    return (
        <div className="w-64 h-full bg-[#1B365D] text-white flex flex-col font-sans overflow-y-auto">
            {/* Back Button */}
            <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium text-sm">Back</span>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-2">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => item.path && navigate(item.path)}
                        className="px-6 py-3 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors group"
                    >
                        <item.icon
                            size={20}
                            className="text-white/80 group-hover:text-white stroke-[1.5px]"
                        />
                        <span className="text-[15px] font-normal text-white/90 group-hover:text-white">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className="p-4 mt-auto border-t border-white/10">
                <div className="px-2 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors rounded-lg">
                    <LogOut size={20} className="text-white/80 stroke-[1.5px]" />
                    <span className="text-[15px] font-medium">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
