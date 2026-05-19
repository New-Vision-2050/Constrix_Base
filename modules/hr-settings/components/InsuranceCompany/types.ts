export interface MedicalInsuranceRow {
  id: string;
  name: string;
  policy_number: string;
  employee_id?: string;
  employee?: Employee;
  employee_name?: string;
  status: number;
  end_date?: string;
  start_date?: string;
  created_at?: string;
  updated_at?: string;
  service_name?: string;
  provider_name?: string;
  provider?: string; // From API
  value?: number;
  number_of_individuals?: number;
  individuals_count?: number; // From API
}

export interface CreateMedicalInsuranceForm {
  name: string;
  policy_number: string;
  status?: number;
  end_date?: string;
  provider?: string;
  start_date?: string;
  value?: number;
  individuals_count?: number;
}

export interface UpdateMedicalInsuranceForm {
  name: string;
  policy_number: string;
  status?: number;
  end_date?: string;
  provider?: string;
  start_date?: string;
  value?: number;
  individuals_count?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}
