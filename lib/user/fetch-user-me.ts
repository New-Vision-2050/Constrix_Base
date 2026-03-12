import { cache } from "react";
import { baseURL } from "@/config/axios-config";
import { baseApi } from "@/config/axios/instances/base";

type UserMePayload = {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_types?: Array<{
    id: string;
    company_id: string;
    global_company_user_id: string;
    role: string;
    status: string;
  }>;
  permissions?: string[];
  is_super_admin?: boolean;
  is_central_company?: boolean;
  [key: string]: unknown;
};

export const fetchUserMe = cache(async (): Promise<UserMePayload | null> => {
  try {
    const response = await baseApi.get<{ payload: UserMePayload }>(
      `${baseURL}/users/me`
    );
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
});
