import useAuthStore from "../../store/authStore";

const Navbar = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
            <div>
                <h2 className="text-xl font-semibold">
                    Welcome back 👋
                </h2>

                <p className="text-sm text-gray-500">
                    Manage your finances efficiently.
                </p>
            </div>

            <div className="text-right">
                <p className="font-medium">
                    {user?.name || "User"}
                </p>

                <p className="text-sm text-gray-500">
                    {user?.email}
                </p>
            </div>
        </header>
    );
};

export default Navbar;