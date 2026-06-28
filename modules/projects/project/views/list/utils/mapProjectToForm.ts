import type { ProjectDetails } from "@/services/api/all-projects/types/response";
import type { CreateProjectFormValues } from "../validation/projectForm.schema";

export type ProjectEditSelections = {
  projectType?: { id: number; name: string } | null;
  subProjectType?: { id: number; name: string } | null;
  subSubProjectType?: { id: number; name: string } | null;
  branch?: { id: number | string; name: string } | null;
  management?: { id: number | string; name: string } | null;
  manager?: { id: string; name: string } | null;
  projectOwner?: { id: string; name: string; type?: string } | null;
};

function toIdString(value: unknown): string | undefined {
  if (value == null || value === "") return undefined;
  return String(value);
}

export function mapProjectToFormValues(
  project: ProjectDetails,
): CreateProjectFormValues {
  return {
    project_type_id: toIdString(project.project_type?.id ?? project.project_type_id) ?? "",
    sub_project_type_id:
      toIdString(project.sub_project_type?.id ?? project.sub_project_type_id) ?? "",
    sub_sub_project_type_id:
      toIdString(
        project.sub_sub_project_type?.id ?? project.sub_sub_project_type_id,
      ) ?? "",
    name: project.name ?? "",
    branch_id: toIdString(project.branch?.id ?? project.branch_id) ?? "",
    management_id: toIdString(project.management?.id ?? project.management_id) ?? "",
    manager_id: toIdString(project.manager_id ?? project.manager?.id) ?? "",
    responsible_employee_id: undefined,
    project_owner_id:
      toIdString(project.project_owner?.id ?? project.project_owner_id) ?? "",
    project_owner_type:
      project.project_owner_type === "company" ||
      project.project_owner_type === "individual"
        ? project.project_owner_type
        : undefined,
    project_classification_id: toIdString(project.project_classification_id),
    contract_type_id: undefined,
    status: project.status ?? 1,
  };
}

export function mapProjectToEditSelections(
  project: ProjectDetails,
): ProjectEditSelections {
  return {
    projectType: project.project_type,
    subProjectType: project.sub_project_type,
    subSubProjectType: project.sub_sub_project_type,
    branch: project.branch,
    management: project.management,
    manager: project.manager,
    projectOwner: project.project_owner,
  };
}

export function withSelectedOption<
  T extends { id: number | string; name: string },
>(options: T[] | undefined, selected: T | null | undefined): T[] {
  if (selected?.id == null || selected.id === "") return options ?? [];
  const list = options ?? [];
  const selectedId = String(selected.id);
  if (list.some((item) => String(item.id) === selectedId)) return list;
  return [selected, ...list];
}
