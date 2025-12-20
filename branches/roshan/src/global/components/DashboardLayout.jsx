import React from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/dashboard/home';

    return (
        <div className="flex h-screen bg-background text-foreground"> {/* Semantic Background */}
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden transition-all duration-200">
                {/* Main Content Area */}
                <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-background ${isHomePage ? 'h-full' : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
