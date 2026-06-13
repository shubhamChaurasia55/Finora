import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  LogOut,
  Wallet,
  Target,
} from "lucide-react";

import useAuthStore from "../../store/authStore";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: Receipt },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Budgets", path: "/budgets", icon: Target },
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
    <aside className="w-full h-full bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Wallet size={17} />
          </div>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            Finora
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-semibold ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-slate-900 truncate leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1.5 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 font-semibold text-xs cursor-pointer"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;