import { apiClient } from "@/config/axios-config";
import { endPoints } from "../constant/end-points";
import {
  LoginOption,
  LoginWaysSuccessResponse,
} from "../types/login-responses";

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

export const forgetPassword = async (identifier: string, token: string) =>
  await apiClient.post(endPoints.forgetPassword, { identifier, token });

export const resetPassword = async (
  identifier: string,
  password: string,
  password_confirmation: string,
  token: string
) =>
  await apiClient.post(endPoints.resetPassword, {
    identifier,
    password,
    password_confirmation,
    token,
  });

export const resendOtp = async (identifier: string, token: string) =>
  await apiClient.post(endPoints.resendOtp, { identifier, token });

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

export const validateResetPasswordOtp = async (
  identifier: string,
  otp: string
) =>
  await apiClient.post(endPoints.validateResetPasswordOtp, { identifier, otp });
