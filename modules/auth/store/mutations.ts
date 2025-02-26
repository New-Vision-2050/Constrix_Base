import { useMutation } from "@tanstack/react-query";
import { loginRepository } from "../repository/loginRepository";

export const useLoginWays = () =>
  useMutation({
    mutationFn: ({ identifier }: { identifier: string }) =>
      loginRepository.loginWays(identifier),
  });
