import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/users/session-check",
      {
        credentials: "include", // Include cookies for session-based authentication
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.isAuthenticated; // Return the session status
  } catch (error) {
    console.error("Error checking session:", error);
    return false; // Treat errors as unauthenticated
  }
};

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuthStatus(result);
    };

    // Initial session check
    checkAuth();

    // Set up an interval to periodically check the session status
    const interval = setInterval(() => {
      checkAuth();
    }, 5000); // Check every 5 seconds (adjust as needed)

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // If session is invalid, redirect to the login page with a state
  if (authStatus === false) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: "protected", reason: "pleaseLogin" }}
      />
    );
  }

  return authStatus ? children : null; // Render children if authenticated
};

export default ProtectedRoute;
