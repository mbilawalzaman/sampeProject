import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "../components/jobTable";
import ApplicationTable from "../components/applicationTable";
import { FiSearch, FiFilter, FiLogOut } from "react-icons/fi";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionRes = await fetch("http://localhost:5000/api/users/session-check", {
          credentials: "include",
        });

        if (!sessionRes.ok) throw new Error("Failed to check session");

        const sessionData = await sessionRes.json();
        const userId = sessionData.user?.id;

        if (!userId) throw new Error("User ID not found in session");

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

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">{user?.name}</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`block w-full text-left text-gray-700 hover:text-blue-500 ${activeSection === "dashboard" ? "font-bold text-blue-600" : ""}`}
          >
            🚀 Dashboard
          </button>
          <button
            onClick={() => setActiveSection("jobs")}
            className={`block w-full text-left text-gray-700 hover:text-blue-500 ${activeSection === "jobs" ? "font-bold text-blue-600" : ""}`}
          >
            📄 Jobs
          </button>
          <button
            onClick={() => setActiveSection("applications")}
            className={`block w-full text-left text-gray-700 hover:text-blue-500 ${activeSection === "applications" ? "font-bold text-blue-600" : ""}`}
          >
            📑 Applications
          </button>
          <button
            onClick={() => setActiveSection("users")}
            className={`block w-full text-left text-gray-700 hover:text-blue-500 ${activeSection === "users" ? "font-bold text-blue-600" : ""}`}
          >
            👤 Users
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`block w-full text-left text-gray-700 hover:text-blue-500 ${activeSection === "settings" ? "font-bold text-blue-600" : ""}`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <div className="relative">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Selected Section */}
        {activeSection === "dashboard" && <h2 className="text-xl font-bold">Welcome, {user.name}!</h2>}
        {activeSection === "jobs" && (
          <div>
            <h2 className="text-xl font-bold mb-4">📋 Job Listings</h2>
            <JobTable userRole={user.role} userId={user.id} />
          </div>
        )}
        {activeSection === "applications" && (
          <div>
            <h2 className="text-xl font-bold mb-4">📑 Application Listings</h2>
            <ApplicationTable userRole={user.role} />
          </div>
        )}
        {activeSection === "users" && <h2 className="text-xl font-bold">👤 User Management (Coming Soon)</h2>}
        {activeSection === "settings" && <h2 className="text-xl font-bold">⚙️ Settings (Coming Soon)</h2>}
      </div>
    </div>
  );
};

export default DashboardPage;
