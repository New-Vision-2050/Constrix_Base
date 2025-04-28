import { useMutation } from "@tanstack/react-query";
import { loginRepository } from "../repository/login-repository";
import {
  LoginOption,
  LoginStepsSuccessResponse,
  LoginWaysSuccessResponse,
} from "../types/login-responses";
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
    { identifier: string; token: string }
  >({
    mutationFn: ({ identifier, token }) =>
      loginRepository.forgetPassword(identifier, token),
  });

export const useResetPassword = () =>
  useMutation<
    ServerSuccessResponse,
    AxiosError<ServerErrorResponse>,
    {
      identifier: string;
      password: string;
      password_confirmation: string;
      token: string;
    }
  >({
    mutationFn: ({ identifier, password, password_confirmation, token }) =>
      loginRepository.resetPassword(
        identifier,
        password,
        password_confirmation,
        token
      ),
  });

export const useResendOtp = () =>
  useMutation<
    ServerSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string; token: string }
  >({
    mutationFn: ({ identifier, token }) =>
      loginRepository.resendOtp(identifier, token),
  });

export const useLoginAlternative = () =>
  useMutation<
    LoginWaysSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string; loginOption: LoginOption; token: string }
  >({
    mutationFn: ({ identifier, loginOption, token }) =>
      loginRepository.loginAlternative(identifier, loginOption, token),
  });

export const useValidateResetPasswordOtp = () =>
  useMutation<
    LoginStepsSuccessResponse,
    AxiosError<ServerErrorResponse>,
    { identifier: string; otp: string }
  >({
    mutationFn: ({ identifier, otp }) =>
      loginRepository.validateResetPasswordOtp(identifier, otp),
  });

export const useLogout = () =>
  useMutation<
    AxiosError<ServerErrorResponse>
  >({
    mutationFn: () =>
      loginRepository.logout(),
  });
