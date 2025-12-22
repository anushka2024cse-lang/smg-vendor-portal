import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, MessageSquare, Search, Eye, Trash2, X, ChevronDown } from 'lucide-react';

const AdminTickets = () => {
    // Mock data matching the screenshot exactly, now with 'message'
    const [tickets, setTickets] = useState([
        {
            id: 1,
            status: 'New',
            subject: 'Billing Inquiry',
            fromName: 'Virendra Singh',
            fromEmail: 'deep_1935@yahoo.co.in',
            date: 'Nov 26, 2025, 3:23:56 AM',
            message: 'CLER MY PENDINGS'
        },
        {
            id: 2,
            status: 'Resolved',
            subject: 'Billing Inquiry',
            fromName: 'Virendra Singh',
            fromEmail: 'deep_1935@yahoo.co.in',
            date: 'Nov 10, 2025, 3:41:52 PM',
            message: 'Previous billing issue regarding invoice #4022.'
        }
    ]);

    const [activeActionId, setActiveActionId] = useState(null);
    const [viewModalTicket, setViewModalTicket] = useState(null);
    const actionMenuRef = useRef(null);

    // Close action menu when clicking outside
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

    const handleViewClick = (ticket) => {
        setViewModalTicket({ ...ticket });
        setActiveActionId(null);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            setTickets(tickets.filter(t => t.id !== id));
        }
        setActiveActionId(null);
    };

    const handleStatusChange = (newStatus) => {
        setViewModalTicket(prev => ({ ...prev, status: newStatus }));
    };

    const handleSaveStatus = () => {
        setTickets(tickets.map(t => t.id === viewModalTicket.id ? viewModalTicket : t));
        setViewModalTicket(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <MessageSquare className="text-blue-600" size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Admin Dashboard</p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Incoming Support Requests</h2>
                    <p className="text-sm text-slate-500">View and manage all support tickets submitted by users.</p>
                </div>

                <div className="overflow-visible">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Subject</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">From</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Date Submitted</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group relative">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ticket.status === 'New'
                                            ? 'bg-red-50 text-red-700 border-red-200'
                                            : ticket.status === 'Resolved'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{ticket.subject}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">{ticket.fromName}</span>
                                            <span className="text-slate-500 text-xs">{ticket.fromEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{ticket.date}</td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => toggleActions(ticket.id, e)}
                                            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeActionId === ticket.id && (
                                            <div
                                                ref={actionMenuRef}
                                                className="absolute right-8 top-8 w-36 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => handleViewClick(ticket)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                                                >
                                                    <Eye size={14} />
                                                    View & Reply
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(ticket.id)}
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

            {/* View/Reply Modal */}
            {viewModalTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 pb-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-1">{viewModalTicket.subject}</h2>
                                <p className="text-sm text-slate-500">From: {viewModalTicket.fromName} ({viewModalTicket.fromEmail})</p>
                            </div>
                            <button
                                onClick={() => setViewModalTicket(null)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                                <p className="text-slate-700 text-sm font-medium">{viewModalTicket.message}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-slate-700">Status:</span>
                                <div className="relative inline-block w-40">
                                    <select
                                        value={viewModalTicket.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className={`w-full appearance-none px-4 py-2 pr-8 rounded-lg text-sm font-bold focus:outline-none cursor-pointer border ${viewModalTicket.status === 'New' ? 'bg-red-50 text-red-700 border-red-200' :
                                            viewModalTicket.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                viewModalTicket.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}
                                    >
                                        <option value="New" className="bg-white text-slate-900">New</option>
                                        <option value="In Progress" className="bg-white text-slate-900">In Progress</option>
                                        <option value="Resolved" className="bg-white text-slate-900">Resolved</option>
                                        <option value="Closed" className="bg-white text-slate-900">Closed</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleSaveStatus}
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTickets;
