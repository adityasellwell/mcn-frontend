import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("mcn_admin");
    const token = localStorage.getItem("mcn_token");
    if (stored && token) {
      setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem("mcn_admin", JSON.stringify(adminData));
    localStorage.setItem("mcn_token", token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("mcn_admin");
    localStorage.removeItem("mcn_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);