import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SORTopBar from './components/SORTopBar';
import SORAuditPanel from './components/SORAuditPanel';
import SORFooter from './components/SORFooter';
import SORTabs from './components/SORTabs';
import SORFlowchart from './components/SORFlowchart';
import { sorRecords, emptySorData } from '../../../mocks/sorData';

const SORWorkspace = () => {
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAuditPanelOpen, setIsAuditPanelOpen] = useState(false);

    // Loaded Record Logic
    // State for Form Data (Lifted Up)
    const [formData, setFormData] = useState({
        sorNumber: '',
        vendor: '',
        documentNumber: 'LBD-MKTGSOR-PC',
        companyName: '',
        enquirerName: '',
        contactInfo: '',
        natureOfCompany: '',
        keyAccountManager: '',
        technicalEngineer: '',
        vehicleType: '2W',
        chargerRatingV: 0,
        chargerRatingW: 0,
    });
    const [specifications, setSpecifications] = useState([
        { id: 1, specification: '', customerRequirement: '', compliance: 'Yes', remarks: '' }
    ]);

    // Data Loading Logic
    const [record, setRecord] = useState(null);

    useEffect(() => {
        if (id) {
            const found = sorRecords.find(r => r.id === id);

            if (found) {
                // Map complex mock data to flat form structure
                const mappedData = {
                    ...emptySorData,
                    id: found.id,
                    status: found.status,
                    progress: 50, // Mock progress
                    date: found.companyDetails?.find(x => x.key === 'date')?.value || new Date().toLocaleDateString(),
                };
                setRecord(mappedData);

                // Populate Form State
                setFormData({
                    sorNumber: found.id,
                    vendor: found.vendor,
                    documentNumber: found.companyDetails?.find(x => x.key === 'docNo')?.value || '',
                    companyName: found.companyDetails?.find(x => x.key === 'companyName')?.value || '',
                    enquirerName: found.companyDetails?.find(x => x.key === 'enquirer')?.value || '',
                    contactInfo: found.companyDetails?.find(x => x.key === 'contact')?.value || '',
                    natureOfCompany: found.companyDetails?.find(x => x.key === 'nature')?.value || '',
                    keyAccountManager: found.companyDetails?.find(x => x.key === 'kam')?.value || '',
                    technicalEngineer: '', // Not in mock
                    vehicleType: '2W', // Default
                    chargerRatingV: 0,
                    chargerRatingW: 0
                });

                // Map specs if available (mock structure differs slightly)
                if (found.technicalSpecs && found.technicalSpecs.length > 0) {
                    setSpecifications(found.technicalSpecs.map(s => ({
                        id: s.id,
                        specification: s.param,
                        customerRequirement: s.standard,
                        compliance: 'Yes', // Default
                        remarks: s.remarks || ''
                    })));
                }

            } else {
                setRecord({ ...emptySorData, id: id, title: 'New SOR', status: 'Draft' });
            }
        } else {
            setRecord({ ...emptySorData, id: 'New', title: 'Start New SOR', status: 'Draft' });
        }
    }, [id]);

    // Enhance record object to pass down props
    const extendedRecord = record ? {
        ...record,
        formData,
        setFormData,
        specifications,
        setSpecifications
    } : null;


    const toggleEditMode = () => setIsEditMode(!isEditMode);
    const toggleAuditPanel = () => setIsAuditPanelOpen(!isAuditPanelOpen);

    // Fallback if record isn't loaded yet
    if (!extendedRecord) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar is handled by DashboardLayout */}

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Top Bar */}
                {/* Top Bar */}
                <SORTopBar
                    record={extendedRecord}
                    isEditMode={isEditMode}
                    toggleEditMode={toggleEditMode}
                    toggleAuditPanel={toggleAuditPanel}
                />

                <div className="flex flex-1 overflow-hidden relative">
                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                        <div className="max-w-7xl mx-auto space-y-6">

                            {/* Flowchart Visualization */}
                            <SORFlowchart status={record.status} />

                            {/* Main Content: Form */}
                            <SORTabs id={id} record={extendedRecord} isEditMode={isEditMode} />

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
