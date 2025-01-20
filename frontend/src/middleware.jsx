import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

// Simulated authentication check with token expiration validation
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  // Decode the token to check its expiration
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000; // Current time in seconds

  if (decodedToken.exp < currentTime) {
    // If token is expired, remove it from localStorage
    localStorage.removeItem("token");
    return false;
  }

  return true;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
