import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, loaded } = useSelector((state) => state.user);

  // ⏳ Wait for auth check to finish
  if (!loaded || loading) {
    return <p>Checking authentication...</p>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
