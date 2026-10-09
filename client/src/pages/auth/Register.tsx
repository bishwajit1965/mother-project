import {
  LucideEye,
  LucideEyeClosed,
  LucideLogIn,
  LucideUsers,
  LucideUsers2,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const location = useLocation();
  const initialEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [readPassword, setReadPassword] = useState(false);
  const navigate = useNavigate();

  const toggleReadPassword = () => {
    setReadPassword((prev) => !prev);
  };

  const auth = useAuth() as {
    authReady?: boolean;
    register: (credentials: {
      name: string;
      email: string;
      password: string;
      avatar: string;
    }) => Promise<{
      success: boolean;
      message: string;
    }>;
    user?: {
      name?: string;
      email?: string;
      role?: "ADMIN" | "USER" | string;
      avatar?: string;
    };
    logout: () => Promise<void>;
  };
  const { register } = auth;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await register({
        name,
        email,
        password,
        avatar: avatar,
      });

      if (res.success) {
        setName("");
        setEmail("");
        setPassword("");
        setAvatar("");
        setMessage("Registered successfully! Please login.");
        navigate("/auth/verify-email", {
          state: { email },
        });
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setMessage(apiError?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold justify-center border-b border-gray-300 pb-2 flex items-center gap-2">
          <LucideUsers className="w-4 h-4" />
          Register
        </h1>
      </div>

      <p>
        {message && <span className="text-green-500 font-bold">{message}</span>}
      </p>

      <form
        className="lg:max-w-xl mx-auto w-full space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="w-full space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
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

        <div className="w-full">
          <input
            type="text"
            placeholder="Avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        <div className="w-full">
          <div className="lg:flex grid items-center justify-between  gap-2">
            <button
              type="submit"
              className="btn btn-sm btn-primary flex items-center gap-1"
            >
              <LucideUsers2 className="w-4 h-4" />
              Register
            </button>

            <Link
              to="/auth/login"
              className="hover:link link-primary text-sm flex items-center gap-1"
            >
              <LucideLogIn className="w-4 h-4" /> Already have an account? Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
