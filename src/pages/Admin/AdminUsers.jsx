import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Plus, Search, Filter, Edit, Printer, Trash2, X, Check, ChevronDown, ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [activeActionId, setActiveActionId] = useState(null);
    const [editModalUser, setEditModalUser] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false); // State for Create User Modal
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User', password: '' });
    const actionMenuRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActiveActionId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleActions = (id, e) => {
        e.stopPropagation();
        setActiveActionId(activeActionId === id ? null : id);
    };

    const handleEditClick = (user) => {
        setEditModalUser({ ...user });
        setActiveActionId(null);
    };

    const handlePrintClick = (user) => {
        setActiveActionId(null);
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>User Profile Details</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; }
                        h1 { font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; width: 150px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <h1>User Profile Details</h1>
                    <div class="field"><span class="label">Full Name:</span> ${user.name}</div>
                    <div class="field"><span class="label">Email:</span> ${user.email}</div>
                    <div class="field"><span class="label">Role:</span> ${user.role}</div>
                    <div class="field"><span class="label">User ID:</span> ${user.id}</div>
                    <script>
                        window.print();
                        window.onafterprint = window.close;
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDeleteClick = (user) => {
        setActiveActionId(null);
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            setUsers(users.filter(u => u.id !== user.id));
        }
    };

    const handleSaveEdit = () => {
        if (!editModalUser) return;
        setUsers(users.map(u => u.id === editModalUser.id ? editModalUser : u));
        setEditModalUser(null);
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const createdUser = await adminService.createUser(newUser);
            setUsers([...users, createdUser]);
            setCreateModalOpen(false);
            setNewUser({ name: '', email: '', role: 'User', password: '' });
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create user");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm text-slate-500 font-medium">User Management</p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Users</h1>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg text-sm"
                >
                    <Plus size={18} />
                    <span>Create User</span>
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">All Users</h2>
                        <p className="text-sm text-slate-500">A list of all users in the system. You must be a Super Admin to manage users.</p>
                    </div>
                </div>

                <div className="overflow-visible">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user, index) => (
                                <tr key={user.id || index} className="hover:bg-slate-50 transition-colors group relative">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 text-base mb-0.5">{user.name}</span>
                                            <span className="text-slate-500 text-xs">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'Super Admin'
                                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                                            : 'bg-white text-slate-600 border-slate-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => toggleActions(user.id, e)}
                                            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {activeActionId === user.id && (
                                            <div
                                                ref={actionMenuRef}
                                                className="absolute right-8 top-8 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handlePrintClick(user)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                                                >
                                                    <Printer size={14} />
                                                    Print
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
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

            {/* Create User Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <h2 className="text-xl font-bold text-slate-900">Create New User</h2>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium"
                                        placeholder="e.g. john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium"
                                        placeholder="Enter secure password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                                    <div className="relative">
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 cursor-pointer font-medium"
                                        >
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateUser}
                                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
                                >
                                    Create User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                            <button
                                onClick={() => setEditModalUser(null)}
                                className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <h2 className="text-xl font-bold text-slate-900">Edit User: {editModalUser.name}</h2>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">User Details</h3>
                            <p className="text-sm text-slate-500 mb-8">Update the user's name and role. The email address cannot be changed.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={editModalUser.name}
                                        onChange={(e) => setEditModalUser({ ...editModalUser, name: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="text"
                                        value={editModalUser.email}
                                        readOnly
                                        disabled
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                                    <div className="relative">
                                        <select
                                            value={editModalUser.role}
                                            onChange={(e) => setEditModalUser({ ...editModalUser, role: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 cursor-pointer font-medium"
                                        >
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleSaveEdit}
                                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
