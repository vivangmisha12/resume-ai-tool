import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getAccessToken, isTokenExpired } from "../utils/authHelpers";

// Protecting route and checking authentication
const ProtectedRoute = ({ children }) => {
  const token = getAccessToken(); // Get token from cookies
  const isValid = token && !isTokenExpired(token); // Check if token is valid and not expired
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Check Redux store for authentication status

  if (!token || !isValid || !isAuthenticated) {
    // If no token, token expired, or user not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  return children; // If valid, render the protected content
};

export default ProtectedRoute;
