import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';

const mockSchedule = [
    { id: 'JOB-2024-001', product: 'Control Panel A1', status: 'In Progress', startTime: '08:00 AM', endTime: '12:00 PM', progress: 65 },
    { id: 'JOB-2024-002', product: 'Wiring Harness B2', status: 'Pending', startTime: '01:00 PM', endTime: '04:00 PM', progress: 0 },
    { id: 'JOB-2024-003', product: 'Sensor Module X9', status: 'Completed', startTime: 'Yesterday', endTime: 'Yesterday', progress: 100 },
    { id: 'JOB-2024-004', product: 'Display Unit D4', status: 'Delayed', startTime: '09:00 AM', endTime: '02:00 PM', progress: 30 },
    { id: 'JOB-2024-005', product: 'Power Supply P5', status: 'In Progress', startTime: '10:30 AM', endTime: '03:30 PM', progress: 45 },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
        case 'Pending': return 'text-gray-600 bg-gray-50 border-gray-200';
        case 'Delayed': return 'text-red-600 bg-red-50 border-red-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'In Progress': return <PlayCircle size={16} />;
        case 'Completed': return <CheckCircle size={16} />;
        case 'Pending': return <Clock size={16} />;
        case 'Delayed': return <AlertCircle size={16} />;
        default: return <Clock size={16} />;
    }
}

const ProductionSchedule = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-[#1B365D] flex items-center gap-2">
                        <Calendar className="text-[#1B365D]" size={24} />
                        Production Schedule
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and track production jobs</p>
                </div>
                <button className="px-4 py-2 bg-[#1B365D] text-white rounded-lg text-sm font-medium hover:bg-[#152a48] transition-colors">
                    + New Job
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Job ID</th>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Timeline</th>
                            <th className="px-6 py-4">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockSchedule.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-[#1B365D]">{job.id}</td>
                                <td className="px-6 py-4 text-gray-700">{job.product}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(job.status)}`}>
                                        {getStatusIcon(job.status)}
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        <span>Start: {job.startTime}</span>
                                        <span>End: {job.endTime}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${job.status === 'Completed' ? 'bg-green-500' : 'bg-[#1B365D]'}`}
                                            style={{ width: `${job.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">{job.progress}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductionSchedule;
