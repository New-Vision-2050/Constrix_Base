import { cache } from "react";
import { Permission } from "../types/permission";
import { apiClient } from "@/config/axios-config";
import { getCurrentHost } from "@/utils/get-current-host";
import { cookies } from "next/headers";

export const getPermissions = cache(async (): Promise<Permission[]> => {
  try {
    const currentHost = await getCurrentHost();
    const cookieStore = await cookies();
    const nvToken = cookieStore.get("new-vision-token")?.value;

    if (!nvToken) {
      return [];
    }

    const permissionsRes = await apiClient.get("users/my-permissions", {
      headers: {
        Authorization: `Bearer ${nvToken}`,
        "X-Domain": currentHost,
      },
    });

    const permissions = permissionsRes.data.payload as Permission[];

    return permissions;
  } catch {
    return [];
  }
});
