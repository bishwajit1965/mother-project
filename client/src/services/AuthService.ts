import axiosInstance from "../lib/axios";

// LOGINq
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/login", payload);
  console.log("Response=>>", response.data);
  return response.data;
};

// GET ME
export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

// REGISTER
export const registerUser = async (data: Record<string, unknown>) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

// VERIFY EMAIL
export const verifyEmail = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/auth/verify-email", {
    email,
    otp,
  });
  return response.data;
};

// RESEND USER EMAIL VERIFICATION OTP
export const resendEmailVerificationOtpRequest = async (email: string) => {
  const response = await axiosInstance.post("/auth/resend-verification-email", {
    email,
  });
  return response.data;
};

// VERIFY RESET PASSWORD OTP
export const verifyPasswordResetOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/auth/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

// FORGOT PASSWORD OTP MAIL
export const forgotPasswordOtpRequest = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

// RESET USER PASSWORD
export const resetUserPassword = async (email: string, newPassword: string) => {
  const response = await axiosInstance.patch("/auth/reset-password", {
    email,
    newPassword,
  });
  return response.data;
};

// REFRESH
export const refreshToken = async () => {
  const response = await axiosInstance.post("/auth/refresh-token");
  return response.data;
};

// LOGOUT
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
