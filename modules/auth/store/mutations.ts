import { useMutation } from "@tanstack/react-query";
import { loginRepository } from "../repository/loginRepository";
import {
  LoginStepsSuccessResponse,
  LoginWaysSuccessResponse,
} from "../types/loginRepositoryTypes";
import { AxiosError } from "axios";
import { ServerErrorResponse } from "@/types/ServerErrorResponse";

export const useLoginWays = () =>
  useMutation<
    LoginWaysSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string }
  >({
    mutationFn: ({ identifier }) => loginRepository.loginWays(identifier),
  });

export const useLoginSteps = () =>
  useMutation<
    LoginStepsSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string; password: string; token: string }
  >({
    mutationFn: ({ identifier, password, token }) =>
      loginRepository.loginSteps(identifier, password, token),
  });
