import { LucideLoader } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, authReady, loading } = useAuth() as {
    user?: {
      role?: "ADMIN" | "USER" | string;
    };
    authReady: boolean;
    loading: boolean;
  };
  const location = useLocation();

  if (loading || !authReady) {
    return (
      <LucideLoader className="w-8 h-8 text-blue-500 animate-spin flex mx-auto justify-center items-center" />
    );
  }

  if (!authReady && !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
