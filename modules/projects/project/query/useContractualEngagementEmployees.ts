import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import type { Employee } from "@/modules/projects/project/components/project-tabs/tabs/staff/types";
import { mapProjectEmployeeDto } from "./mapProjectEmployee";
import type { ContractualEngagementKey } from "@/modules/projects/project/constants/contractualEngagementKeys";

export const contractualEngagementEmployeesQueryKey = (
  key: string,
  companyId?: string,
  search?: string,
) =>
  [
    "contractual-engagement-employees",
    key,
    companyId ?? "",
    search ?? "",
  ] as const;

export function useContractualEngagementEmployees(
  contractualEngagementKey: ContractualEngagementKey | undefined,
  options?: {
    company_id?: string;
    search?: string;
    /** When true, the query waits until `company_id` is available (الكادر tab). */
    requireCompanyId?: boolean;
  },
) {
  const search = options?.search?.trim() || undefined;
  const companyId = options?.company_id;
  const requireCompanyId = options?.requireCompanyId ?? false;

  return useQuery({
    queryKey: contractualEngagementKey
      ? contractualEngagementEmployeesQueryKey(
          contractualEngagementKey,
          companyId,
          search,
        )
      : ["contractual-engagement-employees", ""],
    queryFn: async () => {
      const res = await AllProjectsApi.getEmployeesByContractualEngagement(
        contractualEngagementKey!,
        {
          ...(companyId ? { company_id: companyId } : {}),
          ...(search ? { search } : {}),
        },
      );
      const body = res.data as typeof res.data & { status?: string };
      if (body.status === "error") {
        return [] as Employee[];
      }
      const payload = body.payload;
      if (!Array.isArray(payload)) {
        return [] as Employee[];
      }
      return payload.map(mapProjectEmployeeDto);
    },
    enabled:
      !!contractualEngagementKey &&
      (!requireCompanyId || !!companyId),
  });
}
