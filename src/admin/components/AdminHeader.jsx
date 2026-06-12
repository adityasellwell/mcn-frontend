import { Bell, Settings, Menu, UserCircle } from "lucide-react";

const AdminHeader = ({ onToggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-[#0f1b3d] via-[#13234a] to-[#1e3a5f] border-b border-white/5 shadow-[0_4px_20px_-8px_rgba(15,27,61,0.4)] px-4 lg:px-6">
      <div className="h-full flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#3b6fa0] to-[#1e3a5f] flex items-center justify-center shadow-lg shadow-[#3b6fa0]/20 ring-1 ring-white/10">
              <span className="text-white font-bold text-sm tracking-tight">M</span>
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-white tracking-tight">
                Dashboard
              </h1>
              <p className="hidden sm:block text-[11px] text-[#a8b8d4] -mt-0.5">
                Welcome back, Admin
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="relative p-2 rounded-lg text-[#a8b8d4] hover:text-white hover:bg-white/10 transition">
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#3b6fa0] rounded-full ring-2 ring-[#13234a]" />
          </button>

          {/* <button className="p-2 rounded-lg text-[#a8b8d4] hover:text-white hover:bg-white/10 transition">
            <Settings size={19} />
          </button> */}

          <div className="flex items-center gap-3 pl-3 sm:pl-4 ml-1 border-l border-white/10">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white leading-tight">Super Admin</p>
              <p className="text-[11px] text-[#a8b8d4]">MCN Management</p>
            </div>
            <UserCircle size={34} className="text-[#3b6fa0]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
