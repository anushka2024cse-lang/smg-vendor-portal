import React, { useState, useEffect } from 'react';
import {
    Save, Printer, ArrowLeft, FileText, Layout, Plus, Trash2
} from 'lucide-react';
import { diePlanService } from '../../services/diePlanService';

// Reusable Components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-none border border-slate-300 shadow-sm overflow-hidden ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-800 border-blue-200",
        green: "bg-green-100 text-green-800 border-green-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
        purple: "bg-purple-100 text-purple-800 border-purple-200",
        slate: "bg-slate-100 text-slate-800 border-slate-200"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[color] || colors.slate}`}>
            {children}
        </span>
    );
};

const EditableCell = ({ value, onChange, disabled, type = "text", className = "" }) => {
    if (disabled) {
        return <div className={`py-1 px-1 min-h-[24px] text-xs ${className}`}>{value}</div>;
    }
    return (
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 focus:bg-blue-50 outline-none py-1 px-1 text-xs font-medium text-slate-700 ${className}`}
        />
    );
};

/* Moved components outside to prevent remounting on render */
const TabButton = ({ id, label, icon: Icon, activeTab, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all relative border-r border-slate-200
            ${activeTab === id
                ? 'bg-white text-blue-700 shadow-[inset_0_2px_0_0_#2563eb]'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const TableHeader = ({ children, className = "" }) => (
    <th className={`px-2 py-1 text-center text-[10px] font-bold text-slate-700 uppercase tracking-tight bg-blue-100 border border-slate-400 ${className}`}>
        {children}
    </th>
);

const TableCell = ({ children, className = "" }) => (
    <td className={`border border-slate-300 p-0 hover:bg-blue-50/20 ${className}`}>
        {children}
    </td>
);

const DiePlanSheet = ({ mode = 'view', plan = null, onBack }) => {
    const [activeTab, setActiveTab] = useState('DDRN');
    const [ddrnData, setDdrnData] = useState([]);
    const [diePlanData, setDiePlanData] = useState([]);
    const [headerInfo, setHeaderInfo] = useState({
        code: '-', revStatus: '-', revDate: '-', ddrnNo: '', date: '',
        projectAssembly: '', trialNo: '', remarks: ''
    });
    const [costData, setCostData] = useState(Array(10).fill({ dm: '', nav: '' }));
    const [isSaving, setIsSaving] = useState(false);

    // Always allow editing
    const isEditing = true;


    useEffect(() => {
        if (plan) {
            // Populate DDRN Data
            setDdrnData([{
                srNo: 1,
                supplier: plan.vendor || '',
                ecn: plan.ecn || '',
                tdpNo: plan.id,
                tdpDesignDate: plan.startDate ? plan.startDate.split('T')[0] : '',
                tdpMfgDate: plan.targetDate ? plan.targetDate.split('T')[0] : '',
                toolDesc: `Tool for ${plan.partName}`,
                toolNo: plan.toolNo || '',
                mod: plan.mod || '',
                compName: plan.partName,
                compNo: plan.compNo || '',
                bom: plan.bom || '',
                designer: 'Admin',
                checkedBy: ''
            }]);

            // Populate Die Plan Master Data
            setDiePlanData([{
                srNo: 1,
                customer: 'SMG',
                mfgSource: plan.vendor || '',
                tdpNo: plan.id,
                projectCode: plan.projectCode || '',
                ddrnNo: `DDRN-${plan.id ? plan.id.slice(-4) : '000'}`,
                ddrnDate: plan.createdAt?.split('T')[0],
                eca: '',
                project: plan.partName,
                modeOfWork: 'External',
                toolDrgNo: '',
                toolDesc: `Tool for ${plan.partName}`,
                compDrgNo: '',
                compDesc: plan.partName,
                matCost: plan.matCost || '',
                toolCost: plan.toolCost || '',
                ddrnSrNo: '1',
                status: plan.status || 'Planned',
                ddrnRecMonth: '',
                ddrnRecDate: '',
                finYear: '2025-26',
                completionMonth: '',
                designer: 'Admin',
                remarks: plan.stage
            }]);

            setHeaderInfo({
                ...headerInfo,
                ddrnNo: `DDRN-${plan.id ? plan.id.slice(-4) : '000'}`,
                date: new Date().toISOString().split('T')[0]
            })
        } else {
            // Create Mode - Initialize 10 empty rows for Excel feel
            setDdrnData(Array(15).fill({
                srNo: '', supplier: '', ecn: '', tdpNo: '', tdpDesignDate: '',
                tdpMfgDate: '', toolDesc: '', toolNo: '', mod: '',
                compName: '', compNo: '', bom: '', designer: '', checkedBy: ''
            }));
            setDiePlanData(Array(15).fill({
                srNo: '', customer: '', mfgSource: '', tdpNo: '', projectCode: '',
                ddrnNo: '', ddrnDate: '', eca: '', project: '', modeOfWork: '',
                toolDrgNo: '', toolDesc: '', compDrgNo: '', compDesc: '',
                matCost: '', toolCost: '', ddrnSrNo: '', status: '',
                ddrnRecMonth: '', ddrnRecDate: '', finYear: '', completionMonth: '',
                designer: '', remarks: ''
            }));
        }
    }, [plan, mode]);

    const updateDdrn = (index, field, value) => {
        const newData = [...ddrnData];
        newData[index] = { ...newData[index], [field]: value };
        setDdrnData(newData);
    };

    const updateDiePlan = (index, field, value) => {
        const newData = [...diePlanData];
        newData[index] = { ...newData[index], [field]: value };
        setDiePlanData(newData);
    };

    const updateCost = (index, field, value) => {
        const newData = [...costData];
        newData[index] = { ...newData[index], [field]: value };
        setCostData(newData);
    };

    const handleSave = async () => {
        // Logic similar to previous, but handling the extended data is mostly for show until backend supports JSON blobs
        // For now, map critical fields
        try {
            setIsSaving(true);
            const ddrnRow = ddrnData[0] || {};
            const payload = {
                partName: ddrnRow.compName,
                vendorName: ddrnRow.supplier,
                startDate: ddrnRow.tdpDesignDate,
                targetDate: ddrnRow.tdpMfgDate,
                stage: ddrnRow.toolDesc,
                status: 'In Development'
            };

            if (mode === 'create') {
                await diePlanService.createPlan(payload);
            } else if (plan?._id) {
                await diePlanService.updatePlan(plan._id, payload);
            }
            onBack();
        } catch (error) {
            console.error("Save failed", error);
            alert("Save failed (Core fields Only).");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4">
            {/* Sticky Action Header */}
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border border-slate-300 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h1 className="font-bold text-slate-800 text-lg uppercase">
                        {mode === 'create' ? 'New Die Plan' : `${plan?.partName || 'Die Plan'} - ${activeTab}`}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {isEditing && (
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-1.5 bg-blue-700 text-white rounded hover:bg-blue-800 text-sm font-medium disabled:opacity-50">
                            <Save size={16} /> Save Changes
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm font-medium">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-200 border-x border-t border-slate-300 flex overflow-hidden rounded-t-lg mx-auto max-w-[1400px]">
                <TabButton id="DDRN" label="Die Design Release Note" icon={FileText} activeTab={activeTab} onClick={setActiveTab} />
                <TabButton id="DIE_PLAN" label="Master Die Plan" icon={Layout} activeTab={activeTab} onClick={setActiveTab} />
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto bg-white border border-slate-300 shadow-lg min-h-[800px] p-8 overflow-auto">

                {activeTab === 'DDRN' && (
                    <div className="space-y-0 text-slate-900">
                        {/* Header Grid */}
                        <div className="border border-slate-800 grid grid-cols-[150px_1fr_200px] text-xs">
                            {/* Logo Box */}
                            <div className="border-r border-slate-800 flex items-center justify-center p-4">
                                <h2 className="text-2xl font-black text-slate-800 tracking-wider">SMG</h2>
                            </div>

                            {/* Center Info */}
                            <div className="flex flex-col">
                                <div className="border-b border-slate-800 bg-blue-100 px-2 py-1 font-bold text-center">
                                    SMG ELECTRIC SCOOTERS
                                </div>
                                <div className="border-b border-slate-800 flex">
                                    <div className="flex-1 border-r border-slate-800 p-1 flex gap-2">
                                        <span className="font-bold">DEPARTMENT NAME:</span>
                                        <EditableCell value="Engineering" disabled={!isEditing} />
                                    </div>
                                    <div className="flex-1 p-1 flex gap-2">
                                        <span className="font-bold">SECTION NAME:</span>
                                        <EditableCell value="Die Shop" disabled={!isEditing} />
                                    </div>
                                </div>
                                <div className="bg-yellow-50 font-bold text-center py-2 text-sm uppercase tracking-wider">
                                    Die/Tool Design Release Note
                                </div>
                            </div>

                            {/* Right Info */}
                            <div className="border-l border-slate-800 flex flex-col text-[10px]">
                                <div className="flex border-b border-slate-800 h-1/3 items-center px-2 bg-yellow-100">
                                    <span className="font-bold w-20">Code:</span>
                                    <EditableCell value={headerInfo.code} onChange={v => setHeaderInfo({ ...headerInfo, code: v })} disabled={!isEditing} />
                                </div>
                                <div className="flex border-b border-slate-800 h-1/3 items-center px-2 bg-yellow-100">
                                    <span className="font-bold w-20">Rev Status:</span>
                                    <EditableCell value={headerInfo.revStatus} onChange={v => setHeaderInfo({ ...headerInfo, revStatus: v })} disabled={!isEditing} />
                                </div>
                                <div className="flex h-1/3 items-center px-2 bg-yellow-100">
                                    <span className="font-bold w-20">Rev Date:</span>
                                    <EditableCell value={headerInfo.revDate} onChange={v => setHeaderInfo({ ...headerInfo, revDate: v })} disabled={!isEditing} />
                                </div>
                            </div>
                        </div>

                        {/* Sub Header */}
                        <div className="border-x border-b border-slate-800 p-2 text-xs flex justify-between">
                            <div className="space-y-1 w-2/3">
                                <div><span className="font-bold">TO,</span> Manufacturing Department</div>
                                <div>Please Find The Following Drawings for your Necessary Action.</div>
                            </div>
                            <div className="w-1/3 border-l border-slate-800 pl-2 space-y-1">
                                <div className="flex gap-2">
                                    <span className="font-bold w-20">DDRN NO:</span>
                                    <EditableCell value={headerInfo.ddrnNo} disabled={true} className="font-mono" />
                                </div>
                                <div className="flex gap-2 border-t border-slate-300 pt-1 mt-1">
                                    <span className="font-bold w-20">Date:</span>
                                    <EditableCell type="date" value={headerInfo.date} disabled={!isEditing} />
                                </div>
                            </div>
                        </div>

                        {/* DDRN Data Table */}
                        <div className="overflow-x-auto mt-0 border-x border-b border-slate-800">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <TableHeader className="w-10">SR NO</TableHeader>
                                        <TableHeader className="w-32">Supplier/ Customer</TableHeader>
                                        <TableHeader className="w-24">ECN/ERN No & Date</TableHeader>
                                        <TableHeader className="w-20">TDP NO</TableHeader>
                                        <TableHeader className="w-24">TDP design Date</TableHeader>
                                        <TableHeader className="w-24">TDP mfg Date</TableHeader>
                                        <TableHeader className="w-48">Die /Tool Description</TableHeader>
                                        <TableHeader className="w-24">Die/Tool No.</TableHeader>
                                        <TableHeader className="w-10">Mod.</TableHeader>
                                        <TableHeader className="w-32">Component name</TableHeader>
                                        <TableHeader className="w-24">Component no & rev.</TableHeader>
                                        <TableHeader className="w-20">BOM no</TableHeader>
                                        <TableHeader className="w-24">Designer</TableHeader>
                                        <TableHeader className="w-24">CHECKED BY</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ddrnData.map((row, i) => (
                                        <tr key={i}>
                                            <TableCell className="text-center">{row.srNo || (i + 1)}</TableCell>
                                            <TableCell><EditableCell value={row.supplier} onChange={v => updateDdrn(i, 'supplier', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.ecn} onChange={v => updateDdrn(i, 'ecn', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.tdpNo} onChange={v => updateDdrn(i, 'tdpNo', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell type="date" value={row.tdpDesignDate} onChange={v => updateDdrn(i, 'tdpDesignDate', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell type="date" value={row.tdpMfgDate} onChange={v => updateDdrn(i, 'tdpMfgDate', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.toolDesc} onChange={v => updateDdrn(i, 'toolDesc', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.toolNo} onChange={v => updateDdrn(i, 'toolNo', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.mod} onChange={v => updateDdrn(i, 'mod', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.compName} onChange={v => updateDdrn(i, 'compName', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.compNo} onChange={v => updateDdrn(i, 'compNo', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.bom} onChange={v => updateDdrn(i, 'bom', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.designer} onChange={v => updateDdrn(i, 'designer', v)} disabled={!isEditing} /></TableCell>
                                            <TableCell><EditableCell value={row.checkedBy} onChange={v => updateDdrn(i, 'checkedBy', v)} disabled={!isEditing} /></TableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Section */}
                        <div className="border border-slate-800 border-t-0 flex">
                            {/* Left Side */}
                            <div className="w-2/3 border-r border-slate-800">
                                <div className="border-b border-slate-800 p-1 flex bg-slate-50">
                                    <span className="font-bold text-xs uppercase mr-2">Project ,Assembly Name & Tabular No:</span>
                                    <EditableCell
                                        value={headerInfo.projectAssembly}
                                        onChange={v => setHeaderInfo({ ...headerInfo, projectAssembly: v })}
                                        disabled={!isEditing}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex h-48">
                                    <div className="w-2/3 border-r border-slate-800 p-2">
                                        <div className="font-bold text-xs mb-1">Remarks:-</div>
                                        <textarea
                                            className="w-full h-full resize-none outline-none text-xs bg-transparent"
                                            value={headerInfo.remarks}
                                            onChange={e => setHeaderInfo({ ...headerInfo, remarks: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <div className="border-b border-slate-800 text-center font-bold text-xs py-1">Data Sharing /Backup Info.</div>
                                        <div className="grid grid-cols-3 text-[10px] text-center">
                                            <div className="border-b border-r border-slate-300 font-bold p-1">TYPE/ SERVER</div>
                                            <div className="border-b border-r border-slate-300 font-bold p-1">3D</div>
                                            <div className="border-b border-slate-300 font-bold p-1">2D</div>

                                            <div className="border-b border-r border-slate-300 p-1 font-bold">TOOLING</div>
                                            <div className="border-b border-r border-slate-300 p-1">✓</div>
                                            <div className="border-b border-slate-300 p-1">✓</div>

                                            <div className="border-r border-slate-300 p-1 font-bold">MFD</div>
                                            <div className="border-r border-slate-300 p-1">✓</div>
                                            <div className="p-1">✓</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side (Cost Table) */}
                            <div className="w-1/3">
                                <div className="border-b border-slate-800 p-1 flex bg-slate-50">
                                    <span className="font-bold text-xs mr-2">TRIAL/PQI/ECA NO:-</span>
                                    <EditableCell
                                        value={headerInfo.trialNo}
                                        onChange={v => setHeaderInfo({ ...headerInfo, trialNo: v })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="grid grid-cols-[30px_1fr_1fr_30px_1fr_1fr] text-[10px]">
                                    {/* Header */}
                                    <div className="bg-yellow-100 border-b border-r border-slate-800 p-1 font-bold text-center">SR</div>
                                    <div className="bg-yellow-100 border-b border-r border-slate-800 p-1 font-bold text-center">DM (RS)</div>
                                    <div className="bg-yellow-100 border-b border-r border-slate-800 p-1 font-bold text-center">NAV (RS)</div>
                                    <div className="bg-yellow-100 border-b border-r border-slate-800 p-1 font-bold text-center">SRS</div>
                                    <div className="bg-yellow-100 border-b border-r border-slate-800 p-1 font-bold text-center">DM (RS)</div>
                                    <div className="bg-yellow-100 border-b border-slate-800 p-1 font-bold text-center">NAV (RS)</div>

                                    {/* Rows 1-5 */}
                                    {costData.slice(0, 5).map((row, i) => (
                                        <React.Fragment key={i}>
                                            <div className="border-b border-r border-slate-300 p-1 text-center font-bold">{i + 1}</div>
                                            <div className="border-b border-r border-slate-300 p-0"><EditableCell value={row.dm} onChange={v => updateCost(i, 'dm', v)} disabled={!isEditing} /></div>
                                            <div className="border-b border-r border-slate-800 p-0"><EditableCell value={row.nav} onChange={v => updateCost(i, 'nav', v)} disabled={!isEditing} /></div>
                                            {/* Matches with i+6 */}
                                            <div className="border-b border-r border-slate-300 p-1 text-center font-bold">{i + 6}</div>
                                            <div className="border-b border-r border-slate-300 p-0"><EditableCell value={costData[i + 5]?.dm} onChange={v => updateCost(i + 5, 'dm', v)} disabled={!isEditing} /></div>
                                            <div className="border-b border-slate-300 p-0"><EditableCell value={costData[i + 5]?.nav} onChange={v => updateCost(i + 5, 'nav', v)} disabled={!isEditing} /></div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'DIE_PLAN' && (
                    <div className="overflow-x-auto border border-slate-800">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <TableHeader className="w-10">SR NO</TableHeader>
                                    <TableHeader className="w-32">CUSTOMER</TableHeader>
                                    <TableHeader className="w-32">MFG. SOURCE</TableHeader>
                                    <TableHeader className="w-24">TDP NO.</TableHeader>
                                    <TableHeader className="w-24">PROJECT CODE</TableHeader>
                                    <TableHeader className="w-24">DDRN NO.</TableHeader>
                                    <TableHeader className="w-24">DDRN DATE</TableHeader>
                                    <TableHeader className="w-20">ECA</TableHeader>
                                    <TableHeader className="w-32">PROJECT</TableHeader>
                                    <TableHeader className="w-24">MODE OF WORK</TableHeader>
                                    <TableHeader className="w-24">TOOL DRAWING NO</TableHeader>
                                    <TableHeader className="w-48">TOOL DESCRIPTION</TableHeader>
                                    <TableHeader className="w-24">COMP. DRAWING NO.</TableHeader>
                                    <TableHeader className="w-48">COMPONENT DESCRIPTION</TableHeader>
                                    <TableHeader className="w-24">MATERIAL COST (ECA)</TableHeader>
                                    <TableHeader className="w-24">TOOL COST (ECA)</TableHeader>
                                    <TableHeader className="w-20">DDRN SR NO</TableHeader>
                                    <TableHeader className="w-24">STATUS FOR PLANNING</TableHeader>
                                    <TableHeader className="w-24">DDRN RECEIVED MONTH</TableHeader>
                                    <TableHeader className="w-24">DDRN RECIEVED DATE</TableHeader>
                                    <TableHeader className="w-20">FINANCIAL YEAR</TableHeader>
                                    <TableHeader className="w-24">COMPLETION MONTH</TableHeader>
                                    <TableHeader className="w-24">DESIGNER</TableHeader>
                                    <TableHeader className="w-48">REMARKS 2</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {diePlanData.map((row, i) => (
                                    <tr key={i}>
                                        <TableCell className="text-center">{row.srNo || (i + 1)}</TableCell>
                                        <TableCell><EditableCell value={row.customer} onChange={v => updateDiePlan(i, 'customer', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.mfgSource} onChange={v => updateDiePlan(i, 'mfgSource', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.tdpNo} onChange={v => updateDiePlan(i, 'tdpNo', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.projectCode} onChange={v => updateDiePlan(i, 'projectCode', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.ddrnNo} onChange={v => updateDiePlan(i, 'ddrnNo', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell type="date" value={row.ddrnDate} onChange={v => updateDiePlan(i, 'ddrnDate', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.eca} onChange={v => updateDiePlan(i, 'eca', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.project} onChange={v => updateDiePlan(i, 'project', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.modeOfWork} onChange={v => updateDiePlan(i, 'modeOfWork', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.toolDrgNo} onChange={v => updateDiePlan(i, 'toolDrgNo', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.toolDesc} onChange={v => updateDiePlan(i, 'toolDesc', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.compDrgNo} onChange={v => updateDiePlan(i, 'compDrgNo', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.compDesc} onChange={v => updateDiePlan(i, 'compDesc', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.matCost} onChange={v => updateDiePlan(i, 'matCost', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.toolCost} onChange={v => updateDiePlan(i, 'toolCost', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.ddrnSrNo} onChange={v => updateDiePlan(i, 'ddrnSrNo', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.status} onChange={v => updateDiePlan(i, 'status', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.ddrnRecMonth} onChange={v => updateDiePlan(i, 'ddrnRecMonth', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell type="date" value={row.ddrnRecDate} onChange={v => updateDiePlan(i, 'ddrnRecDate', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.finYear} onChange={v => updateDiePlan(i, 'finYear', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.completionMonth} onChange={v => updateDiePlan(i, 'completionMonth', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.designer} onChange={v => updateDiePlan(i, 'designer', v)} disabled={!isEditing} /></TableCell>
                                        <TableCell><EditableCell value={row.remarks} onChange={v => updateDiePlan(i, 'remarks', v)} disabled={!isEditing} /></TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiePlanSheet;
