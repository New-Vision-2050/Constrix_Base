export interface CreateRoleParams {
  name: string;
  permissions: string[];
}

export interface UpdateRoleParams extends Partial<CreateRoleParams> {}
