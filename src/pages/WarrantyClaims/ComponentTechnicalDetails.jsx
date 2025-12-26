import React from 'react';
import { Wrench } from 'lucide-react';

const ComponentTechnicalDetails = ({ formData, setFormData }) => {
    const componentType = formData.componentName.toLowerCase();

    const handleTechnicalChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            technicalDetails: {
                ...prev.technicalDetails,
                [section]: {
                    ...prev.technicalDetails?.[section],
                    [field]: value
                }
            }
        }));
    };

    const handleNestedChange = (section, parent, child, value) => {
        setFormData(prev => ({
            ...prev,
            technicalDetails: {
                ...prev.technicalDetails,
                [section]: {
                    ...prev.technicalDetails?.[section],
                    [parent]: {
                        ...prev.technicalDetails?.[section]?.[parent],
                        [child]: value
                    }
                }
            }
        }));
    };

    // Helper to get value safely
    const getValue = (section, field) => {
        return formData.technicalDetails?.[section]?.[field] || '';
    };

    const getNestedValue = (section, parent, child) => {
        return formData.technicalDetails?.[section]?.[parent]?.[child] || '';
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-600 rounded-lg">
                    <Wrench size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Component Technical Details</h2>
            </div>

            <p className="text-sm text-slate-600 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                Fill in the relevant technical details for the failed component. You can skip sections that don't apply.
            </p>

            {/* Charger Lithium */}
            {componentType.includes('charger') && componentType.includes('lithium') && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Charger Complaint (Lithium)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Charger No</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'chargerNo')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'chargerNo', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery Voltage @Vehicle Charging Port</label>
                            <input
                                type="number"
                                value={getValue('chargerLithium', 'batteryVoltage')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'batteryVoltage', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status of Green LED (Phylin)</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'greenLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'greenLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status of Red LED (Phylin)</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'redLedPhylinStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'redLedPhylinStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status of MAINS ON LED</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'mainsOnLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'mainsOnLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status OF O/P ON LED (Sonalta)</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'opOnLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'opOnLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery Charging Status LED (Sonalta)</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'batteryChargingLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'batteryChargingLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Fan Status</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'fanStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'fanStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Charging Time</label>
                            <input
                                type="text"
                                value={getValue('chargerLithium', 'chargingTime')}
                                onChange={(e) => handleTechnicalChange('chargerLithium', 'chargingTime', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Charger Lead Acid */}
            {componentType.includes('charger') && (componentType.includes('lead') || componentType.includes('acid')) && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Charger Complaint (Lead Acid)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Charger No</label>
                            <input
                                type="text"
                                value={getValue('chargerLeadAcid', 'chargerNo')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'chargerNo', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery Voltage @Vehicle Charging Port</label>
                            <input
                                type="number"
                                value={getValue('chargerLeadAcid', 'batteryVoltage')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'batteryVoltage', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status of GREEN LED</label>
                            <input
                                type="text"
                                value={getValue('chargerLeadAcid', 'greenLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'greenLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status of RED LED</label>
                            <input
                                type="text"
                                value={getValue('chargerLeadAcid', 'redLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'redLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Status of BLUE LED</label>
                            <input
                                type="text"
                                value={getValue('chargerLeadAcid', 'blueLedStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'blueLedStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Fan Status</label>
                            <input
                                type="text"
                                value={getValue('chargerLeadAcid', 'fanStatus')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'fanStatus', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Charging Time</label>
                            <input
                                type="text"
                                value={getValue('chargerLeadAcid', 'chargingTime')}
                                onChange={(e) => handleTechnicalChange('chargerLeadAcid', 'chargingTime', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Battery Lithium */}
            {componentType.includes('battery') && componentType.includes('lithium') && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Battery Complaint (Lithium)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery No</label>
                            <input
                                type="text"
                                value={getValue('batteryLithium', 'batteryNo')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'batteryNo', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Vehicle Current</label>
                            <input
                                type="text"
                                value={getValue('batteryLithium', 'vehicleCurrent')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'vehicleCurrent', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Condition</label>
                            <input
                                type="text"
                                value={getValue('batteryLithium', 'condition')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'condition', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Value</label>
                            <input
                                type="text"
                                value={getValue('batteryLithium', 'value')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'value', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery Voltage @Full Charge (V)</label>
                            <input
                                type="number"
                                value={getValue('batteryLithium', 'voltageFullCharge')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'voltageFullCharge', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery Voltage After Low Battery Indication (V)</label>
                            <input
                                type="number"
                                value={getValue('batteryLithium', 'voltageAfterLowBattery')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'voltageAfterLowBattery', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">After Constant Current, 15A discharges Battery Capacity (AH)</label>
                            <input
                                type="number"
                                value={getValue('batteryLithium', 'batteryCapacityAfterDischarge')}
                                onChange={(e) => handleTechnicalChange('batteryLithium', 'batteryCapacityAfterDischarge', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Battery Lead Acid */}
            {componentType.includes('battery') && (componentType.includes('lead') || componentType.includes('acid')) && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Battery Complaint (Lead Acid)</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Battery No</label>
                                <input
                                    type="text"
                                    value={getValue('batteryLeadAcid', 'batteryNo')}
                                    onChange={(e) => handleTechnicalChange('batteryLeadAcid', 'batteryNo', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Vehicle Current</label>
                                <input
                                    type="text"
                                    value={getValue('batteryLeadAcid', 'vehicleCurrent')}
                                    onChange={(e) => handleTechnicalChange('batteryLeadAcid', 'vehicleCurrent', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Voltage @Full Charge */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Battery Voltage @Full Charge (V)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {['b1', 'b2', 'b3', 'b4', 'b5'].map((battery) => (
                                    <div key={battery}>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{battery.toUpperCase()}(V)</label>
                                        <input
                                            type="number"
                                            value={getNestedValue('batteryLeadAcid', 'voltageFullCharge', battery)}
                                            onChange={(e) => handleNestedChange('batteryLeadAcid', 'voltageFullCharge', battery, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Voltage After Low Battery */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Battery Voltage After Low Battery Indication in Vehicle (V)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {['b1', 'b2', 'b3', 'b4', 'b5'].map((battery) => (
                                    <div key={battery}>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{battery.toUpperCase()}(V)</label>
                                        <input
                                            type="number"
                                            value={getNestedValue('batteryLeadAcid', 'voltageAfterLowBattery', battery)}
                                            onChange={(e) => handleNestedChange('batteryLeadAcid', 'voltageAfterLowBattery', battery, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Capacity After Discharge */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">After Constant Current, 15A discharges Battery Capacity (AH)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {['b1', 'b2', 'b3', 'b4', 'b5'].map((battery) => (
                                    <div key={battery}>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{battery.toUpperCase()}(V)</label>
                                        <input
                                            type="number"
                                            value={getNestedValue('batteryLeadAcid', 'capacityAfterDischarge', battery)}
                                            onChange={(e) => handleNestedChange('batteryLeadAcid', 'capacityAfterDischarge', battery, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Motor Complaint */}
            {componentType.includes('motor') && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Motor Complaint</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Motor No</label>
                                <input
                                    type="text"
                                    value={getValue('motor', 'motorNo')}
                                    onChange={(e) => handleTechnicalChange('motor', 'motorNo', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Vehicle Current</label>
                                <input
                                    type="text"
                                    value={getValue('motor', 'vehicleCurrent')}
                                    onChange={(e) => handleTechnicalChange('motor', 'vehicleCurrent', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Test 1: Diode Test */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Test 1: Diode Test - TERMINALS & VALUES</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { key: 'redBlack', label: 'Red+Black' },
                                    { key: 'redGreen', label: 'Red+Green' },
                                    { key: 'redBlue', label: 'Red+Blue' },
                                    { key: 'redYellow', label: 'Red+Yellow' }
                                ].map((terminal) => (
                                    <div key={terminal.key}>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{terminal.label}</label>
                                        <input
                                            type="text"
                                            value={getNestedValue('motor', 'diodeTest', terminal.key)}
                                            onChange={(e) => handleNestedChange('motor', 'diodeTest', terminal.key, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Test 2: Voltage Test */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Test 2: Voltage Test - TERMINALS & VALUES</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { key: 'redBlack', label: 'Red+Black' },
                                    { key: 'greenBlack', label: 'Green+Black' },
                                    { key: 'blueBlack', label: 'Blue+Black' },
                                    { key: 'yellowBlack', label: 'Yellow+Black' }
                                ].map((terminal) => (
                                    <div key={terminal.key}>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{terminal.label}</label>
                                        <input
                                            type="text"
                                            value={getNestedValue('motor', 'voltageTest', terminal.key)}
                                            onChange={(e) => handleNestedChange('motor', 'voltageTest', terminal.key, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controller Complaint */}
            {componentType.includes('controller') && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Controller Complaint</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Controller No</label>
                                <input
                                    type="text"
                                    value={getValue('controller', 'controllerNo')}
                                    onChange={(e) => handleTechnicalChange('controller', 'controllerNo', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Vehicle Current</label>
                                <input
                                    type="text"
                                    value={getValue('controller', 'vehicleCurrent')}
                                    onChange={(e) => handleTechnicalChange('controller', 'vehicleCurrent', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Test 1: Continuity Test */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Test 1: Continuity Test - TERMINALS, YES/NO & VALUES</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'redBlack', label: 'Red+Black' },
                                    { key: 'redGreen', label: 'Red+Green' },
                                    { key: 'redBlue', label: 'Red+Blue' },
                                    { key: 'redYellow', label: 'Red+Yellow' }
                                ].map((terminal) => (
                                    <div key={terminal.key} className="border-2 border-slate-200 rounded-lg p-3">
                                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{terminal.label}</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-slate-600 mb-1">Status</label>
                                                <select
                                                    value={getNestedValue('controller', 'continuityTest', terminal.key)?.status || ''}
                                                    onChange={(e) => {
                                                        const currentValue = getNestedValue('controller', 'continuityTest', terminal.key)?.value || '';
                                                        handleNestedChange('controller', 'continuityTest', terminal.key, { status: e.target.value, value: currentValue });
                                                    }}
                                                    className="w-full px-2 py-2 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="YES">YES</option>
                                                    <option value="NO">NO</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-600 mb-1">Value</label>
                                                <input
                                                    type="text"
                                                    value={getNestedValue('controller', 'continuityTest', terminal.key)?.value || ''}
                                                    onChange={(e) => {
                                                        const currentStatus = getNestedValue('controller', 'continuityTest', terminal.key)?.status || '';
                                                        handleNestedChange('controller', 'continuityTest', terminal.key, { status: currentStatus, value: e.target.value });
                                                    }}
                                                    className="w-full px-2 py-2 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Test 2: Voltage Test */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Test 2: Voltage Test - TERMINALS & YES/NO</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { key: 'throttleIP', label: 'Throttle I/P' },
                                    { key: 'redBlack', label: 'Red+Black' },
                                    { key: 'hallSIP', label: 'Hall S I/P(Red+Black)' }
                                ].map((terminal) => (
                                    <div key={terminal.key}>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{terminal.label}</label>
                                        <select
                                            value={getNestedValue('controller', 'voltageTest', terminal.key)}
                                            onChange={(e) => handleNestedChange('controller', 'voltageTest', terminal.key, e.target.value)}
                                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="YES">YES</option>
                                            <option value="NO">NO</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Converter Complaint */}
            {componentType.includes('converter') && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Converter Complaint</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Converter No</label>
                            <input
                                type="text"
                                value={getValue('converter', 'converterNo')}
                                onChange={(e) => handleTechnicalChange('converter', 'converterNo', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">If Any Other Reason</label>
                            <input
                                type="text"
                                value={getValue('converter', 'otherReason')}
                                onChange={(e) => handleTechnicalChange('converter', 'otherReason', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">INPUT VOLTAGE</label>
                            <input
                                type="number"
                                value={getValue('converter', 'inputVoltage')}
                                onChange={(e) => handleTechnicalChange('converter', 'inputVoltage', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">OUTPUT VOLTAGE</label>
                            <input
                                type="number"
                                value={getValue('converter', 'outputVoltage')}
                                onChange={(e) => handleTechnicalChange('converter', 'outputVoltage', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComponentTechnicalDetails;
