import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SORTopBar from './components/SORTopBar';
import SORStats from './components/SORStats';
import SORAuditPanel from './components/SORAuditPanel';
import SORFooter from './components/SORFooter';
import SORTabs from './components/SORTabs';
import { sorRecords, emptySorData } from '../../../mocks/sorData';

const SORWorkspace = () => {
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAuditPanelOpen, setIsAuditPanelOpen] = useState(false);

    // Loaded Record Logic
    const [record, setRecord] = useState(null);

    useEffect(() => {
        if (id) {
            const foundStats = sorRecords.find(r => r.id === id);
            setRecord(foundStats || { ...emptySorData, id: id, title: 'New SOR', status: 'Draft' });
        } else {
            setRecord({ ...emptySorData, id: 'New', title: 'Start New SOR', status: 'Draft' });
        }
    }, [id]);


    const toggleEditMode = () => setIsEditMode(!isEditMode);
    const toggleAuditPanel = () => setIsAuditPanelOpen(!isAuditPanelOpen);

    // Fallback if record isn't loaded yet
    if (!record) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar is handled by DashboardLayout */}

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Top Bar */}
                <SORTopBar
                    record={record}
                    isEditMode={isEditMode}
                    toggleEditMode={toggleEditMode}
                    toggleAuditPanel={toggleAuditPanel}
                />

                <div className="flex flex-1 overflow-hidden relative">
                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                        <div className="max-w-7xl mx-auto space-y-6">

                            {/* Header Stats */}
                            <SORStats stats={{
                                ...record,
                                lastAudit: "24h ago",
                                dataIntegrity: 98.4
                            }} />

                            {/* Main Content: Tabs (Specification, Docs, History) */}
                            {/* The 'Overview' tab inside here contains the SORForm */}
                            <SORTabs id={id} record={record} isEditMode={isEditMode} />

                        </div>
                    </main>

                    {/* Audit Trail Panel */}
                    <SORAuditPanel isOpen={isAuditPanelOpen} onClose={() => setIsAuditPanelOpen(false)} />
                </div>

                {/* Sticky Footer */}
                {isEditMode && <SORFooter />}
            </div>
        </div>
    );
};

export default SORWorkspace;
