import { NavLink, useNavigate } from "react-router-dom";
import { usePortalAuth } from "../../context/PortalAuthContext";
import { logoutPortal } from "../../services/portalAuthService";
import {
  LayoutDashboard,
  CalendarDays,
  Handshake,
  UserPlus,
  UserCircle2,
  LogOut,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

const PortalSidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const { portalUser, logout } = usePortalAuth();
  const navigate = useNavigate();
  const isMember = portalUser?.role === "MEMBER";

  const handleLogout = async () => {
    try {
      await logoutPortal();
    } catch {
      // still clear local session even if the server call fails
    }
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/portal/dashboard", icon: LayoutDashboard },
    { name: "My Meetings", path: "/portal/meetings", icon: CalendarDays },
    ...(isMember
      ? [
          { name: "Referrals", path: "/portal/referrals", icon: Handshake },
          { name: "Invite Someone", path: "/portal/invite", icon: UserPlus },
        ]
      : []),
    { name: "My Profile", path: "/portal/profile", icon: UserCircle2 },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-40 ${isCollapsed ? "w-20" : "w-60"} h-[calc(100vh-4rem)] bg-zinc-900 border-r border-zinc-800 flex flex-col transition-[width,transform] duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="px-4 pl-6 py-2 flex items-center justify-between">
        {!isCollapsed && (
          <p className="uppercase tracking-[0.15em] text-zinc-500 font-semibold text-xs">
            My Portal
          </p>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-white"
        >
          <ArrowLeft
            size={18}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {portalUser?.impersonated && !isCollapsed && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs flex items-center gap-2">
          <ShieldAlert size={14} className="shrink-0" />
          Viewing as admin
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={({ isActive }) =>
                `group relative flex items-center ${isCollapsed ? "justify-center px-2" : "gap-3 px-3.5"} gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#0C831F] hover:bg-[#0A6F1A] text-white shadow-lg shadow-[#0C831F]/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-white/90" />
                  )}
                  <Icon
                    size={18}
                    className={
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-white transition-colors"
                    }
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 text-sm font-medium py-2.5 rounded-lg border border-zinc-700 transition-all"
        >
          <LogOut size={16} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default PortalSidebar;
