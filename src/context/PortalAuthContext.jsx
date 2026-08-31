import { createContext, useContext, useState, useEffect } from "react";

const PortalAuthContext = createContext(null);

// ─── Separate from AuthContext.jsx (admin) — own state name, own
// localStorage keys, mounted alongside AuthProvider in main.jsx. Member
// and Visitor sessions both live here, distinguished by `role`. ───
export const PortalAuthProvider = ({ children }) => {
  const [portalUser, setPortalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("mcn_portal_user");
    const token = localStorage.getItem("mcn_portal_token");
    if (stored && token) {
      setPortalUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("mcn_portal_user", JSON.stringify(userData));
    localStorage.setItem("mcn_portal_token", token);
    setPortalUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("mcn_portal_user");
    localStorage.removeItem("mcn_portal_token");
    setPortalUser(null);
  };

  return (
    <PortalAuthContext.Provider value={{ portalUser, login, logout, loading }}>
      {children}
    </PortalAuthContext.Provider>
  );
};

export const usePortalAuth = () => useContext(PortalAuthContext);
