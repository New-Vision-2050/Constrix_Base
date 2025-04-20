import { useQuery } from "@tanstack/react-query";
import GetUserConnectionData from "../api/get-user-connection-data";

export default function useUserConnectionData() {
  return useQuery({
    queryKey: [`user-profile-connection-data`],
    queryFn: GetUserConnectionData,
  });
}
