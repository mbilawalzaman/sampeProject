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
    }, 30000); // Check every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle session refresh based on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (authStatus) {
        // Refresh session only if the user is authenticated
        checkAuth();
      }
    };

    const events = ["mousemove", "keydown", "scroll"];
    events.forEach((event) => window.addEventListener(event, handleUserActivity));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [authStatus]);

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

  // Display loading state during initial session check
  return authStatus === null ? (
    <div className="min-h-screen flex justify-center items-center">
      <p>Loading...</p>
    </div>
  ) : (
    children
  );
};

export default ProtectedRoute;
