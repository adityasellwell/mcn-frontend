import { Bell, Menu, UserCircle } from "lucide-react";
import { usePortalAuth } from "../../context/PortalAuthContext";

const PortalHeader = ({ onToggleSidebar }) => {
  const { portalUser } = usePortalAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950 border-b border-zinc-800 px-4 lg:px-6">
      <div className="h-full flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-zinc-800 transition"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#0C831F] flex items-center justify-center shadow-lg shadow-[#0C831F]/20 ring-1 ring-white/10">
              <span className="text-white font-bold text-sm tracking-tight">M</span>
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-white tracking-tight">
                Member Portal
              </h1>
              <p className="hidden sm:block text-[11px] text-zinc-400 -mt-0.5">
                Welcome back, {portalUser?.name || "there"}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Bell size={19} />
          </button>

          <div className="flex items-center gap-3 pl-3 sm:pl-4 ml-1 border-l border-zinc-800">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white leading-tight">
                {portalUser?.name || "Portal User"}
              </p>
              <p className="text-[11px] text-zinc-400 capitalize">
                {portalUser?.role?.toLowerCase() || ""}
              </p>
            </div>
            <UserCircle size={34} className="text-[#0C831F]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
