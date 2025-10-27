export interface CreateWarehouseParams {
  name: string;
  is_default: boolean;
  country_id: string | number;
  city_id: string | number;
  district: string;
  street: string;
  latitude: number;
  longitude: number;
}

export interface UpdateWarehouseParams extends Partial<CreateWarehouseParams> {}
