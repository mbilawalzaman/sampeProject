import React from "react";
import { Navigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode"; // Updated import

// Authentication check with token expiration validation
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Decode the token to check its expiration
    const decodedToken = jwt_decode.default(token); // Accessing the default export
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      // If token is expired, remove it from localStorage
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    localStorage.removeItem("token"); // Remove invalid token
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
