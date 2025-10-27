//getNotifySettings
import { useQuery } from "@tanstack/react-query";
import getNotifySettings from "./apis/get-notify-settings";

export const useNotifySettings = () => {
  const queryKey = ["notify-settings"];

  return useQuery({
    queryKey,
    queryFn: () => getNotifySettings(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
