import {
  LucideEye,
  LucideEyeClosed,
  LucideLockKeyholeOpen,
  LucideLogIn,
  LucideUploadCloud,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ResetPassword = () => {
  const location = useLocation();
  const resetPasswordEmail =
    (location.state as { email?: string } | null)?.email ?? "";
  const initialMessage =
    (location.state as { message?: string } | null)?.message ?? "";
  const [email, setEmail] = useState(resetPasswordEmail);
  const [newPassword, setNewPassword] = useState("");
  const [readNewPassword, setReadNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [readConfirmPassword, setReadConfirmPassword] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const navigate = useNavigate();

  type ResetPasswordPayload = {
    email: string;
    newPassword: string;
  };

  const { resetPassword } = useAuth() as {
    resetPassword: (payload: ResetPasswordPayload) => Promise<{
      success: boolean;
    }>;
  };

  const toggleReadConfirmPassword = () => {
    setReadConfirmPassword((prev) => !prev);
  };
  const toggleReadNewPassword = () => {
    setReadNewPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const response = await resetPassword({ email, newPassword });
    if (response.success) {
      // setMessage("Password has been reset successfully!");
      navigate("/auth/login", {
        state: { email, message: "Password has been reset successfully!" },
      });
    }
  };

  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold justify-center border-b border-gray-300 pb-2 flex items-center gap-2">
          <LucideLockKeyholeOpen size={20} />
          Reset Password ?
        </h1>
      </div>

      {message && <p className="text-green-500 font-bold">{message}</p>}

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
            readOnly
          />
        </div>

        <div className="w-full relative">
          <input
            type={readNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={toggleReadNewPassword}
          >
            {readNewPassword ? (
              <LucideEyeClosed size={16} />
            ) : (
              <LucideEye size={16} />
            )}
          </button>
        </div>

        <div className="w-full relative">
          <input
            type={readConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={toggleReadConfirmPassword}
          >
            {readConfirmPassword ? (
              <LucideEyeClosed size={16} />
            ) : (
              <LucideEye size={16} />
            )}
          </button>
        </div>

        <div className="grid gap-4">
          <button className="btn btn-sm btn-primary">
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

export default ResetPassword;
