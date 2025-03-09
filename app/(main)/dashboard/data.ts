export interface Company {
  id: string;
  name: string;
  user_name: string;
  email: string;
  phone: string;
  serial_no: string;
  country_id: string;
  company_type_id: string;
  company_field_id: string;
  registration_type_id: string;
  general_manager_id: string;
  registration_no: string;
  general_manager_name: string;
  company_type: string;
  company_field: string;
  registration_type: string;
  is_active: 0 | 1;
  complete_data: 0 | 1;
  date_activate: string | null;
}
