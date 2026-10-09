import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LucideEye,
  LucideEyeClosed,
  LucideKeyRound,
  LucideLogIn,
  LucideUsers,
} from "lucide-react";

type LoginResponse = {
  success: boolean;
  message?: string;
  user?: {
    role?: "ADMIN" | "USER" | string;
  };
};

const Login = () => {
  const location = useLocation();
  const verifiedEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const passwordResetMessage =
    (location.state as { message?: string } | null)?.message ?? "";
  const [email, setEmail] = useState(verifiedEmail);
  const [password, setPassword] = useState("");
  const [readPassword, setReadPassword] = useState(false);
  const [message, setMessage] = useState(passwordResetMessage);
  const navigate = useNavigate();

  const auth = useAuth() as {
    authReady?: boolean;
    login: (credentials: {
      email: string;
      password: string;
    }) => Promise<LoginResponse>;
    user?: {
      name?: string;
      email?: string;
      role?: "ADMIN" | "USER" | string;
    };
    logout: () => Promise<void>;
  };

  const { authReady, login } = auth;
  console.log("AUTH CONTEXT:", auth);

  const toggleReadPassword = () => {
    setReadPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      email,
      password,
    });

    const res = await login({
      email,
      password,
    });

    if (res.success) {
      setEmail("");
      setPassword("");
      // setMessage("Logged in successfully!");
      console.log("User Role in Login", res.user);
      if (res?.user && res?.user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setMessage(res.message || "Login failed. Please try again.");
    }
  };
  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      {!authReady && (
        <p className="text-red-500 font-bold">
          Authentication is not ready yet. Please wait...
        </p>
      )}

      <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
        <LucideLogIn className="w-4 h-4" />
        Login Page
      </h1>

      {message && <p className="text-green-500 font-bold">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="lg:max-w-xl mx-auto w-full space-y-4"
      >
        <div className="w-full space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        <div className="w-full relative">
          <input
            type={readPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={toggleReadPassword}
          >
            {readPassword ? (
              <LucideEyeClosed size={16} />
            ) : (
              <LucideEye size={16} />
            )}
          </button>
        </div>
        <div className="grid gap-2 w-full">
          <div className="w-full">
            <button type="submit" className="btn btn-sm btn-primary w-full">
              <LucideLogIn className="w-5 h-5" /> Login
            </button>
          </div>
          <div className="lg:flex grid items-center justify-between gap-2">
            <Link
              to="/auth/forgot-password"
              className="m-0 text-sm text-indigo-500 hover:link flex items-center gap-0.5"
            >
              Forgot Password ? <LucideKeyRound size={14} />
              Change
            </Link>{" "}
            <Link
              to="/auth/register"
              className="m-0 text-sm text-indigo-500 hover:link flex items-center gap-0.5"
            >
              <LucideUsers className="w-4 h-4" />
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
