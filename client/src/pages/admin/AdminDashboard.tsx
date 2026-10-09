import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  type AuthUser = {
    role?: string;
  };

  const auth = useAuth() as {
    user?: AuthUser;
    authReady?: boolean;
    loading?: boolean;
  };
  const { user } = auth;

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p>Hello, {user?.role || "User"}!</p>

      <p>
        {`Welcome ${user?.role || "User"}! Please wait while we load your dashboard.`}
      </p>
    </div>
  );
};

export default AdminDashboard;
