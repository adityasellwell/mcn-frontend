import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../website/pages/Home";
import Login from "../website/pages/Login";
import Register from "../website/pages/Register";
import WebsiteMeetings from "../website/pages/Meetings";
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
import CMS from "../admin/pages/CMS";

// ─── Member/Visitor Portal ───
import PortalProtectedRoute from "../components/PortalProtectedRoute";
import PortalGuestRoute from "../components/PortalGuestRoute";
import PortalLayout from "../portal/layouts/PortalLayout";
import PortalDashboard from "../portal/pages/Dashboard";
import PortalProfile from "../portal/pages/Profile";
import PortalMeetings from "../portal/pages/Meetings";
import PortalReferrals from "../portal/pages/Referrals";
import PortalInvite from "../portal/pages/Invite";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Website */}
      <Route path="/" element={<Home />} />
      <Route path="/meetings" element={<WebsiteMeetings />} />

      {/* Website Auth */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PortalGuestRoute>
              <Login />
            </PortalGuestRoute>
          }
        />
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
        <Route path="cms" element={<CMS />} />
      </Route>

      {/* Catch all unknown admin routes */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      {/* Member/Visitor Portal — only accessible if logged in */}
      <Route
        path="/portal"
        element={
          <PortalProtectedRoute>
            <PortalLayout />
          </PortalProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PortalDashboard />} />
        <Route path="meetings" element={<PortalMeetings />} />
        <Route path="referrals" element={<PortalReferrals />} />
        <Route path="invite" element={<PortalInvite />} />
        <Route path="profile" element={<PortalProfile />} />
      </Route>

      {/* Catch all unknown portal routes */}
      <Route path="/portal/*" element={<Navigate to="/portal/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;