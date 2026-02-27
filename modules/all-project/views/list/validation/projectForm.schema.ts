import { z } from "zod";

export const CreateProjectSchema = z.object({
  project_type_id: z.string().min(1, "project.projectTypeRequired"),
  sub_project_type_id: z.string().min(1, "project.subProjectTypeRequired"),
  sub_sub_project_type_id: z.string().min(1, "project.subProjectTypeRequired"),
  name: z.string().min(1, { message: "project.projectNameRequired" }),
  responsible_employee_id: z.string().optional(),
  project_owner_id: z.string().min(1, "project.clientRequired"),
  project_classification_id: z.string().optional(),
  branch_id: z.string().min(1, { message: "project.branchRequired" }),
  management_id: z.string().min(1, { message: "project.managementRequired" }),
  manager_id: z.string().optional(),
  contract_type_id: z.string().optional(),
  status: z.number().int(),
  project_owner_type: z.enum(["company", "individual"]).optional(),
});

export type CreateProjectFormValues = z.infer<typeof CreateProjectSchema>;
