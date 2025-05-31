import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { apiClient } from "@/config/axios-config";

export const useSidebarMenu = () => {
  const setMenu = useSidebarStore((s) => s.setMenu);
  const currentMenu = useSidebarStore((s) => s.menu);
  const hasHydrated = useSidebarStore((s) => s.hasHydrated);

  const { data, isSuccess, ...rest } = useQuery({
    queryKey: ["sidebar-menu"],
    queryFn: async () => {
      const res = await apiClient.get("/programs/sub_entities/list");
      return res.data.payload;
    },
    // enabled: hasHydrated && currentMenu.length === 0,
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setMenu(data);
    }
  }, [isSuccess, data, setMenu]);

  return {
    menu: currentMenu,
    data,
    isSuccess,
    ...rest,
  };
};
