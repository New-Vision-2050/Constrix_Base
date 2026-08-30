import { useQuery } from "@tanstack/react-query";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";
import type { ProjectSharingDepartmentPayload } from "@/services/api/projects/project-sharing-department/types/response";

export const projectOrderPermitDepartmentsListQueryKey = () =>
  ["project-order-permit-departments"] as const;

export function getProjectOrderPermitDepartmentLabel(
  department: ProjectSharingDepartmentPayload,
): string {
  return (
    department.name?.trim() ||
    department.description?.trim() ||
    department.code?.trim() ||
    String(department.id)
  );
}

const DRILLING_VALIDATION_DEPARTMENT_LABELS = new Set([
  "المشاريع",
  "مشاريع",
  "العمليات",
  "عمليات",
  "projects",
  "operations",
]);

export function isDrillingValidationDepartment(
  department: ProjectSharingDepartmentPayload,
): boolean {
  const label = getProjectOrderPermitDepartmentLabel(department).trim();
  if (DRILLING_VALIDATION_DEPARTMENT_LABELS.has(label)) return true;

  const normalizedLabel = label.replace(/^ال/, "");
  if (DRILLING_VALIDATION_DEPARTMENT_LABELS.has(normalizedLabel)) return true;

  const code = department.code?.trim().toLowerCase();
  return code === "projects" || code === "operations";
}

export function useProjectOrderPermitDepartmentsList(enabled = true) {
  return useQuery({
    queryKey: projectOrderPermitDepartmentsListQueryKey(),
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.list();
      return res.data.payload ?? [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
