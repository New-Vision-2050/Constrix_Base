import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { usePermissionsStore } from "@/store/usePermissionsStore";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { useEffect } from "react";

export function usePermissions() {
  const permissions = usePermissionsStore((s) => s.permissions);
  const setPermissions = usePermissionsStore((s) => s.setPermissions);
  const hasHydrated = usePermissionsStore((s) => s.hasHydrated);
  const user = useAuthStore((s) => s.user);

  const { data, isSuccess } = useQuery({
    queryKey: ["my-permissions"],
    queryFn: async () => {
      const res = await apiClient.get("/users/my-permissions");
      return res.data.payload.map((perm: { key: string }) => perm.key);
    },
    enabled: hasHydrated && permissions.length === 0 && user !== null,
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (isSuccess && data && permissions.length === 0) {
      setPermissions(data);
    }
  }, [isSuccess, data, permissions.length, setPermissions]);

  return permissions?.length > 0 ? permissions : data;
}