import { useQuery } from "@tanstack/react-query";
import getContractBalance from "../api/get-balance";

export function contractBalanceQueryKey(scope: string, url: string) {
  return [scope, url] as const;
}

export default function useContractBalance(scope: string, url: string) {
  return useQuery({
    queryKey: contractBalanceQueryKey(scope, url),
    queryFn: () => getContractBalance(url),
    enabled: Boolean(url),
  });
}
