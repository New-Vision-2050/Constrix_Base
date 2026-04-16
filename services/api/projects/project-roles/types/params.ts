export interface CreateProjectRoleParams {
  name: string;
  permission_ids: string[];
}

export interface UpdateProjectRoleParams
  extends Partial<CreateProjectRoleParams> {}
