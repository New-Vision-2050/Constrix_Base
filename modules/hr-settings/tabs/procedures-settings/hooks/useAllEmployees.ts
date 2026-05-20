import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";

export interface EmployeeOption {
  id: string;
  name: string;
  email: string;
}

interface EmployeesPage {
  payload: EmployeeOption[];
  pagination?: {
    page: number;
    next_page: number;
    last_page: number;
    result_count: number;
  };
}

async function fetchAllEmployees(): Promise<EmployeeOption[]> {
  const first = await apiClient.get<EmployeesPage>("/company-users/employees", {
    params: { page: 1, per_page: 50 },
  });

  const payload = first.data?.payload ?? (first.data as unknown as EmployeeOption[]);
  const firstPage: EmployeeOption[] = Array.isArray(payload) ? payload : [];

  const lastPage = first.data?.pagination?.last_page ?? 1;

  if (lastPage <= 1) return firstPage;

  const remaining = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, i) =>
      apiClient.get<EmployeesPage>("/company-users/employees", {
        params: { page: i + 2, per_page: 50 },
      }),
    ),
  );

  const rest = remaining.flatMap((res) => {
    const p = res.data?.payload ?? (res.data as unknown as EmployeeOption[]);
    return Array.isArray(p) ? p : [];
  });

  return [...firstPage, ...rest];
}

export function useAllEmployees() {
  return useQuery<EmployeeOption[]>({
    queryKey: ["employees", "all"],
    queryFn: fetchAllEmployees,
    staleTime: 5 * 60 * 1000,
  });
}
