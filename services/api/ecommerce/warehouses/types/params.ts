export interface CreateWarehouseParams {
  name: string;
}

export interface UpdateWarehouseParams extends Partial<CreateWarehouseParams> {}
