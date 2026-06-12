import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  LogOut,
  Wallet,
} from "lucide-react";

import useAuthStore from "../../store/authStore";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: Receipt,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

const Sidebar = ({ onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-full h-full bg-white/75 backdrop-blur-xl text-slate-900 flex flex-col border-r border-slate-200/40 shadow-[4px_0_24px_rgba(0,0,0,0.015)]">

      {/* Logo */}
      <div className="px-7 py-8 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white animate-float">
            <Wallet size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Finora
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
            </h1>
            <p className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">
              Financial Suite
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5">
        <p className="px-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">
          MAIN MENU
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/10 font-semibold translate-x-1"
                    : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-900 hover:translate-x-1 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-100 p-5 bg-slate-50/40">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-slate-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 hover:border-red-100 border border-transparent transition-all duration-300 font-semibold text-sm shadow-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;