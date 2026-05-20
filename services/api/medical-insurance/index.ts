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
  status?: number;
  attachment?: File;
}

export interface CategoryResponse {
  data: {
    id: string;
    name: string;
    type?: string;
    categoryType?: string;
    coverage_limit: string;
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
  type: string;
  coverage_limit: string;
  description?: string;
}

export interface UpdateCategoryParams {
  name: string;
  type: string;
  coverage_limit: string;
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

export interface SubscriptionResponse {
  data: {
    code: string;
    message: string | null;
    payload: SubscriptionItem[];
  };
}

export interface SubscriptionListResponse {
  data: {
    payload: SubscriptionItem[];
    pagination: {
      current_page: number;
      last_page: number;
      result_count: number;
    };
  };
}

export interface SingleSubscriptionResponse {
  data: {
    payload: SubscriptionItem;
  };
}

export interface FamilyMember {
  id?: string;
  name: string;
  national_id: string;
  relation: string;
  amount: number;
  subscription_no?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionItem {
  id?: string;
  user_id: string;
  medical_insurance_id: string;
  medical_insurance_category_id?: string | null;
  amount: number;
  subscription_no: string;
  status?: number;
  family_members?: FamilyMember[];
  user?: {
    id: string;
    name: string;
  };
  medical_insurance?: {
    id: string;
    name: string;
    policy_number: string;
  };
  medical_insurance_category?: {
    id: string;
    name: string;
    type?: string;
    coverage_limit?: string;
    description?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubscriptionParams {
  subscriptions: SubscriptionItem[];
}

export interface UpdateSubscriptionParams {
  subscriptions: SubscriptionItem[];
}

// Legacy Dependent interface for backward compatibility
export interface Dependent {
  id?: string;
  name: string;
  residence_number: string;
  relationship: string;
  subscriber_number: string;
  value: string;
}

export interface DependentResponse {
  data: Dependent;
}

export interface DependentListResponse {
  data: {
    payload: Dependent[];
    pagination: {
      current_page: number;
      last_page: number;
      result_count: number;
    };
  };
}

export const MedicalInsuranceApi = {
  list: (params?: { 
    page?: number; 
    per_page?: number;
    name?: string;
    policy_number?: string;
    provider?: string;
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

  // Subscriptions endpoints
  subscriptions: {
    list: (params?: { 
      page?: number; 
      per_page?: number;
      user_id?: string;
      user_ids?: string[];
      medical_insurance_id?: string;
      medical_insurance_category_id?: string;
      status?: number;
    }) => {
      const queryParams: any = { ...params };
      // Convert user_ids array to user_ids[] format
      if (params?.user_ids && Array.isArray(params.user_ids)) {
        delete queryParams.user_ids;
        return baseApi.get<SubscriptionListResponse>("medical-insurances/subscriptions", {
          params: queryParams,
          paramsSerializer: (p) => {
            const searchParams = new URLSearchParams();
            Object.entries(p).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
              }
            });
            params.user_ids!.forEach(id => searchParams.append('user_ids[]', id));
            return searchParams.toString();
          }
        });
      }
      return baseApi.get<SubscriptionListResponse>("medical-insurances/subscriptions", {
        params: queryParams,
      });
    },
    show: (subscriptionId: string) =>
      baseApi.get<SingleSubscriptionResponse>(`medical-insurances/subscriptions/${subscriptionId}`),
    create: (params: CreateSubscriptionParams) =>
      baseApi.post<SubscriptionResponse>("medical-insurances/subscriptions", params),
    update: (params: UpdateSubscriptionParams) =>
      baseApi.put<SubscriptionResponse>("medical-insurances/subscriptions", params),
    delete: (subscriptionId: string) =>
      baseApi.delete(`medical-insurances/subscriptions/${subscriptionId}`),
  },

  // Dependents endpoints
  dependents: {
    list: (subscriptionId: string, params?: { page?: number; per_page?: number }) =>
      baseApi.get<DependentListResponse>(`medical-insurances/subscriptions/${subscriptionId}/dependents`, {
        params,
      }),
    show: (subscriptionId: string, dependentId: string) =>
      baseApi.get<DependentResponse>(`medical-insurances/subscriptions/${subscriptionId}/dependents/${dependentId}`),
    create: (subscriptionId: string, params: Dependent) =>
      baseApi.post<DependentResponse>(`medical-insurances/subscriptions/${subscriptionId}/dependents`, params),
    update: (subscriptionId: string, dependentId: string, params: Partial<Dependent>) =>
      baseApi.put<DependentResponse>(`medical-insurances/subscriptions/${subscriptionId}/dependents/${dependentId}`, params),
    delete: (subscriptionId: string, dependentId: string) =>
      baseApi.delete(`medical-insurances/subscriptions/${subscriptionId}/dependents/${dependentId}`),
  },
};
