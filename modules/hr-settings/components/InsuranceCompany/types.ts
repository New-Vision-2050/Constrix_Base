export interface MedicalInsuranceRow {
  id: string;
  name: string;
  policy_number: string;
  employee_id: string;
  employee?: Employee;
  employee_name?: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMedicalInsuranceForm {
  name: string;
  policy_number: string;
  employee_id: string;
  status?: number;
}

export interface UpdateMedicalInsuranceForm {
  name: string;
  policy_number: string;
  employee_id: string;
  status?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}
