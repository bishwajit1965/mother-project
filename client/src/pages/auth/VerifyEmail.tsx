import { LucideCheck, LucideMailOpen, LucideSettings } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type VerifyEmailPayload = {
  email: string;
  otp: string;
};

type resendEmailVerificationOtpPayload = {
  email: string;
};

const VerifyEmail = () => {
  const location = useLocation();
  const initialEmail =
    (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { verifyEmail } = useAuth() as {
    verifyEmail: (payload: VerifyEmailPayload) => Promise<{ success: boolean }>;
  };

  const { resendEmailVerificationOtp } = useAuth() as {
    resendEmailVerificationOtp: (
      payload: resendEmailVerificationOtpPayload,
    ) => Promise<{
      success: boolean;
    }>;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await verifyEmail({ email, otp });
    if (response.success) {
      navigate("/auth/login", { state: { email } });
    }
  };

  const handleResendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await resendEmailVerificationOtp({ email });
    if (response.success) {
      setMessage("Otp sent. Check your mail.");
    }
  };

  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold justify-center border-b border-gray-300 pb-2 flex items-center gap-2">
          <LucideMailOpen /> Verify Your Email
        </h1>
        <p className="max-w-xs text-xs">
          We've sent a 6-digit verification code to your email address.
        </p>
        <p className="max-w-xs text-xs">
          Please check your inbox (and Spam folder if necessary), copy the OTP,
          and enter it below.
        </p>
        <p className="max-w-xs text-xs">This OTP code expires in 5 minutes.</p>
      </div>
      {message && (
        <div className="p-2 border border-gray-400 rounded-sm shadow bg-gray-200">
          <p className="test-sm font-bold text-green-500">{message}</p>
        </div>
      )}

      <form
        className="lg:max-w-xl mx-auto w-full space-y-4"
        onSubmit={handleSubmit}
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

          <input
            type="text"
            placeholder="Otp will expire in 5 minutes"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input input-sm input-bordered w-full"
            required
          />
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="btn btn-sm btn-primary flex items-center gap-1 w-full"
          >
            <LucideCheck className="w-4 h-4" />
            Verify Email
          </button>
        </div>
      </form>

      <div className="divider text-sm">DID NOT RECEIVE OTP ?</div>

      <div className="flex justify-center">
        <button
          onClick={handleResendOtp}
          className="hover:link link-primary text-sm flex items-center gap-1 text-center"
        >
          <LucideSettings className="w-4 h-4" /> Resend Me OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
