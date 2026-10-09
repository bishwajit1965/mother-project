import { useAuth } from "../../hooks/useAuth";

const AdminNavbar = () => {
  const auth = useAuth() as { logout?: () => void };

  const handleLogout = () => {
    auth.logout?.();
  };
  return (
    <div className="bg-gray-200 text-gray-800 shadow-sm border-b border-gray-300 px-4 py-1.5 sticky top-0 z-50 flex items-center justify-between">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <ul className="menu menu-horizontal px-1">
        <li>
          <a href="/admin/dashboard">Dashboard</a>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavbar;
