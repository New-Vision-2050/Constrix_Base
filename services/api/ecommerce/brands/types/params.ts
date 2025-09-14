export interface CreateBrandParams {
  name: string;
  description?: string;
}

export interface UpdateBrandParams extends Partial<CreateBrandParams> {}
