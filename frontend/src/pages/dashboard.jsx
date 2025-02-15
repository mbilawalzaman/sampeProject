import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "../components/jobTable"; // Import the JobTable component

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First, check session to get the user's ID
        const sessionRes = await fetch("http://localhost:5000/api/users/session-check", {
          credentials: "include",
        });
  
        if (!sessionRes.ok) throw new Error("Failed to check session");
  
        const sessionData = await sessionRes.json();
        const userId = sessionData.user?.id; // Assuming session-check returns user info
  
        if (!userId) throw new Error("User ID not found in session");
  
        // Now, fetch user details using the ID
        const userRes = await fetch(`http://localhost:5000/api/users/${userId}`, {
          credentials: "include",
        });
  
        if (!userRes.ok) throw new Error("Failed to fetch user data");
  
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/");
      }
    };
  
    fetchUser();
  }, [navigate]);
  

  // Logout function
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <div>Loading...</div>; // Show a loading state

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <JobTable userRole={user.role} userId={user.id} /> {/* Pass role & ID */}
    </div>
  );
};

export default DashboardPage;
