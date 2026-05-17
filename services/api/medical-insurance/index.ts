import { baseApi } from "@/config/axios/instances/base";

export interface MedicalInsuranceResponse {
  data: {
    id: string;
    name: string;
    policy_number: string;
    provider: string;
    start_date: string;
    end_date: string;
    value: number;
    individuals_count: number;
    employee_id?: string;
    employee_name?: string;
    status: number;
    attachment?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface MedicalInsuranceListResponse {
  data: {
    payload: MedicalInsuranceResponse['data'][];
    pagination: {
      current_page: number;
      last_page: number;
      result_count: number;
    };
  };
}

export interface CreateMedicalInsuranceParams {
  name: string;
  policy_number: string;
  provider: string;
  start_date: string;
  end_date: string;
  value: number;
  individuals_count: number;
  employee_id?: string;
  status?: number;
  attachment?: File;
}

export interface UpdateMedicalInsuranceParams {
  name: string;
  policy_number: string;
  provider: string;
  start_date: string;
  end_date: string;
  value: number;
  individuals_count: number;
  employee_id?: string;
  status?: number;
  attachment?: File;
}

export interface CategoryResponse {
  data: {
    id: string;
    name: string;
    categoryType: string;
    maxCoverage: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CategoryListResponse {
  data: {
    payload: CategoryResponse['data'][];
    pagination: {
      current_page: number;
      last_page: number;
      result_count: number;
    };
  };
}

export interface CreateCategoryParams {
  name: string;
  categoryType: string;
  maxCoverage: string;
  description?: string;
}

export interface UpdateCategoryParams {
  name: string;
  categoryType: string;
  maxCoverage: string;
  description?: string;
}

export interface EmployeeResponse {
  data: {
    id: string;
    name: string[];
    policyId: string;
    value: string;
    subscriberId: string;
    dependents?: any[];
    category?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface EmployeeListResponse {
  data: {
    payload: EmployeeResponse['data'][];
    pagination: {
      current_page: number;
      last_page: number;
      result_count: number;
    };
  };
}

export interface CreateEmployeeParams {
  name: string[];
  policyId: string;
  value: string;
  subscriberId: string;
  dependents?: any[];
  category?: string;
}

export interface UpdateEmployeeParams {
  name: string[];
  policyId: string;
  value: string;
  subscriberId: string;
  dependents?: any[];
  category?: string;
}

export const MedicalInsuranceApi = {
  list: (params?: { 
    page?: number; 
    per_page?: number;
    name?: string;
    policy_number?: string;
    provider?: string;
    employee_id?: string;
    end_date?: string;
    status?: string;
  }) =>
    baseApi.get<MedicalInsuranceListResponse>("medical-insurances", {
      params,
    }),
  show: (id: string) => baseApi.get<MedicalInsuranceResponse>(`medical-insurances/${id}`),
  create: (params: CreateMedicalInsuranceParams) =>
    baseApi.post<MedicalInsuranceResponse>("medical-insurances", params),
  update: (id: string, params: UpdateMedicalInsuranceParams) =>
    baseApi.put<MedicalInsuranceResponse>(`medical-insurances/${id}`, params),
  delete: (id: string) => baseApi.delete(`medical-insurances/${id}`),

  // Categories endpoints
  categories: {
    list: (medicalInsuranceId: string, params?: { page?: number; per_page?: number }) =>
      baseApi.get<CategoryListResponse>(`medical-insurances/${medicalInsuranceId}/categories`, {
        params,
      }),
    show: (medicalInsuranceId: string, categoryId: string) =>
      baseApi.get<CategoryResponse>(`medical-insurances/${medicalInsuranceId}/categories/${categoryId}`),
    create: (medicalInsuranceId: string, params: CreateCategoryParams) =>
      baseApi.post<CategoryResponse>(`medical-insurances/${medicalInsuranceId}/categories`, params),
    update: (medicalInsuranceId: string, categoryId: string, params: UpdateCategoryParams) =>
      baseApi.put<CategoryResponse>(`medical-insurances/${medicalInsuranceId}/categories/${categoryId}`, params),
    delete: (medicalInsuranceId: string, categoryId: string) =>
      baseApi.delete(`medical-insurances/${medicalInsuranceId}/categories/${categoryId}`),
  },

  // Employees endpoints
  employees: {
    list: (medicalInsuranceId: string, params?: { page?: number; per_page?: number }) =>
      baseApi.get<EmployeeListResponse>(`medical-insurances/${medicalInsuranceId}/employees`, {
        params,
      }),
    show: (medicalInsuranceId: string, employeeId: string) =>
      baseApi.get<EmployeeResponse>(`medical-insurances/${medicalInsuranceId}/employees/${employeeId}`),
    create: (medicalInsuranceId: string, params: CreateEmployeeParams) =>
      baseApi.post<EmployeeResponse>(`medical-insurances/${medicalInsuranceId}/employees`, params),
    update: (medicalInsuranceId: string, employeeId: string, params: UpdateEmployeeParams) =>
      baseApi.put<EmployeeResponse>(`medical-insurances/${medicalInsuranceId}/employees/${employeeId}`, params),
    delete: (medicalInsuranceId: string, employeeId: string) =>
      baseApi.delete(`medical-insurances/${medicalInsuranceId}/employees/${employeeId}`),
  },
};
