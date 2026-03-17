import { cache } from "react";
import { Permission } from "../types/permission";
import { usersApi } from "@/services/api/users";
import { UserMePayload } from "@/services/api/users/types/response";

type PermissionsResponse = {
  user: UserMePayload;
  permissions: Permission[];
  isSuperAdmin: boolean;
  isCentralCompany: boolean;
};
const empty: PermissionsResponse = {
  user: null as unknown as UserMePayload,
  permissions: [],
  isSuperAdmin: false,
  isCentralCompany: false,
};

export const getPermissions = cache(async (): Promise<PermissionsResponse> => {
  try {
    const { data } = await usersApi.getMe();
    const payload = data?.payload ?? null;
    if (!payload) return empty;

    const permissions = (payload.permissions ?? []) as unknown as Permission[];
    const isSuperAdmin = Boolean(payload.is_super_admin);
    const isCentralCompany = Boolean(payload.is_central_company);

    return { permissions, isSuperAdmin, isCentralCompany , user: payload };
  } catch {
    return empty;
  }
});