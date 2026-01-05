import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

const SORFlowchart = ({ status }) => {
    // Map status to steps
    // status can be: 'Draft', 'Issued', 'Pending', 'Review', 'Approved', 'Rejected'

    const steps = [
        { id: 1, label: 'Issued', match: ['Issued', 'Draft'] },
        { id: 2, label: 'Vendor Review', match: ['Vendor Review', 'Pending Review'] },
        { id: 3, label: 'Approved', match: ['Approved'] }
    ];

    // Determine current step index
    const currentStepIndex = steps.findIndex(step => step.match.includes(status));

    // Fallback if status doesn't match roughly (e.g. Rejected)
    const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 max-w-7xl mx-auto">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Approval Workflow</h3>

            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0 rounded-full"></div>

                {/* Progress Bar Active */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 rounded-full transition-all duration-500"
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                ${isCompleted
                                    ? 'bg-green-500 border-green-500 text-white shadow-md scale-110'
                                    : 'bg-white border-slate-300 text-slate-300'
                                }
                            `}>
                                {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{index + 1}</span>}
                            </div>
                            <span className={`
                                mt-2 text-xs font-bold uppercase tracking-wide transition-colors duration-300
                                ${isCurrent ? 'text-green-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}
                            `}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SORFlowchart;
