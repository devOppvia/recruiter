import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Handles routes that should ONLY be accessible when NOT authenticated.
 * If an access token exists, redirect to /dashboard.
 */
const PublicRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
