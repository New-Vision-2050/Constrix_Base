export interface CreateCategoryParams {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface UpdateCategoryParams extends Partial<CreateCategoryParams> {}
