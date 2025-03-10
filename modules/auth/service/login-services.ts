import { apiClient } from "@/config/axios-config";
import { endPoints } from "../constant/end-points";
import { LoginOption, LoginWaysSuccessResponse } from "../types/login-responses";

export const loginWays = async (identifier: string) =>
  await apiClient.post<LoginWaysSuccessResponse>(endPoints.loginWays, {
    identifier,
  });

export const loginSteps = async (
  identifier: string,
  password: string,
  token: string
) =>
  await apiClient.post(endPoints.loginSteps, { identifier, password, token });

export const forgetPassword = async (identifier: string) =>
  await apiClient.post(endPoints.forgetPassword, { identifier });

export const resetPassword = async (
  identifier: string,
  password: string,
  password_confirmation: string,
  otp: string
) =>
  await apiClient.post(endPoints.resetPassword, {
    identifier,
    password,
    password_confirmation,
    otp,
  });

export const resendOtp = async (identifier: string) =>
  await apiClient.post(endPoints.resendOtp, { identifier });

export const loginAlternative = async (
  identifier: string,
  login_option: LoginOption,
  token: string
) =>
  await apiClient.post(endPoints.loginAlternative, {
    identifier,
    login_option,
    token,
  });
