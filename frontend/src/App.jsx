import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useAuthStore from "./store/authStore";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";

import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";

function App() {
  useEffect(() => {
    useAuthStore.getState().getMe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/transactions" element={<Transactions />} />

        <Route path="/analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
