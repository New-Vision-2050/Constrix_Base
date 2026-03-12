import { cache } from "react";
import { Permission } from "../types/permission";
import { fetchUserMe } from "@/lib/user/fetch-user-me";

type PermissionsResponse = {
  permissions: Permission[];
  isSuperAdmin: boolean;
  isCentralCompany: boolean;
};
const empty: PermissionsResponse = {
  permissions: [],
  isSuperAdmin: false,
  isCentralCompany: false,
};
export const getPermissions = cache(async (): Promise<PermissionsResponse> => {
  try {
    const payload = await fetchUserMe();

    if (!payload) {
      return empty;
    }

    const permissions = (payload.permissions ?? []) as unknown as Permission[];
    const isSuperAdmin = Boolean(payload.is_super_admin);
    const isCentralCompany = Boolean(payload.is_central_company);

    return { permissions, isSuperAdmin, isCentralCompany };
  } catch {
    return empty;
  }
});
