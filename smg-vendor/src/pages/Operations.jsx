import React, { useState } from 'react';
import ProductionSchedule from '../components/operations/ProductionSchedule';
import StoreDetails from '../components/operations/StoreDetails';
import Reports from '../components/operations/Reports';
import { Calendar, Package, FileText } from 'lucide-react';

const Operations = () => {
    const [activeTab, setActiveTab] = useState('schedule');

    const tabs = [
        { id: 'schedule', label: 'Production Schedule', icon: Calendar },
        { id: 'store', label: 'Store Details', icon: Package },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1B365D]">Operations</h1>
                    <p className="text-gray-500">Manage production, inventory, and reports</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-[#1B365D] text-[#1B365D]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <tab.icon
                                className={`
                                    -ml-0.5 mr-2 h-5 w-5
                                    ${activeTab === tab.id ? 'text-[#1B365D]' : 'text-gray-400 group-hover:text-gray-500'}
                                `}
                            />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'schedule' && <ProductionSchedule />}
                {activeTab === 'store' && <StoreDetails />}
                {activeTab === 'reports' && <Reports />}
            </div>
        </div>
    );
};

export default Operations;
