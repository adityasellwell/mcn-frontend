import { useState } from "react";
import { Outlet } from "react-router-dom";
import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

const PortalLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      <PortalHeader onToggleSidebar={() => setIsOpen(!isOpen)} />

      <PortalSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        className={`
          min-h-screen
          bg-zinc-950
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

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PortalLayout;
