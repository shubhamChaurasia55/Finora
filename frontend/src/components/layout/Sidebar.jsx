import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <aside className="w-64 min-h-screen bg-white border-r shadow-sm flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-600">
                    Finora
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Transactions
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Analytics
                </NavLink>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;