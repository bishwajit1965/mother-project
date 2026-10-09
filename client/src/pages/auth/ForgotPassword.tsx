import {
  LucideLockKeyhole,
  LucideLogIn,
  LucideUploadCloud,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ForgotPassword = () => {
  const location = useLocation();
  const forgotPasswordEmail =
    (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(forgotPasswordEmail);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  type forgotPasswordPayload = {
    email: string;
  };

  const { forgotPassword } = useAuth() as {
    forgotPassword: (
      payload: forgotPasswordPayload,
    ) => Promise<{ success: boolean; message: string }>;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await forgotPassword({ email });
      if (response.success) {
        setMessage("Forgot password OTP sent.");
        navigate("/auth/verify-otp", {
          state: { email, message: "Forgot password OTP sent." },
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

      setMessage(
        apiError?.response?.data?.message ||
          "Forgot password OTP generation failed",
      );
    }
  };

  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold justify-center border-b border-gray-300 pb-2 flex items-center gap-2">
          <LucideLockKeyhole size={20} />
          Forgot Password ?
        </h1>
        <p className="text-sm">Insert your email and submit for OTP</p>
      </div>

      {message && <p className="text-sm text-green-500">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="lg:max-w-xl mx-auto w-full space-y-4"
      >
        <div className="w-full space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-sm input-bordered w-full"
            required
          />
        </div>
        <div className="grid gap-4">
          <button className="btn btn-sm btn-primary">
            {" "}
            <LucideUploadCloud size={16} /> Submit
          </button>
          <Link
            to="/auth/login"
            className="m-0 hover:link text-indigo-500 text-xs flex items-center gap-1"
          >
            Remembered Password ? <LucideLogIn size={14} /> Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
