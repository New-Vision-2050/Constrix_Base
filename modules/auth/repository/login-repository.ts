import {
  forgetPassword,
  loginAlternative,
  loginSteps,
  loginWays,
  resendOtp,
  resetPassword,
  validateResetPasswordOtp,
} from "../service/login-services";
import { LoginOption } from "../types/login-responses";

export const loginRepository = {
  loginWays: async (identifier: string) => {
    const response = await loginWays(identifier);
    return response.data;
  },
  loginSteps: async (identifier: string, password: string, token: string) => {
    const response = await loginSteps(identifier, password, token);
    return response.data;
  },
  forgetPassword: async (identifier: string, token: string) => {
    const response = await forgetPassword(identifier, token);
    return response.data;
  },
  resetPassword: async (
    identifier: string,
    password: string,
    password_confirmation: string,
    token: string
  ) => {
    const response = await resetPassword(
      identifier,
      password,
      password_confirmation,
      token
    );
    return response.data;
  },
  resendOtp: async (identifier: string, token: string) => {
    const response = await resendOtp(identifier, token);
    return response.data;
  },
  loginAlternative: async (
    identifier: string,
    login_option: LoginOption,
    token: string
  ) => {
    const response = await loginAlternative(identifier, login_option, token);
    return response.data;
  },
  validateResetPasswordOtp: async (identifier: string, otp: string) => {
    const response = await validateResetPasswordOtp(identifier, otp);
    return response.data;
  },
};
