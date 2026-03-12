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

    const permissions = payload.permissions ?? [];
    const isSuperAdmin = Boolean((payload as { is_super_admin?: unknown }).is_super_admin);
    const isCentralCompany = Boolean(
      (payload as { is_central_company?: unknown }).is_central_company
    );

    console.log('from permissions', payload);
    return { permissions, isSuperAdmin, isCentralCompany , user: payload };
  } catch {
    return empty;
  }
});