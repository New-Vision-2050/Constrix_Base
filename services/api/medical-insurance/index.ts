import { baseApi } from "@/config/axios/instances/base";

export interface MedicalInsuranceResponse {
  data: {
    id: string;
    name: string;
    policy_number: string;
    employee_id: string;
    employee_name?: string;
    status: number;
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
  employee_id: string;
  status?: number;
}

export interface UpdateMedicalInsuranceParams {
  name: string;
  policy_number: string;
  employee_id: string;
  status?: number;
}

export const MedicalInsuranceApi = {
  list: (params?: { search?: string; page?: number; per_page?: number }) =>
    baseApi.get<MedicalInsuranceListResponse>("medical-insurances", {
      params,
    }),
  show: (id: string) => baseApi.get<MedicalInsuranceResponse>(`medical-insurances/${id}`),
  create: (params: CreateMedicalInsuranceParams) =>
    baseApi.post<MedicalInsuranceResponse>("medical-insurances", params),
  update: (id: string, params: UpdateMedicalInsuranceParams) =>
    baseApi.put<MedicalInsuranceResponse>(`medical-insurances/${id}`, params),
  delete: (id: string) => baseApi.delete(`medical-insurances/${id}`),
};
