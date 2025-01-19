import React from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "../components/userTable"; // Import the UserTable component

const DashboardPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Check if the user is logged in by checking for the JWT token in localStorage
  const token = localStorage.getItem("token");

  // If the token is not available, redirect to the login page
  if (!token) {
    navigate("/"); // Use navigate to redirect to the login page if not logged in
  }

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Send a POST request to the logout API to destroy the session
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include", // Important to include cookies for session handling
      });

      // Clear the localStorage (optional if you want to manage it here)
      localStorage.clear();

      // Redirect the user to the login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">User Dashboard</h1>
      <div className="text-right mb-4">
        <button
          onClick={handleLogout} // Call handleLogout when the button is clicked
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <UserTable /> {/* Render the UserTable component */}
    </div>
  );
};

export default DashboardPage;
