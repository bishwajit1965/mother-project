import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const { user, logout } = useAuth() as { user?: unknown; logout: () => void };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-center bg-base-300 sticky top-0">
      NavBar
      <ul className="menu menu-horizontal px-1">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
      <ul className="menu menu-horizontal px-1">
        {user ? (
          <>
            <li>
              <a href="/auth/profile">Profile</a>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/auth/login">Login</a>
            </li>
            <li>
              <a href="/auth/register">Register</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default NavBar;
