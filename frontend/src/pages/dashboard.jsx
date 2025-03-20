import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "../components/jobTable";
import ApplicationTable from "../components/applicationTable";
import { FiSearch, FiFilter, FiLogOut, FiBell } from "react-icons/fi";
import socket from "./socket";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionRes = await fetch("http://localhost:5000/api/users/session-check", {
          credentials: "include",
        });

        if (!sessionRes.ok) throw new Error("Failed to verify session");
        const sessionData = await sessionRes.json();

        if (!sessionData?.user?.id) {
          throw new Error("User ID not found in session");
        }

        const userRes = await fetch(`http://localhost:5000/api/users/${sessionData.user.id}`, {
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("Failed to fetch user data");
        setUser(await userRes.json());
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/signin");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    console.log("🚀 dashboard - Initializing WebSocket connection...");

    const handleNotification = (data) => {
      console.log("📩 dashboard - Notification received:", data);
      setNotifications(prev => [...prev, {
        ...data,
        timestamp: data.timestamp || Date.now()
      }]);
    };

    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("✅ dashboard - WebSocket connected with ID:", socket.id);
    });

    socket.on("notification", handleNotification);

    return () => {
      socket.off("connect");
      socket.off("notification", handleNotification);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");
      window.location.reload();
      navigate("/signin");

    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">{user.name}</h2>
        <nav className="space-y-4">
          {["dashboard", "jobs", "applications", "users", "settings", "notifications"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`block w-full text-left px-4 py-2 rounded-md ${activeSection === section
                ? "bg-blue-100 text-blue-700 font-bold"
                : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {section === "notifications" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBell />
                    Notifications
                  </div>
                  {notifications.length > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {notifications.length}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  {section === "dashboard" && "🚀 Dashboard"}
                  {section === "jobs" && "📄 Jobs"}
                  {section === "applications" && "📑 Applications"}
                  {section === "users" && "👤 Users"}
                  {section === "settings" && "⚙️ Settings"}
                </>
              )}
            </button>
          ))}
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
          <h1 className="text-2xl font-bold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
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

        {/* Dynamic Content */}
        {activeSection === "dashboard" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">You have {notifications.length} unread notifications</p>
          </div>
        )}

        {activeSection === "jobs" && <JobTable userRole={user.role} userId={user.id} />}

        {activeSection === "applications" && <ApplicationTable userRole={user.role} />}

        {activeSection === "notifications" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                🔔 Notifications ({notifications.length})
              </h2>
              <button
                onClick={() => setNotifications([])}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notif, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">🔔</span>
                      <div className="flex-1">
                        <p className="font-medium">{notif.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(notif.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No notifications to display
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;