import React from 'react';
import { Check, X, AlertCircle, Clock } from 'lucide-react';

const PaymentTimeline = ({ status }) => {
    const steps = [
        { label: 'Pending', icon: Clock },
        { label: 'Processing', icon: AlertCircle }, // Or a loader icon
        { label: 'Approved', icon: Check },
        { label: 'Paid', icon: Check }
    ];

    const getStatusIndex = (s) => {
        if (s === 'Paid') return 3;
        if (s === 'Approved') return 2;
        if (s === 'Processing') return 1;
        return 0; // Pending or others start here
    };

    const isRejected = status === 'Rejected';
    const activeIndex = getStatusIndex(status);

    if (isRejected) {
        return (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-center gap-3 mb-6">
                <X className="text-red-500" size={24} />
                <span className="font-bold text-red-700">Payment Rejected</span>
            </div>
        );
    }

    if (status === 'On Hold') {
        return (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-center gap-3 mb-6">
                <AlertCircle className="text-orange-500" size={24} />
                <span className="font-bold text-orange-700">Payment On Hold</span>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-0"></div>

                {/* Active Line */}
                <div
                    className="absolute top-1/2 left-0 h-[2px] bg-green-500 -z-0 transition-all duration-500"
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.label} className="relative z-10 flex flex-col items-center">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white
                                ${isCompleted
                                    ? 'border-green-500 text-green-600 shadow-md scale-110'
                                    : 'border-slate-200 text-slate-300'
                                }
                            `}>
                                <Icon size={14} strokeWidth={3} />
                            </div>
                            <span className={`
                                mt-2 text-xs font-bold uppercase tracking-wide transition-colors duration-300
                                ${isCurrent ? 'text-green-700' : isCompleted ? 'text-slate-600' : 'text-slate-300'}
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

export default PaymentTimeline;
