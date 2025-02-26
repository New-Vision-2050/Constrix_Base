import { loginWays } from "../services/loginServices";

export const loginRepository = {
  loginWays: async (identifier: string) => {
    const response = await loginWays(identifier);
    return response.data;
  },
};
