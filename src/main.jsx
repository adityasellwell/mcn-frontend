import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { PortalAuthProvider } from "./context/PortalAuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PortalAuthProvider>
          <ThemeProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </ThemeProvider>
        </PortalAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);