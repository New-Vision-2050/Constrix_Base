"use client";

import { useQuery } from "@tanstack/react-query";
import { EmployeeTasksApi } from "@/services/api/employee-tasks";
import type {
  EmployeeTaskProcedure,
  EmployeeTaskProceduresSummary,
} from "@/services/api/employee-tasks";

export const EMPLOYEE_TASK_PROCEDURES_QUERY_KEY = "employee-task-procedures" as const;

export function employeeTaskProceduresQueryKey(taskId: string | undefined) {
  return [EMPLOYEE_TASK_PROCEDURES_QUERY_KEY, taskId] as const;
}

export interface EmployeeTaskProceduresData {
  items: EmployeeTaskProcedure[];
  summary: EmployeeTaskProceduresSummary | null;
}

export function useEmployeeTaskProcedures(taskId: string | undefined) {
  return useQuery<EmployeeTaskProceduresData>({
    queryKey: employeeTaskProceduresQueryKey(taskId),
    queryFn: async () => {
      if (!taskId) return { items: [], summary: null };
      const res = await EmployeeTasksApi.procedures(taskId);
      const payload = res.data.payload;
      if (!payload) return { items: [], summary: null };
      return {
        items: payload.items ?? [],
        summary: payload.summary ?? null,
      };
    },
    enabled: Boolean(taskId),
  });
}
