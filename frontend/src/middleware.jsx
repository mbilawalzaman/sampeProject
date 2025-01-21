import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/users/session-check",
      {
        credentials: "include", // Include cookies for session-based authentication
      },
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

  if (authStatus === null) {
    return <div>Loading...</div>; // Show a loading indicator while checking the session
  }

  // If session is invalid, redirect to the login page
  return authStatus ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
