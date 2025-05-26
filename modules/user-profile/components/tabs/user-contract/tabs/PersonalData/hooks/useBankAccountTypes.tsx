import { useQuery } from "@tanstack/react-query";
import GetBankAccountTypes from "../api/get-bank-types";

export default function useBankAccountTypes() {
  return useQuery({
    queryKey: [`bank-account-types`],
    queryFn: GetBankAccountTypes,
  });
}
