export interface CreateWarehouseParams {
  name: string;
  is_default: boolean;
  country_id: number;
  city_id: number;
  district: string;
  street: string;
  latitude: number;
  longitude: number;
}

export interface UpdateWarehouseParams extends Partial<CreateWarehouseParams> {}
