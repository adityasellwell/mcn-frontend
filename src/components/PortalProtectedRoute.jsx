import { Navigate } from "react-router-dom";
import { usePortalAuth } from "../context/PortalAuthContext";

const PortalProtectedRoute = ({ children }) => {
  const { portalUser, loading } = usePortalAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1526]">
        <p className="text-[#6b7ea3]">Loading...</p>
      </div>
    );
  }

  if (!portalUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PortalProtectedRoute;
