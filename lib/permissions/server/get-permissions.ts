import { cache } from "react";
import { Permission } from "../types/permission";
import { apiClient } from "@/config/axios-config";
import { getCurrentHost } from "@/utils/get-current-host";
import { cookies } from "next/headers";

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
    const currentHost = await getCurrentHost();
    const cookieStore = await cookies();
    const nvToken = cookieStore.get("new-vision-token")?.value;

    if (!nvToken) {
      return empty;
    }

    const permissionsRes = await apiClient.get("users/me", {
      headers: {
        Authorization: `Bearer ${nvToken}`,
        "X-Domain": currentHost,
      },
    });

    const permissions = permissionsRes.data.payload
      ?.permissions as Permission[];
    const isSuperAdmin = Boolean(permissionsRes.data.payload?.is_super_admin);
    const isCentralCompany = Boolean(
      permissionsRes.data.payload?.is_central_company
    );

    return { permissions, isSuperAdmin, isCentralCompany };
  } catch {
    return empty;
  }
});
