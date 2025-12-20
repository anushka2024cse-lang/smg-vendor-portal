import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Cuboid, Layers, BarChart2 } from 'lucide-react'; // Updated icons to match reference
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '../../services/dashboardService';

const DashboardHome = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({ totalModels: 0, totalComponents: 0, totalStockLevel: 0 });
    const [inventoryData, setInventoryData] = useState([]);
    const [stockDistributionData, setStockDistributionData] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [metricsData, inventoryChart, stockDist, lowStock] = await Promise.all([
                    dashboardService.getMetrics(),
                    dashboardService.getInventoryChartData(),
                    dashboardService.getStockDistribution(),
                    dashboardService.getLowStockItems()
                ]);

                setMetrics(metricsData);
                setInventoryData(inventoryChart);
                setStockDistributionData(stockDist);
                setLowStockItems(lowStock || []);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Exact replica colors from screenshot - Monochromatic Green for the Ring
    const COLORS = ['#10B981', '#059669', '#34D399', '#6EE7B7'];

    if (loading) return <div className="p-6 text-foreground">Loading Dashboard...</div>;

    return (
        <div className="px-6 pb-4 pt-1 text-muted-foreground w-full">
            <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>

            {/* Metrics & Forecast Promo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

                {/* Metric Card 1: Total Models */}
                <div className="bg-card p-5 rounded-xl border border-border relative shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-2">Total Models</p>
                            <p className="text-3xl font-bold text-card-foreground">{metrics.totalModels}</p>
                        </div>
                        <Car className="text-muted-foreground opacity-50" size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Vehicle models being managed</p>
                </div>

                {/* Metric Card 2: Total Components */}
                <div className="bg-card p-5 rounded-xl border border-border relative shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-2">Total Components</p>
                            <p className="text-3xl font-bold text-card-foreground">{metrics.totalComponents}</p>
                        </div>
                        <Cuboid className="text-muted-foreground opacity-50" size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Unique parts in the master list</p>
                </div>

                {/* Metric Card 3: Total Stock Level */}
                <div className="bg-card p-5 rounded-xl border border-border relative shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-2">Total Stock Level</p>
                            <p className="text-3xl font-bold text-card-foreground">{metrics.totalStockLevel}</p>
                        </div>
                        <Layers className="text-muted-foreground opacity-50" size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Total units across all components</p>
                </div>

                {/* Promo Card: AI Forecasting (Exact Replica Style) */}
                <div className="bg-slate-200 p-5 rounded-xl relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI FORECASTING</p>
                            <BarChart2 className="text-slate-400" size={16} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">Predict Future Stock</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Use AI to forecast inventory needs and prevent stockouts.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/forecasting')}
                        className="bg-[#0F172A] text-white text-xs py-2.5 px-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors w-fit"
                    >
                        Launch Forecast
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Inventory Movement Bar Chart */}
                <div className="lg:col-span-2 bg-card p-5 rounded-xl border border-border shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-base font-semibold text-card-foreground">Inventory Movement</h2>
                        <p className="text-sm text-muted-foreground">Received vs. Dispatched items over the last 12 months.</p>
                    </div>
                    <div className="h-52 pl-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inventoryData} barGap={8}>
                                <XAxis
                                    dataKey="name"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px', color: 'hsl(var(--card-foreground))' }}
                                    itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                                />
                                {/* Exact colors from dark theme implementation usually: Emerald for high, Slate/Gray for low */}
                                <Bar dataKey="Received" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="Dispatched" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-8 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-muted-foreground font-medium">Received</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                            <span className="text-xs text-muted-foreground font-medium">Dispatched</span>
                        </div>
                    </div>
                </div>

                {/* Stock Distribution Donut & Low Stock List */}
                <div className="flex flex-col gap-4">
                    {/* Donut Chart */}
                    <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex-1">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-card-foreground">Stock Distribution</h2>
                            <p className="text-sm text-muted-foreground">Top parts by current stock.</p>
                        </div>
                        <div className="h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stockDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={75}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stockDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: 'hsl(var(--card-foreground))' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-card p-5 rounded-xl border border-red-900/30 bg-gradient-to-br from-red-900/10 to-transparent">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-semibold text-red-500">Low Stock Items</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Items at or below their reorder threshold.</p>

                        <div className="space-y-3">
                            {lowStockItems.length > 0 ? lowStockItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center pb-2 border-b border-border/10 last:border-0 last:pb-0">
                                    <span className="text-xs font-bold text-card-foreground uppercase">{item.name}</span>
                                    <span className="text-xs font-bold text-red-500">{item.stock}</span>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground">No low stock items.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
