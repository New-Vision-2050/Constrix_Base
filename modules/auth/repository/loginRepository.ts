import { loginSteps, loginWays } from "../service/loginServices";

export const loginRepository = {
  loginWays: async (identifier: string) => {
    const response = await loginWays(identifier);
    return response.data;
  },
  loginSteps: async (identifier: string, password: string, token: string) => {
    const response = await loginSteps(identifier, password, token);
    return response.data;
  },
};
