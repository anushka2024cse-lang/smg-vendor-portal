import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, MoreHorizontal, Edit, Trash2, Check, ChevronDown } from 'lucide-react';
import { adminService } from '../../services/adminService';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [profile, setProfile] = useState({ name: '', email: '', role: '' });

    // Form State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User'
    });

    // Dropdown States
    const [activeActionId, setActiveActionId] = useState(null);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const actionMenuRef = useRef(null);
    const roleDropdownRef = useRef(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [usersData, profileData] = await Promise.all([
                    adminService.getAllUsers(),
                    adminService.getCurrentUser()
                ]);
                setUsers(usersData);
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            }
        };
        fetchAdminData();
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActiveActionId(null);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
                setIsRoleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const createdUser = await adminService.createUser({
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            });

            setUsers([...users, createdUser]);
            setNewUser({
                name: '',
                email: '',
                password: '',
                role: 'User'
            });
            alert("User created successfully!");
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create user.");
        }
    };

    const toggleActions = (id, e) => {
        e.stopPropagation();
        setActiveActionId(activeActionId === id ? null : id);
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
        setActiveActionId(null);
    };

    const selectRole = (role) => {
        setNewUser({ ...newUser, role });
        setIsRoleDropdownOpen(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome back, {profile.name}! 👋</h1>
                <p className="text-sm text-slate-500">Here's your user management and settings dashboard.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Your Profile */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Your Profile</h2>
                    <p className="text-sm text-slate-500 mb-6">Manage your personal account details.</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input type="text" value={profile.name} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                            <input type="text" value={profile.email} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none font-medium" />
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex gap-3">
                        <AlertTriangle className="text-red-500 shrink-0" size={20} />
                        <div>
                            <h4 className="text-sm font-bold text-red-700 mb-1">Super Admin Account</h4>
                            <p className="text-xs text-red-600/80 leading-relaxed">For security reasons, the super admin's profile cannot be modified from this dashboard.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            Change Password
                        </button>
                        <button className="bg-slate-100 text-slate-400 cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Existing Users */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Existing Users</h2>
                        <p className="text-sm text-slate-500">A list of all users in the system.</p>
                    </div>

                    <div className="overflow-visible flex-1 custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 font-semibold tracking-wider">Name</th>
                                    <th className="px-6 py-3 font-semibold tracking-wider">Email</th>
                                    <th className="px-6 py-3 font-semibold tracking-wider">Role</th>
                                    <th className="px-6 py-3 font-semibold tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user, index) => (
                                    <tr key={user.id || index} className="hover:bg-slate-50 transition-colors group relative">
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${user.role === 'Super Admin'
                                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                                : 'bg-white text-slate-600 border-slate-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => toggleActions(user.id, e)}
                                                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {activeActionId === user.id && (
                                                <div
                                                    ref={actionMenuRef}
                                                    className="absolute right-8 top-8 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={() => alert(`Edit ${user.name}`)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create New User */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Create New User</h2>
                <p className="text-sm text-slate-500 mb-6">Fill out the form to add a new user to the system. This action might require re-authentication.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Alex Smith"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            placeholder="e.g. alex@example.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium shadow-sm"
                        />
                    </div>
                    <div ref={roleDropdownRef} className="relative">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Role</label>
                        <button
                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none hover:border-slate-300 transition-colors shadow-sm font-medium"
                        >
                            <span className="text-sm">{newUser.role}</span>
                            <ChevronDown size={16} className={`text-slate-500 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRoleDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {['User', 'Admin', 'Super Admin'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => selectRole(role)}
                                        className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${newUser.role === role
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{role}</span>
                                        {newUser.role === role && <Check size={16} className="text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCreateUser}
                        className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
                    >
                        Create User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Admin;
