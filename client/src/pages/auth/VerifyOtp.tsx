import { LucideKeyRound, LucideLogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const VerifyOtp = () => {
  const location = useLocation();
  const verifyOtpEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const initialMessage =
    (location.state as { message?: string } | null)?.message ?? "";

  const [email, setEmail] = useState(verifyOtpEmail);
  const [message, setMessage] = useState(initialMessage);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  type VerifyOtpPayload = {
    email: string;
    otp: string;
  };

  const { verifyOtp } = useAuth() as {
    verifyOtp: (payload: VerifyOtpPayload) => Promise<{
      success: boolean;
      message: string;
    }>;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await verifyOtp({ email, otp });
      if (response.success) {
        // setMessage("OTP verification is successful.");
        navigate("/auth/reset-password", {
          state: { email, message: "OTP verification is successful." },
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
      setMessage(apiError?.response?.data?.message || "OTP verification error");
    }
  };

  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold justify-center border-b border-gray-300 pb-2 flex items-center gap-2">
          <LucideKeyRound className="w-4 h-4" />
          Verify OTP
        </h1>
        <p className="text-sm">
          Check mail and copy OTO. OTP will expire in 5 minutes !
        </p>
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        <div className="w-full">
          <div className="grid gap-2">
            <button
              type="submit"
              className="btn btn-sm btn-primary flex items-center gap-1"
            >
              <LucideKeyRound className="w-4 h-4" />
              Verify OTP
            </button>

            <Link
              to="/auth/login"
              className="hover:link link-primary text-sm flex items-center gap-1"
            >
              Want to avoid verify OTP ? <LucideLogIn className="w-4 h-4" />
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
