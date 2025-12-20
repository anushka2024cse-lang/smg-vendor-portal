import React, { useState } from 'react';
import { BarChart2, TrendingUp, AlertCircle } from 'lucide-react';
import { forecastingService } from '../../services/forecastingService';

const Forecasting = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleForecast = async () => {
        setLoading(true);
        try {
            const data = await forecastingService.generateForecast({ partId: '123', horizon: 30 });
            setResult(data);
        } catch (error) {
            console.error("Forecast failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 text-slate-300">
            <div className="flex items-center gap-4 mb-6">
                <button className="bg-[#1E293B] p-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <span className="text-xl">←</span>
                </button>
                <div>
                    <p className="text-sm text-slate-400">Material Management Portal</p>
                    <h1 className="text-2xl font-bold text-white">AI Stock Level Forecasting</h1>
                </div>
            </div>

            {/* Generate Forecast */}
            <div className="bg-[#1f2533] p-6 rounded-xl border border-slate-700/50 mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Generate a New Forecast</h2>
                <p className="text-sm text-slate-400 mb-6">Select a part and a forecast horizon (in days) to predict future stock levels using AI based on historical transaction data.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium mb-1">Inventory Part</label>
                        <select className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                            <option>Front Wheel Bearing (FWB-123)</option>
                            <option>Brake Pads (BP-999)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Forecast Horizon (Days)</label>
                        <input
                            type="number"
                            defaultValue="30"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleForecast}
                        disabled={loading}
                        className={`w-full md:w-auto flex items-center justify-center gap-2 bg-[#3b82f6] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <BarChart2 size={18} />
                        {loading ? 'Forecasting...' : 'Generate Forecast'}
                    </button>
                </div>
            </div>

            {/* Forecast Results */}
            {result && (
                <div className="bg-[#1f2533] p-6 rounded-xl border border-slate-700/50 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-emerald-500" size={24} />
                        <h2 className="text-lg font-semibold text-white">Forecast Results: {result.partName}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#1E293B] p-4 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase mb-1">Current Stock</p>
                            <p className="text-2xl font-bold text-white">{result.currentStock}</p>
                        </div>
                        <div className="bg-[#1E293B] p-4 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase mb-1">Forecasted Demand</p>
                            <p className="text-2xl font-bold text-blue-400">{result.forecastedDemand}</p>
                        </div>
                        <div className="bg-[#1E293B] p-4 rounded-lg border-l-4 border-amber-500">
                            <p className="text-slate-400 text-xs uppercase mb-1">Recommended Order</p>
                            <p className="text-2xl font-bold text-white">{result.recommendedOrder}</p>
                        </div>
                        <div className="bg-[#1E293B] p-4 rounded-lg">
                            <p className="text-slate-400 text-xs uppercase mb-1">Confidence Score</p>
                            <p className="text-2xl font-bold text-emerald-400">{result.confidenceScore}</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-blue-200">
                            Based on current consumption trends, stock for <strong>{result.partName}</strong> is predicted to fall below safety levels in 14 days.
                            It is recommended to place an order for {result.recommendedOrder} units immediately to avoid stockout.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forecasting;
