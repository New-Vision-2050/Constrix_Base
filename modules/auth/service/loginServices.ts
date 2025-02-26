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
