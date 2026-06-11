import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const isLoading = useAuthStore(
        (state) => state.isLoading
    );

    // Still checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-medium">
                    Loading...
                </p>
            </div>
        );
    }

    // User is not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated
    return children;
};

export default ProtectedRoute;