import { Navigate } from "react-router-dom";
import { usePortalAuth } from "../context/PortalAuthContext";

const PortalGuestRoute = ({ children }) => {
  const { portalUser, loading } = usePortalAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (portalUser) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return children;
};

export default PortalGuestRoute;
