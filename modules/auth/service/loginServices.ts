import { apiClient } from "@/config/axiosConfig";
import { endPoints } from "../constant/endPoints";

export const loginWays = async (identifier: string) =>
  await apiClient.post(endPoints.loginWays, { identifier });

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
