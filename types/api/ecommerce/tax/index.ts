import { API_Country } from "../../shared/country";

export interface ECM_Tax {
  id: string;
  country?: API_Country;
  tax_number: string;
  tax_percentage: number;
  is_active: number;
}
