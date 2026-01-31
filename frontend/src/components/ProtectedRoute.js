import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in → kick to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    // Manager routes require admin role
    if (requiredRole === "admin" && userRole !== "admin") {
      // Redirect employee trying to access manager routes
      return <Navigate to="/employee/requests/shift" replace />;
    }
    
    // Employee routes require employee role
    if (requiredRole === "employee" && userRole !== "employee") {
      // Redirect admin trying to access employee routes
      return <Navigate to="/manager/requests/leave" replace />;
    }
  }

  // Logged in with correct role → allow page
  return children;
}
