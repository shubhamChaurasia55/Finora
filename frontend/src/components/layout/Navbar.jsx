import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/budgets": "Budgets",
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 h-14 bg-white border-b border-slate-100">
      <div className="h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-500 transition cursor-pointer"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-sm font-bold text-slate-900">{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <Bell size={16} />
          </button>
          <div className="hidden md:block w-px h-5 bg-slate-100 mx-0.5" />
          <p className="hidden md:block text-[11px] font-medium text-slate-400">
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;