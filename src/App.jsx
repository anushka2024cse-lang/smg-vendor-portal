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
import VendorPortal from './pages/VendorPortal/VendorPortal';
import Admin from './pages/Admin/Admin';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminTickets from './pages/Admin/AdminTickets';
import Support from './pages/Support/Support';
import Inventory from './pages/Inventory/Inventory';
import Models from './pages/Models/Models';
import ComponentDetails from './pages/ComponentDetails/ComponentDetails';

import ThemeToggle from './components/ThemeToggle';

function App() {
    return (
        <BrowserRouter>
            <ThemeToggle />
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Dashboard Layout Routes */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard/home" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/dashboard/dashboard" element={<DashboardHome />} />
                    <Route path="/models" element={<Models />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/component-details" element={<ComponentDetails />} />

                    <Route path="/vendor-details" element={<VendorDetails />} />
                    <Route path="/production" element={<Production />} />
                    <Route path="/forecasting" element={<Forecasting />} />

                    <Route path="/receive" element={<MaterialReceive />} />
                    <Route path="/dispatch" element={<MaterialDispatch />} />

                    <Route path="/vendor-portal" element={<VendorPortal />} />

                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/settings" element={<Admin />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/tickets" element={<AdminTickets />} />
                    <Route path="/support" element={<Support />} />

                    {/* Default redirect to home */}
                    <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
