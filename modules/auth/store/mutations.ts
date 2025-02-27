import { useMutation } from "@tanstack/react-query";
import { loginRepository } from "../repository/loginRepository";
import {
  LoginStepsSuccessResponse,
  LoginWaysSuccessResponse,
} from "../types/loginRepositoryTypes";
import { AxiosError } from "axios";
import {
  ServerErrorResponse,
  ServerSuccessResponse,
} from "@/types/ServerResponse";

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

export const useForgetPassword = () =>
  useMutation<
    ServerSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string }
  >({
    mutationFn: ({ identifier }) => loginRepository.forgetPassword(identifier),
  });

export const useResetPassword = () =>
  useMutation<
    ServerSuccessResponse,
    AxiosError<ServerErrorResponse>,
    {
      identifier: string;
      password: string;
      password_confirmation: string;
      otp: string;
    }
  >({
    mutationFn: ({ identifier, password, password_confirmation, otp }) =>
      loginRepository.resetPassword(
        identifier,
        password,
        password_confirmation,
        otp
      ),
  });

export const useResendOtp = () =>
  useMutation<
    ServerSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string }
  >({
    mutationFn: ({ identifier }) => loginRepository.resendOtp(identifier),
  });
