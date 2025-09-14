import { API_City } from "../../shared/city";
import { API_Country } from "../../shared/country";

export interface ECM_Warehouse {
  id: string;
  name: string;
  is_default: number;
  district?: string;
  street?: string;
  latitude?: string;
  longitude?: string;
}

export interface ECM_Warehouse_ListItem extends ECM_Warehouse {
  country?: API_Country;
  city?: API_City;
}
