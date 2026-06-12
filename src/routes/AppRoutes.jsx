import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../website/pages/Home";
import Login from "../website/pages/Login";
import Register from "../website/pages/Register";
import AuthLayout from "../website/layouts/AuthLayout";
import AdminLayout from "../admin/layouts/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import AdminLogin from "../admin/pages/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
import Applications from "../admin/pages/Applications";
import Chapters from "../admin/pages/Chapters";
import Meetings from "../admin/pages/Meetings";
import Members from "../admin/pages/Members";
import Visitors from "../admin/pages/Visitors";
import Payments from "../admin/pages/Payments";
import Attendance from "../admin/pages/Attendance";
import Referrals from "../admin/pages/Referrals";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Website */}
      <Route path="/" element={<Home />} />

      {/* Website Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Login — only accessible if NOT logged in */}
      <Route
        path="/admin"
        element={
          <GuestRoute>
            <AdminLogin />
          </GuestRoute>
        }
      />

      {/* Admin Panel — only accessible if logged in */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="chapters" element={<Chapters />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="members" element={<Members />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="payments" element={<Payments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="referrals" element={<Referrals />} />
      </Route>

      {/* Catch all unknown admin routes */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AppRoutes;