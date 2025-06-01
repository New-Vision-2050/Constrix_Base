import { useQuery } from "@tanstack/react-query";
import { getAdminRequests } from "../service/get-admin-requests";
import { AdminRequestType } from "@/types/admin-request";

type UseAdminRequestsParams = {
  type: AdminRequestType;
  company_id: string;
  branch_id?: string;
  enabled?: boolean;
};

export const useAdminRequests = ({
  type,
  company_id,
  branch_id,
  enabled = true,
}: UseAdminRequestsParams) => {
  return useQuery({
    queryKey: ["admin-requests", type, company_id, branch_id],
    queryFn: () => getAdminRequests({ type, company_id, branch_id }),
    enabled,
  });
};
