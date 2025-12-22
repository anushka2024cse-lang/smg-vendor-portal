import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const ProtectedRoute = () => {
    const token = authService.getToken();
    const location = useLocation();

    // Optional: Add logic to verify token validity (expiry) here if JWT structure allows
    // For now, simpler existence check is sufficient for Phase 1

    if (!token) {
        // Redirect to login, but save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
