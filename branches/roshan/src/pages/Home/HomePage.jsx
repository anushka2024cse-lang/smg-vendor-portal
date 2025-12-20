import React from 'react';
import { LayoutDashboard, Download, Truck, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4 text-foreground h-full flex flex-col justify-start max-w-full mx-auto w-full">
            {/* Welcome Banner */}
            <div className="bg-card rounded-2xl border border-border py-6 px-8 text-center mb-4 relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-card-foreground mb-4">Welcome to the Material Management Portal</h1>
                    <p className="text-muted-foreground text-lg">Your central hub for managing materials efficiently.</p>
                </div>
                {/* Subtle background glow effect if needed, purely decorative - updated to use semantic opacity */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background/50 pointer-events-none"></div>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                {/* Dashboard Card */}
                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col h-60 hover:border-sidebar-accent transition-all duration-200 group">
                    <div className="flex items-center gap-3 mb-6">
                        <LayoutDashboard className="text-blue-500" size={20} />
                        <h2 className="text-lg font-bold text-card-foreground">Go to Dashboard</h2>
                    </div>
                    <p className="text-muted-foreground mb-auto leading-relaxed text-base">
                        Get a complete overview of your material stats.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-fit bg-secondary/10 border border-border/50 hover:bg-emerald-500 hover:text-white text-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 mt-4"
                    >
                        View Dashboard <span>→</span>
                    </button>
                </div>

                {/* Material Receiving Card */}
                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col h-60 hover:border-sidebar-accent transition-all duration-200 group">
                    <div className="flex items-center gap-3 mb-6">
                        <Download className="text-emerald-700" size={20} />
                        <h2 className="text-lg font-bold text-card-foreground">Material Receiving</h2>
                    </div>
                    <p className="text-muted-foreground mb-auto leading-relaxed text-base">
                        Log and track all incoming materials.
                    </p>
                    <button
                        onClick={() => navigate('/receive')}
                        className="w-fit bg-secondary/10 border border-border/50 hover:bg-emerald-500 hover:text-white text-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 mt-4"
                    >
                        Start Receiving <span>→</span>
                    </button>
                </div>

                {/* Material Dispatching Card */}
                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col h-60 hover:border-sidebar-accent transition-all duration-200 group">
                    <div className="flex items-center gap-3 mb-6">
                        <Truck className="text-red-900" size={20} />
                        <h2 className="text-lg font-bold text-card-foreground">Material Dispatching</h2>
                    </div>
                    <p className="text-muted-foreground mb-auto leading-relaxed text-base">
                        Manage and record all outgoing materials.
                    </p>
                    <button
                        onClick={() => navigate('/dispatch')}
                        className="w-fit bg-secondary/10 border border-border/50 hover:bg-emerald-500 hover:text-white text-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 mt-4"
                    >
                        Start Dispatching <span>→</span>
                    </button>
                </div>
            </div>

            {/* Floating Theme Toggle (Visual only based on screenshot bottom right) - keeping as is but ensuring colors work */}
            <div className="fixed bottom-8 right-8">
                <div className="bg-card p-3 rounded-full border border-border text-muted-foreground hover:text-card-foreground cursor-pointer shadow-lg">
                    <Moon size={20} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
