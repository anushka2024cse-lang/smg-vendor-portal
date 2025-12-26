import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import DashboardLayout from './global/components/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import HomePage from './pages/Home/HomePage';
import VendorDetails from './pages/VendorDetails/VendorDetails';
import MaterialReceive from './pages/MaterialReceive/MaterialReceive';
import MaterialDispatch from './pages/MaterialDispatch/MaterialDispatch';
import Production from './pages/Production/Production';
const DiePlan = lazy(() => import('./pages/Production/DiePlan'));
import Forecasting from './pages/Forecasting/Forecasting';
// Lazy load heavy admin components
const Admin = lazy(() => import('./pages/Admin/Admin'));
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'));
const AdminTickets = lazy(() => import('./pages/Admin/AdminTickets'));
const AdminNotifications = lazy(() => import('./pages/Admin/AdminNotifications'));
import Support from './pages/Support/Support';
import Inventory from './pages/Inventory/Inventory';
import Models from './pages/Models/Models';
import ComponentDetails from './pages/ComponentDetails/ComponentDetails';
import VendorList from './pages/Vendor/VendorList';
import VendorOnboarding from './pages/Vendor/VendorOnboarding';
import VendorOnboardingReplica from './pages/Vendor/VendorOnboardingReplica';
import PurchaseOrderList from './pages/Procurement/PurchaseOrderList';
import PurchaseOrderCreate from './pages/Procurement/PurchaseOrderCreate';
import SORWorkspace from './pages/Procurement/SOR/SORWorkspace';
import CreateSor from './pages/Procurement/SOR/CreateSor';
import SORList from './pages/Procurement/SOR/SORList';
import PurchaseOrderCreateReplica from './pages/Procurement/PurchaseOrderCreateReplica';
import SettingsPage from './pages/Settings/SettingsPage';
import PaymentList from './pages/Payments/PaymentList';
const SparePartRequests = lazy(() => import('./pages/Requests/SparePartRequests'));
// HSRP and RSA being removed per user requirement
const HSRPRequests = lazy(() => import('./pages/Requests/HSRPRequests'));
const RSARequests = lazy(() => import('./pages/Requests/RSARequests'));
// Lazy load warranty components
const WarrantyClaimsList = lazy(() => import('./pages/WarrantyClaims/WarrantyClaimsList'));
const WarrantyClaimForm = lazy(() => import('./pages/WarrantyClaims/WarrantyClaimForm'));
const WarrantyClaimDetails = lazy(() => import('./pages/WarrantyClaims/WarrantyClaimDetails'));
import OrderHistory from './pages/Orders/OrderHistory';
import CertificateList from './pages/Certificates/CertificateList';

import ProtectedRoute from './global/components/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
);

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
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
                                <Route path="/vendor/onboarding" element={<VendorOnboardingReplica />} />
                                <Route path="/vendor/onboarding-old" element={<VendorOnboarding />} />
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
                                <Route path="/orders" element={<OrderHistory />} />
                                <Route path="/certificates" element={<CertificateList />} />

                                {/* Operations */}
                                <Route path="/production" element={<Production />} />
                                <Route path="/production/die-plan" element={<DiePlan />} />
                                <Route path="/forecasting" element={<Forecasting />} />
                                <Route path="/receive" element={<MaterialReceive />} />
                                <Route path="/dispatch" element={<MaterialDispatch />} />

                                {/* Admin & Support */}
                                <Route path="/admin" element={<Admin />} />
                                <Route path="/admin/settings" element={<Admin />} />
                                <Route path="/admin/users" element={<AdminUsers />} />
                                <Route path="/admin/tickets" element={<AdminTickets />} />
                                <Route path="/admin/notifications" element={<AdminNotifications />} />

                                <Route path="/requests/spare-parts" element={<SparePartRequests />} />
                                <Route path="/requests/hsrp" element={<HSRPRequests />} />
                                <Route path="/requests/rsa" element={<RSARequests />} />

                                {/* Warranty Claims */}
                                <Route path="/warranty-claims" element={<WarrantyClaimsList />} />
                                <Route path="/warranty-claims/create" element={<WarrantyClaimForm />} />
                                <Route path="/warranty-claims/:id/edit" element={<WarrantyClaimForm />} />
                                <Route path="/warranty-claims/:id" element={<WarrantyClaimDetails />} />

                                <Route path="/support" element={<Support />} />
                                <Route path="/settings" element={<SettingsPage />} />

                                {/* Default redirect to home */}
                                <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
