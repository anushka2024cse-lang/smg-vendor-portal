import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import DashboardLayout from './global/components/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import HomePage from './pages/Home/HomePage';
import VendorDetails from './pages/VendorDetails/VendorDetails';
import MaterialReceive from './pages/MaterialReceive/MaterialReceive';
import MaterialDispatch from './pages/MaterialDispatch/MaterialDispatch';
import Production from './pages/Production/Production';
import Forecasting from './pages/Forecasting/Forecasting';
import Admin from './pages/Admin/Admin';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminTickets from './pages/Admin/AdminTickets';
import Support from './pages/Support/Support';
import Inventory from './pages/Inventory/Inventory';
import Models from './pages/Models/Models';
import ComponentDetails from './pages/ComponentDetails/ComponentDetails';
import VendorList from './pages/Vendor/VendorList';
import VendorOnboarding from './pages/Vendor/VendorOnboarding';
import PurchaseOrderList from './pages/Procurement/PurchaseOrderList';
import PurchaseOrderCreate from './pages/Procurement/PurchaseOrderCreate';
import SORWorkspace from './pages/Procurement/SOR/SORWorkspace';
import CreateSor from './pages/Procurement/SOR/CreateSor';
import SORList from './pages/Procurement/SOR/SORList';
import PurchaseOrderCreateReplica from './pages/Procurement/PurchaseOrderCreateReplica';
import SettingsPage from './pages/Settings/SettingsPage';
import PaymentList from './pages/Payments/PaymentList';

import ProtectedRoute from './global/components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Secure Routes */}
                <Route element={<ProtectedRoute />}>
                    {/* Dashboard Layout Routes */}
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard/home" element={<HomePage />} />
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/dashboard/dashboard" element={<DashboardHome />} />

                        {/* Core Modules */}
                        <Route path="/models" element={<Models />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/component-details" element={<ComponentDetails />} />

                        {/* VENDOR MODULE */}
                        <Route path="/vendor/list" element={<VendorList />} />
                        <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
                        <Route path="/vendor/details/:vendorId" element={<VendorDetails />} />

                        {/* PROCUREMENT */}
                        <Route path="/po/list" element={<PurchaseOrderList />} />
                        <Route path="/po/create" element={<PurchaseOrderCreate />} />
                        <Route path="/po/create-replica" element={<PurchaseOrderCreateReplica />} />
                        <Route path="/sor/list" element={<SORList />} />
                        <Route path="/sor/create" element={<CreateSor />} />
                        <Route path="/sor/workspace" element={<Navigate to="/sor/list" replace />} />
                        <Route path="/sor/workspace/:id" element={<SORWorkspace />} />
                        <Route path="/payments" element={<PaymentList />} />

                        {/* Operations */}
                        <Route path="/production" element={<Production />} />
                        <Route path="/forecasting" element={<Forecasting />} />
                        <Route path="/receive" element={<MaterialReceive />} />
                        <Route path="/dispatch" element={<MaterialDispatch />} />

                        {/* Admin & Support */}
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/settings" element={<Admin />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/tickets" element={<AdminTickets />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/settings" element={<SettingsPage />} />

                        {/* Default redirect to home */}
                        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
