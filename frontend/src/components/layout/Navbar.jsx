import useAuthStore from "../../store/authStore";
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
} from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const user = useAuthStore(
    (state) => state.user
  );

  const firstName =
    user?.name?.split(" ")[0] || "User";

  return (
    <header
      className="
        sticky top-0 z-20
        h-20
        glass
        border-b border-slate-200/30
      "
    >
      <div className="h-full px-6 md:px-8 flex items-center justify-between">

        {/* Left Area (Toggle + Greeting) */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100 text-slate-600 transition shrink-0 cursor-pointer"
          >
            <Menu size={18} />
          </button>

          <div className="animate-fade-in-up min-w-0">
            <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest leading-none">
              Overview
            </p>

            <h1 className="text-base md:text-xl font-bold text-slate-900 mt-1 tracking-tight truncate">
              Welcome, <span className="text-gradient font-bold">{firstName}</span> ✨
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <div
            className="
              hidden md:flex
              items-center gap-3
              w-72
              px-4 py-2.5
              rounded-2xl
              bg-slate-50/80
              border border-slate-200/50
              focus-within:border-indigo-500/80
              focus-within:ring-4
              focus-within:ring-indigo-500/10
              transition-all
              duration-300
            "
          >
            <Search
              size={16}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search financials..."
              className="
                bg-transparent
                outline-none
                text-sm
                flex-1
                placeholder:text-slate-400
                text-slate-800
              "
            />
          </div>

          {/* Notifications */}
          <button
            className="
              relative
              w-11 h-11
              rounded-2xl
              bg-slate-50/80
              border border-slate-200/50
              flex items-center justify-center
              hover:bg-slate-100/80
              hover:border-slate-300/60
              focus:ring-4
              focus:ring-slate-100
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <Bell
              size={18}
              className="text-slate-600"
            />

            <span
              className="
                absolute
                top-3 right-3
                w-2 h-2
                rounded-full
                bg-indigo-600
                animate-pulse
              "
            />
          </button>

          {/* Profile */}
          <div
            className="
              flex items-center gap-3
              pl-2 pr-4 py-1.5
              rounded-2xl
              bg-slate-50/50
              border border-slate-200/40
              hover:bg-slate-100/50
              hover:border-slate-200
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <div
              className="
                w-9 h-9
                rounded-xl
                bg-gradient-to-tr from-indigo-500 to-violet-600
                text-white
                flex items-center justify-center
                font-bold
                text-sm
                shadow-md shadow-indigo-500/20
              "
            >
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {user?.name || "User"}
              </p>

              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                {user?.email}
              </p>
            </div>

            <ChevronDown
              size={14}
              className="text-slate-400"
            />
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;