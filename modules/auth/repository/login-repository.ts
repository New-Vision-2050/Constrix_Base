import {
  forgetPassword,
  loginSteps,
  loginWays,
  resendOtp,
  resetPassword,
} from "../service/login-services";

export const loginRepository = {
  loginWays: async (identifier: string) => {
    const response = await loginWays(identifier);
    return response.data;
  },
  loginSteps: async (identifier: string, password: string, token: string) => {
    const response = await loginSteps(identifier, password, token);
    return response.data;
  },
  forgetPassword: async (identifier: string) => {
    const response = await forgetPassword(identifier);
    return response.data;
  },
  resetPassword: async (
    identifier: string,
    password: string,
    password_confirmation: string,
    otp: string
  ) => {
    const response = await resetPassword(
      identifier,
      password,
      password_confirmation,
      otp
    );
    return response.data;
  },
  resendOtp: async (identifier: string) => {
    const response = await resendOtp(identifier);
    return response.data;
  },
};
