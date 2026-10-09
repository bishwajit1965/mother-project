import { useAuth } from "../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth() as {
    user?: {
      name?: string;
      email?: string;
      role?: "ADMIN" | "USER" | string;
    } | null;
  };

  const userLabel = user
    ? `Logged in as ${user.name || user.email}`
    : "Not logged in";

  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-8 gap-4">
      <div className="lg:col-span-8 col-span-12 space-y-4">
        <h1 className="text-3xl font-bold">Home Page Left Column</h1>
        <p>
          Left Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          neque debitis ipsam eligendi fugiat laborum unde dignissimos, dicta
          sit quidem nisi minima eos laudantium modi illo. Ea maxime excepturi
          magni?
        </p>
        <p>{userLabel}</p>
        <p>
          {user ? `Logged in as ${user.name || user.email}` : "Not logged in"}
        </p>
        <p>
          {user && user.role === "ADMIN"
            ? "You are an admin"
            : "You are not an admin"}
        </p>
        <p>
          {user ? (
            <span>Logged in with access to additional features.</span>
          ) : (
            <span>Please log in to access more features.</span>
          )}
        </p>
      </div>
      <div className="lg:col-span-4 col-span-12 space-y-4">
        <h1 className="text-3xl font-bold">Home Page Right Column</h1>
        <p>
          Right Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Praesentium dolores blanditiis maiores saepe inventore officia
          sapiente minima dignissimos ut aliquid provident, ea cum doloribus sit
          veniam ab corrupti, ipsa iste!
        </p>
      </div>
    </div>
  );
};

export default Home;
