export interface MedicalInsuranceRow {
  id: string;
  name: string;
  policy_number: string;
  employee_id: string;
  employee?: Employee;
  employee_name?: string;
  status: number;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMedicalInsuranceForm {
  name: string;
  policy_number: string;
  employee_id: string;
  status?: number;
  end_date?: string;
}

export interface UpdateMedicalInsuranceForm {
  name: string;
  policy_number: string;
  employee_id: string;
  status?: number;
  end_date?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}
