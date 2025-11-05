import { apiClient } from "@/config/axios-config";

export interface Branch {
  id: number;
  company_id: string;
  parent_id: string | null;
  is_main: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  branches: Branch[];
  broker: string | null;
  broker_id: string | null;
  company_name: string;
  company_representative_name: string | null;
  registration_number: string;
  residence: string | null;
  status: number;
  type: number;
}

export interface GetClientsResponse {
  code: string;
  message: string | null;
  payload: Client[];
}

export const getClients = async (): Promise<GetClientsResponse> => {
  const response = await apiClient.get("/company-users/clients");
  return response.data;
};
