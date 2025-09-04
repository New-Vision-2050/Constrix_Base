import { useQuery } from "@tanstack/react-query";
import getSharedSettings from "../api/get-shared-settings";

export const useCRMSharedSetting = () => {
  const queryKey = ["crm-shared-setting"];

  return useQuery({
    queryKey,
    queryFn: () => getSharedSettings(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
