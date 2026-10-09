import { useEffect, useState, type ReactNode } from "react";

import {
  loginUser,
  logoutUser,
  getMe,
  refreshToken,
  registerUser,
  verifyEmail as verifyEmailRequest,
  resendEmailVerificationOtpRequest,
  forgotPasswordOtpRequest,
  resetUserPassword,
  verifyPasswordResetOtp,
} from "../services/AuthService.js";

import AuthContext from "../contexts/AuthContext.js";

import { setAccessToken as setApiToken } from "../lib/axios";

type AuthUser = {
  id?: string | number;
  email?: string;
  name?: string;
  [key: string]: unknown;
  role?: "ADMIN" | "USER" | string;
};

type RegisterUser = {
  id?: string | number;
  email?: string;
  name?: string;
  [key: string]: unknown;
  role?: "ADMIN" | "USER" | string;
  avatar?: string;
};

// Verify email payload
type VerifyEmailPayload = {
  email: string;
  otp: string;
  [key: string]: unknown;
};

// Resend email verification Otp request payload
type resendEmailVerificationPayload = {
  email: string;
};

// FORGOT PASSWORD PAYLOAD
type forgotPasswordPayload = {
  email: string;
};

// VERIFY OTP PAYLOAD
type VerifyOtpPayload = {
  email: string;
  otp: string;
};

// RESET PASSWORD PAYLOAD
type resetPasswordPayload = {
  email: string;
  newPassword: string;
};

type LoginPayload = {
  email: string;
  password: string;
  [key: string]: unknown;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  authReady: boolean;

  login: (payload: LoginPayload) => Promise<{
    success: boolean;
    message: string;
    user?: AuthUser;
    authReady?: boolean;
  }>;

  logout: () => Promise<void>;

  register: (payload: RegisterPayload) => Promise<{
    success: boolean;
    message: string;
    user?: RegisterUser;
    authReady?: boolean;
  }>;

  verifyEmail: (payload: VerifyEmailPayload) => Promise<{
    success: boolean;
    message: string;
  }>;

  resendEmailVerificationOtp: (
    payload: resendEmailVerificationPayload,
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  forgotPassword: (payload: forgotPasswordPayload) => Promise<{
    success: boolean;
    message: string;
  }>;

  verifyOtp: (payload: VerifyOtpPayload) => Promise<{
    success: boolean;
    message: string;
  }>;

  resetPassword: (
    payload: resetPasswordPayload,
  ) => Promise<{ success: boolean; message: string }>;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [authReady, setAuthReady] = useState(false);

  console.log("Access Token in Auth Provider", accessToken);

  /** Bootstrap authentication status on component mount */
  /**
   * This effect initializes the authentication state by attempting to refresh the access token
   * and fetching the current user's information.
   * and sets the authentication state accordingly.
   * It runs only once when the component mounts.
   * page refreshes, it will attempt to refresh the access token and fetch the user data again.
   * If the refresh token is valid, it will set the access token and user data.
   * If the refresh token is invalid or expired, it will clear the authentication state.
   * Finally, it sets the authReady state to true to indicate that the authentication initialization is complete.
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const refreshResponse = await refreshToken();
        console.log("Refresh Response:", refreshResponse);

        if (refreshResponse.success && refreshResponse.data) {
          const token = refreshResponse.data;

          setAccessToken(token);

          setApiToken(token);

          const meResponse = await getMe();

          if (meResponse.success && meResponse.data) {
            setUser(meResponse.data);
          }
        }
      } catch (error) {
        console.error("Auth Bootstrap Failed:", error);

        setUser(null);

        setAccessToken(null);

        setApiToken(null);
      } finally {
        setAuthReady(true);
      }
    };

    bootstrapAuth();
  }, []);

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true);
      const registerResponse = await registerUser(payload);

      if (!registerResponse.success) {
        throw new Error(registerResponse.message || "Registration failed");
      }

      return {
        success: true,
        message: "Registration successful",
        user: {
          ...registerResponse.data,
          role: registerResponse.data.role || "USER",
          authReady: true,
        },
      };
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**===================================================
   * VERIFY USER EMAIL ADDRESS AFTER REGISTRATION
   *
   * @param payload
   * @returns NULL
   */
  const verifyEmail = async (payload: VerifyEmailPayload) => {
    try {
      setLoading(true);

      if (!payload.email || !payload.otp) {
        return {
          success: false,
          message: "Email and OTP are required",
        };
      }

      await verifyEmailRequest(payload.email, payload.otp);

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Verify Email Error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Email verification failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendEmailVerificationOtp = async (
    payload: resendEmailVerificationPayload,
  ) => {
    try {
      setLoading(true);

      if (!payload.email) {
        return {
          success: false,
          message: "Email is required.",
        };
      }

      const response = await resendEmailVerificationOtpRequest(payload.email);

      if (!response?.success) {
        return {
          success: false,
          message: response?.message || "Failed to resend verification OTP.",
        };
      }

      return {
        success: true,
        message: response.message || "Verification OTP sent successfully.",
      };
    } catch (error) {
      console.error("Resend email verification Otp error", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Resend email verification Otp failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**========================================
   * SEND EMAIL WITH OTP FOR FORGOT PASSWORD
   *
   * Target:
   *
   * 1. User has forgot password
   * 2. User will fill the email field as payload
   * 3. Email with OTP will be sent
   * 4. User will land on ForgotPassword.tsx page on successful email sent with OTP
   * 5. Email field filled up in ForgotPassword.tsx
   * 6. User collects OTP from mail and inserts OTP in the form
   * 7. Existing password and new password both will have to be typed
   * 8. Submits the form and password will be reset
   *
   * @param payload email
   * @returns NULL
   */
  const forgotPassword = async (payload: forgotPasswordPayload) => {
    try {
      setLoading(true);
      if (!payload.email) {
        return {
          success: false,
          message: "Email is required.",
        };
      }

      const response = await forgotPasswordOtpRequest(payload.email);

      if (!response.success) {
        return {
          success: false,
          message: response?.message || "Failed to send forgot password OTP.",
        };
      }

      return {
        success: true,
        message: response.message || "Forgot password OTP sent successfully.",
      };
    } catch (error) {
      console.error("Forgot password Verification Otp error", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Forgot password generation Otp failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**=================================================
   * VERIFY OTP FOR RESET PASSWORD
   *
   * @param payload
   * @returns
   */
  const verifyOtp = async (payload: VerifyOtpPayload) => {
    try {
      setLoading(true);
      if (!payload.email || !payload.otp) {
        return {
          success: false,
          message: "Email and OTP are required.",
        };
      }

      const response = await verifyPasswordResetOtp(payload.email, payload.otp);

      if (!response.success) {
        return {
          success: false,
          message: response?.message || "Failed to verify password reset OTP.",
        };
      }

      return {
        success: true,
        message:
          response.message || "Password reset OTP verification is successful!",
      };
    } catch (error) {
      console.error("OTP verification  error", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "OTP verification failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   * @param payload
   * @returns
   */
  const resetPassword = async (payload: resetPasswordPayload) => {
    try {
      setLoading(true);

      if (!payload.email) {
        return {
          success: false,
          message: "Email is required.",
        };
      }

      const response = await resetUserPassword(
        payload.email,
        payload.newPassword,
      );

      if (!response.success) {
        return {
          success: false,
          message: response?.message || "Failed to send forgot password OTP.",
        };
      }
      return {
        success: true,
        message: response.message || "Password has been reset successfully.",
      };
    } catch (error) {
      console.error("Reset password error", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Reset password operation failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true);

      const loginResponse = await loginUser(payload);

      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Login failed");
      }

      const token = loginResponse.data;

      setAccessToken(token);

      setApiToken(token);

      const meResponse = await getMe();
      console.log(meResponse, "meResponse");

      if (meResponse.success && meResponse.data) {
        setUser(meResponse.data);
      }

      return {
        success: true,
        message: "Login successful",
        user: {
          ...meResponse.data,
          role: meResponse.data.role || "USER",
        },
        authReady: true,
      };
    } catch (error) {
      console.error("Login Error:", error);

      setUser(null);
      setAccessToken(null);
      setApiToken(null);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setUser(null);

      setAccessToken(null);

      setApiToken(null);
    }
  };

  const authInfo: AuthContextValue = {
    user,
    accessToken,
    loading,
    authReady,
    register,
    verifyEmail,
    resendEmailVerificationOtp,
    forgotPassword,
    verifyOtp,
    resetPassword,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
