import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Share2, LayoutPanelLeft, ArrowLeft, Printer } from 'lucide-react';

const SORTopBar = ({ record, isEditMode, toggleEditMode, toggleAuditPanel }) => {
    const navigate = useNavigate();

    const handlePrintSOR = () => {
        const { formData, specifications } = record;
        const logoUrl = '/src/asset/logo/Logo.jpg';
        const dateStr = new Date().toLocaleDateString();

        const specsRows = specifications.map((spec, index) => `
            <tr>
                <td style="text-align:center">${index + 1}</td>
                <td><strong>${spec.specification}</strong></td>
                <td>${spec.customerRequirement}</td>
                <td style="text-align:center"><span class="compliance">${spec.compliance}</span></td>
                <td>${spec.remarks || '-'}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>SOR - ${formData.sorNumber || 'New'}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; font-size: 12px; color: #1e293b; }
                    .header { display: flex; align-items: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { height: 60px; margin-right: 20px; }
                    .title-block { flex: 1; }
                    .company { font-size: 22px; font-weight: bold; color: #1e3a5f; text-transform: uppercase; }
                    .doc-title { font-size: 14px; color: #64748b; font-weight: 600; margin-top: 2px; }
                    .meta { text-align: right; font-size: 11px; color: #475569; }
                    
                    .section { margin-bottom: 25px; }
                    .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px; }
                    
                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
                    
                    .field { margin-bottom: 8px; }
                    .label { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
                    .value { font-size: 13px; font-weight: 500; }
                    
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
                    th { background: #f1f5f9; color: #475569; padding: 8px 10px; text-align: left; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
                    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
                    tr:nth-child(even) { background: #f8fafc; }
                    
                    .compliance { font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
                    
                    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 10px; color: #94a3b8; }
                    
                    @media print { .no-print { display: none; } button { display: none; } }
                </style>
            </head>
            <body>
                 <div class="header">
                    <img src="${logoUrl}" class="logo" alt="Logo" onerror="this.style.display='none'" />
                    <div class="title-block">
                        <div class="company">SMG Electric Scooters</div>
                        <div class="doc-title">Statement of Requirements</div>
                    </div>
                    <div class="meta">
                        <div><strong>SOR No:</strong> ${formData.sorNumber || 'Not Assigned'}</div>
                        <div><strong>Date:</strong> ${dateStr}</div>
                        <div><strong>Status:</strong> ${record.status}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">General Information</div>
                    <div class="grid-3">
                        <div class="field"><div class="label">Vendor</div><div class="value">${formData.vendor || '-'}</div></div>
                        <div class="field"><div class="label">Document No</div><div class="value">${formData.documentNumber || '-'}</div></div>
                        <div class="field"><div class="label">Vehicle Type</div><div class="value">${formData.vehicleType || '-'}</div></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Company Details</div>
                    <div class="grid-2">
                         <div class="field"><div class="label">Company Name</div><div class="value">${formData.companyName || '-'}</div></div>
                         <div class="field"><div class="label">Enquirer</div><div class="value">${formData.enquirerName || '-'}</div></div>
                         <div class="field"><div class="label">Nature of Company</div><div class="value">${formData.natureOfCompany || '-'}</div></div>
                         <div class="field"><div class="label">Contact</div><div class="value">${formData.contactInfo || '-'}</div></div>
                    </div>
                </div>
                
                 <div class="section">
                    <div class="section-title">Technical Specifications</div>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px; text-align:center">#</th>
                                <th style="width: 25%">Specification</th>
                                <th>Requirement</th>
                                <th style="width: 80px; text-align:center">Complied?</th>
                                <th style="width: 20%">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${specsRows}
                        </tbody>
                    </table>
                </div>

                <div class="footer">
                    Generated from SMG Vendor Portal - Confidential
                </div>
                
                <div class="no-print" style="position: fixed; top: 20px; right: 20px;">
                    <button onclick="window.print()" style="background:#1e3a5f; color:white; border:none; padding:10px 20px; border-radius:4px; cursor:pointer; font-weight:bold;">🖨️ Print Document</button>
                </div>
            </body>
            </html>
        `;

        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
    };

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-5 mb-6 no-print">
            {/* Back Button - Top Right */}
            <div className="flex justify-end mb-4 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/sor/list')}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all group font-medium"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">

                {/* Left: Title & Info */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Statement of Requirements
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                            {record.status}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <span className="font-mono text-slate-600">{record.id}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Rev 2.1</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Last Edited: {record.date || "Just now"}</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrintSOR}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
                    >
                        <Printer size={16} />
                        Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
                        <LayoutPanelLeft size={16} />
                        Compare
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
                        <Share2 size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium text-sm">
                        Submit to Vendor
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>

            {/* Progress Bar (Optional - kept subtle) */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
                <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${record.progress || 0}%` }}
                ></div>
            </div>
        </div>
    );
};

export default SORTopBar;
