import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = authService.getToken();
    const location = useLocation();

    // Get role
    const user = authService.getCurrentUser();
    const role = user?.role || localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
