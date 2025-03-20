import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "./socket"; // ✅ Import the WebSocket instance

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [redirectError, setRedirectError] = useState(null);

  useEffect(() => {
    if (location.state?.reason === "pleaseLogin") {
      setRedirectError("Please log in to access this page.");
      const timer = setTimeout(() => setRedirectError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const handleNotification = (data) => {
      console.log("🔔 Notification Received:", data);
      toast[data.type](data.message); // ✅ Show only one toast
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification); // ✅ Prevent duplicate listeners
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid email or password");

      localStorage.setItem("token", data.token);
      console.log("📩 Notification received:", data);
      toast.success(data.message); // ✅ Use toast to show success

      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {redirectError && <div className="text-red-500 text-center mb-4">{redirectError}</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {message && <div className="text-green-500 text-center mb-4">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-2 bg-blue-500 text-white font-semibold rounded-lg focus:outline-none ${loading ? "opacity-50" : ""}`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
