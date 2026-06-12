import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  UserPlus,
  CalendarDays,
  ClipboardCheck,
  Handshake,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  
  const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/login");
};

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Applications", path: "/admin/applications", icon: ClipboardList },
    { name: "Chapters", path: "/admin/chapters", icon: Building2 },
    { name: "Members", path: "/admin/members", icon: Users },
    { name: "Visitors", path: "/admin/visitors", icon: UserPlus },
    { name: "Meetings", path: "/admin/meetings", icon: CalendarDays },
    { name: "Attendance", path: "/admin/attendance", icon: ClipboardCheck },
    { name: "Referrals", path: "/admin/referrals", icon: Handshake },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "CMS", path: "/admin/cms", icon: FileText },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-40 ${isCollapsed ? "w-20" : "w-60"} h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0f1b3d] to-[#0a1430] border-r border-white/5 flex flex-col  transition-[width,transform] duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="px-4 pl-6 py-2 flex items-center justify-between">
        {!isCollapsed && (
          <p className="uppercase tracking-[0.15em] text-[#6b7ea3] font-semibold text-xs">
            Main Menu
          </p>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white"
        >
          <ArrowLeft
            size={18}
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={({ isActive }) =>
                `group relative flex items-center ${isCollapsed ? "justify-center px-2" : "gap-3 px-3.5"} gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#3b6fa0] to-[#2d5a85] text-white shadow-lg shadow-[#3b6fa0]/20"
                    : "text-[#a8b8d4] hover:text-white hover:bg-white/[0.06]"
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
                      isActive
                        ? "text-white"
                        : "text-[#6b7ea3] group-hover:text-white transition-colors"
                    }
                  />
                  <span className="">
                    {!isCollapsed && <span>{item.name}</span>}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-[#e8edf3] text-sm font-medium py-2.5 rounded-lg border border-white/10 transition-all"
          >
            <LogOut size={16} />
            {isCollapsed ? "" : "Logout"}
          </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
