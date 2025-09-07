export interface CreateCategoryParams {
  name: string;
  description?: string;
}

export interface UpdateCategoryParams extends Partial<CreateCategoryParams> {}
