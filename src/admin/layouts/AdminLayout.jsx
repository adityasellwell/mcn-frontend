import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Full screen wrapper — dark background everywhere
    <div className="min-h-screen w-full bg-[#0d1526]">

      {/* Fixed top header */}
      <AdminHeader onToggleSidebar={() => setIsOpen(!isOpen)} />

      {/* Fixed left sidebar */}
      <AdminSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content — pushed right by sidebar width, pushed down by header height */}
      <main
        className={`
          min-h-screen
          bg-[#0d1526]
          pt-16
          transition-all
          duration-300
          ${isCollapsed ? "lg:pl-20" : "lg:pl-60"}
        `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;