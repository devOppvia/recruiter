import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Handles routes that require authentication.
 * If no access token exists, redirect to /sign-in while preserving the intended destination.
 */
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
