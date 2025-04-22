import { useQuery } from "@tanstack/react-query";
import GetPrivilegesData from "../api/get-privileges-data";

export default function usePrivilegesData() {
  return useQuery({
    queryKey: [`user-privileges-data`],
    queryFn: GetPrivilegesData,
  });
}
