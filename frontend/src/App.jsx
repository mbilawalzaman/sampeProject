import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import DashboardPage from "./pages/dashboard";
import ProtectedRoute from "./middleware";
import SignupPage from "./pages/signupPage";
import ClerkCallbackHandler from "./components/ClerkCallbackHandler"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/" element={<LoginPage />} /> */}
          {/* Protected Route */}
          {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
            <DashboardPage />
            </ProtectedRoute>
            }
            /> */}
          {/* Clerk OAuth Callback Route */}
          {/* <Route path="/sign-in-callback" element={<ClerkCallbackHandler />} /> */}
        </Routes>
      </Router>

    </>

  );
}

export default App;
