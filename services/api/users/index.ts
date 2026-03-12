import { cache } from "react";
import { baseURL } from "@/config/axios-config";
import { baseApi } from "@/config/axios/instances/base";
import { GetMeResponse } from "./types/response";

const getMeCached = cache(() =>
  baseApi.get<GetMeResponse>(`${baseURL}/users/me`),
);

// it costs 6 seconds to load because it is called 3 times [Layout, getPermissions, page]
// const getMeNotCached = async () => {
//   try {
//     const response = await baseApi.get<GetMeResponse>(`${baseURL}/users/me`);
//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const usersApi = {
  getMe: () => getMeCached(),
};
