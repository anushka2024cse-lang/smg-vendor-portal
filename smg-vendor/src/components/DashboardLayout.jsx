import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen w-full bg-gray-50">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 p-10 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
